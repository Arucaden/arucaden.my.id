import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Automatically read .env if present in root
 */
async function loadEnvIfPresent() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const content = await fs.readFile(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  } catch {
    // Ignore missing .env
  }
}

function unescapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

/**
 * Simple CSV parser supporting quotes and commas
 */
function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const parseRow = (line) => {
    const row = [];
    let inQuotes = false;
    let entry = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += c;
      }
    }
    row.push(entry.trim());
    return row.map((r) => r.replace(/^"(.*)"$/, '$1').trim());
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (values.length === 0 || (values.length === 1 && !values[0])) continue;
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = values[j] !== undefined ? values[j] : '';
    }
    results.push(item);
  }

  return results;
}

/**
 * Normalize imported records from Toolkittd, Backloggd CSV, or JSON
 */
function normalizeRecord(rec) {
  const title = unescapeHtml(
    rec.title ||
      rec['game title'] ||
      rec['title'] ||
      rec.name ||
      'Untitled Game'
  );

  const id =
    rec.id ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  let rawRating =
    rec.rating ??
    rec['rating'] ??
    rec.score ??
    rec['score'] ??
    0;
  let rating = parseFloat(rawRating) || 0;
  if (rating > 5 && rating <= 10) rating = rating / 2;
  else if (rating > 10) rating = (rating / 100) * 5;

  const rawStatus = (
    rec.status ||
    rec['status'] ||
    rec.state ||
    'completed'
  ).toLowerCase();
  let status = 'completed';
  if (rawStatus.includes('play')) status = 'playing';
  else if (rawStatus.includes('master')) status = 'mastered';
  else if (rawStatus.includes('comp')) status = 'completed';
  else if (rawStatus.includes('wish')) status = 'wishlist';
  else if (
    rawStatus.includes('drop') ||
    rawStatus.includes('abandon') ||
    rawStatus.includes('retire')
  ) {
    status = 'abandoned';
  } else if (rawStatus.includes('backlog')) {
    status = 'backlog';
  }

  let releaseYear = undefined;
  const rawYear =
    rec.releaseYear ??
    rec['release year'] ??
    rec.release_year ??
    rec['release date'] ??
    rec.release_date ??
    rec.year;
  if (rawYear) {
    const parsed = parseInt(String(rawYear).match(/\d{4}/)?.[0] || '', 10);
    if (!isNaN(parsed) && parsed > 1970 && parsed < 2050) {
      releaseYear = parsed;
    }
  }

  let hoursPlayed = undefined;
  const rawHours =
    rec.hoursPlayed ??
    rec['hours played'] ??
    rec.hours_played ??
    rec['time played'] ??
    rec.time_played ??
    rec.hours;
  if (rawHours) {
    const parsed = parseFloat(String(rawHours).replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) hoursPlayed = parsed;
  }

  const cover =
    rec.cover ||
    rec['cover'] ||
    rec.cover_url ||
    rec['cover url'] ||
    rec.image ||
    `https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png`;

  let platforms = [];
  const rawPlatforms =
    rec.platforms || rec['platform'] || rec['platforms'] || rec.platform;
  if (Array.isArray(rawPlatforms)) {
    platforms = rawPlatforms.map((p) => String(p).trim()).filter(Boolean);
  } else if (typeof rawPlatforms === 'string' && rawPlatforms.trim()) {
    platforms = rawPlatforms
      .split(/[,/|]/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  let genres = [];
  const rawGenres = rec.genres || rec['genres'] || rec['genre'] || rec.genre;
  if (Array.isArray(rawGenres)) {
    genres = rawGenres.map((g) => String(g).trim()).filter(Boolean);
  } else if (typeof rawGenres === 'string' && rawGenres.trim()) {
    genres = rawGenres
      .split(/[,/|]/)
      .map((g) => g.trim())
      .filter(Boolean);
  }

  const developer =
    rec.developer || rec['developer'] || rec.studio || rec['studio'] || undefined;

  const synopsis =
    rec.synopsis || rec.description || rec['description'] || undefined;

  const review =
    rec.review ||
    rec['review'] ||
    rec.notes ||
    rec['notes'] ||
    rec.comment ||
    rec.comments ||
    undefined;

  const isFavorite = Boolean(
    rec.isFavorite ||
      rec['favorite'] === 'true' ||
      rec['favorite'] === true ||
      rec['is_favorite']
  );

  return {
    id,
    title,
    releaseYear,
    developer,
    cover,
    rating: rating > 0 ? rating : undefined,
    status,
    hoursPlayed,
    platforms: platforms.length > 0 ? platforms : undefined,
    genres: genres.length > 0 ? genres : undefined,
    synopsis: synopsis ? synopsis.trim() : undefined,
    review: review ? review.trim() : undefined,
    isFavorite: isFavorite || undefined,
  };
}

/**
 * Fetch a URL with retry and cookie headers
 */
async function fetchWithCookie(url, cookie) {
  return fetch(url, {
    headers: {
      Cookie: cookie,
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    },
  });
}

/**
 * Parse cards from a Backloggd HTML snippet
 */
function parseCardsFromHtml(html) {
  const cardRegex =
    /<div class="card[^"]*game-cover[^"]*"([^>]*)>[\s\S]*?<a href="\/games\/([^"\/]+)\/"[^>]*><\/a>[\s\S]*?<img class="card-img[^"]*" src="([^"]+)" alt="([^"]+)"/g;

  const results = [];
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const attrs = match[1];
    const slug = match[2];
    const cover = match[3];
    const rawTitle = match[4];
    const title = unescapeHtml(rawTitle);

    const ratingMatch = attrs.match(/data-rating="([^"]+)"/);
    let rating = undefined;
    if (ratingMatch && ratingMatch[1]) {
      const val = parseFloat(ratingMatch[1]);
      if (!isNaN(val) && val > 0) {
        rating = val / 2;
      }
    }

    results.push({
      slug,
      title,
      cover,
      rating,
    });
  }
  return results;
}

/**
 * Fetch individual game page to enrich with description, year, developer, genres, and platforms
 */
async function fetchGameDetails(slug, cookie) {
  try {
    const res = await fetchWithCookie(`https://backloggd.com/games/${slug}/`, cookie);
    if (!res.ok) return null;
    const html = await res.text();

    // 1. Description from JSON-LD or meta
    let synopsis = '';
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i
    );
    if (jsonLdMatch) {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        synopsis = parsed.itemReviewed?.description || parsed.description || '';
      } catch {}
    }
    if (!synopsis) {
      const meta = html.match(
        /<meta (?:name|property)="[^"]*description"[^>]*content="([^"]+)"/i
      );
      if (meta) synopsis = unescapeHtml(meta[1]);
    }

    // 2. Release year
    let releaseYear = undefined;
    const yearMatch =
      html.match(/<a href="\/year\/(\d{4})\/"/i) ||
      html.match(/<title>[^<]*\((\d{4})\)<\/title>/i);
    if (yearMatch) releaseYear = parseInt(yearMatch[1], 10);

    // 3. Developer
    let developer = undefined;
    const devMatch = html.match(/<a href="\/company\/[^"]*\/">([^<]+)<\/a>/i);
    if (devMatch) developer = unescapeHtml(devMatch[1]);

    // 4. Genres
    const genres = [];
    const genreRegex =
      /href="\/games\/lib\/popular\/genre:[^"]*\/">([^<]+)<\/a>/g;
    let gm;
    while ((gm = genreRegex.exec(html)) !== null) {
      genres.push(unescapeHtml(gm[1].trim()));
    }

    // 5. Platforms
    const platforms = [];
    const platRegex =
      /class="[^"]*game-page-platform[^"]*"[^>]*>[\s\S]*?<\/i>\s*([^<]+)<\/a>/g;
    let pm;
    while ((pm = platRegex.exec(html)) !== null) {
      platforms.push(unescapeHtml(pm[1].trim()));
    }

    return {
      synopsis: synopsis ? synopsis.trim() : undefined,
      releaseYear,
      developer,
      genres: genres.length > 0 ? Array.from(new Set(genres)) : undefined,
      platforms: platforms.length > 0 ? Array.from(new Set(platforms)) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Concurrency worker pool
 */
async function pool(items, concurrency, fn) {
  const results = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      results[index] = await fn(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}

/**
 * Main Sync Script
 */
async function main() {
  await loadEnvIfPresent();

  const args = process.argv.slice(2);
  const userIdx = args.indexOf('--user');
  const cookieIdx = args.indexOf('--cookie');
  const importIdx = args.indexOf('--import');

  const USERNAME =
    userIdx !== -1 && args[userIdx + 1]
      ? args[userIdx + 1]
      : process.env.BACKLOGGD_USERNAME || 'Arucaden';

  const COOKIE =
    cookieIdx !== -1 && args[cookieIdx + 1]
      ? args[cookieIdx + 1]
      : process.env.BACKLOGGD_COOKIE || '';

  const outputPath = path.resolve(__dirname, '../src/data/backloggd-games.json');

  // Option 1: Local File Import (JSON or CSV)
  if (importIdx !== -1 && args[importIdx + 1]) {
    const importPath = path.resolve(process.cwd(), args[importIdx + 1]);
    console.log(`[Backloggd Sync] Reading export file from: ${importPath}`);

    const content = await fs.readFile(importPath, 'utf-8');
    let rawRecords = [];

    if (
      importPath.endsWith('.csv') ||
      content.trim().startsWith('Title,') ||
      content.trim().startsWith('"Title"')
    ) {
      console.log('[Backloggd Sync] Detected CSV format. Parsing rows...');
      rawRecords = parseCsv(content);
    } else {
      console.log('[Backloggd Sync] Detected JSON format. Parsing entries...');
      const parsed = JSON.parse(content);
      rawRecords = Array.isArray(parsed)
        ? parsed
        : parsed.data || parsed.games || parsed.items || [];
    }

    const normalizedGames = rawRecords.map(normalizeRecord);

    const payload = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      total: normalizedGames.length,
      data: normalizedGames,
    };

    await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(`\n✅ [Backloggd Sync] Successfully imported ${normalizedGames.length} games to:`);
    console.log(`   ${outputPath}`);
    console.log(`\nPreview at: http://localhost:4321/games\n`);
    return;
  }

  // Option 2: Live Scraping with Session Cookie
  console.log(`[Backloggd Sync] Syncing library for user: ${USERNAME}...`);

  if (!COOKIE) {
    console.log('\n--------------------------------------------------------------');
    console.log('  ⚠️  [Backloggd Sync] No BACKLOGGD_COOKIE provided in .env');
    console.log('--------------------------------------------------------------');
    console.log('Because Backloggd uses the Anubis bot challenge, choosing one of');
    console.log('the following methods will sync your library:\n');
    console.log('1. Export your data (Fastest & 100% Reliable):');
    console.log('   - Export JSON or CSV using the Toolkittd extension or Backloggd settings:');
    console.log('     https://backloggd.com/settings/data/');
    console.log('   - Run the import command:');
    console.log('     bun run sync:backloggd --import path/to/backloggd-export.json\n');
    console.log('2. Or provide your browser cookie in .env:');
    console.log('   - Add BACKLOGGD_COOKIE to your .env file');
    console.log('   - Run: bun run sync:backloggd\n');
    return;
  }

  // 1. Fetch Playing games
  const playingMap = new Map();
  try {
    console.log('[Backloggd Sync] Fetching playing status list...');
    const playingRes = await fetchWithCookie(
      `https://backloggd.com/u/${USERNAME}/playing`,
      COOKIE
    );
    if (playingRes.ok) {
      const playingHtml = await playingRes.text();
      const cards = parseCardsFromHtml(playingHtml);
      for (const card of cards) {
        playingMap.set(card.slug, card);
      }
    }
    console.log(`[Backloggd Sync] Playing games detected: ${playingMap.size}`);
  } catch (err) {
    console.warn('[Backloggd Sync] Could not fetch playing list:', err.message);
  }

  // 2. Fetch Wishlist games
  const wishlistMap = new Map();
  try {
    console.log('[Backloggd Sync] Fetching wishlist status list...');
    const wishlistRes = await fetchWithCookie(
      `https://backloggd.com/u/${USERNAME}/wishlist`,
      COOKIE
    );
    if (wishlistRes.ok) {
      const wishlistHtml = await wishlistRes.text();
      const cards = parseCardsFromHtml(wishlistHtml);
      for (const card of cards) {
        wishlistMap.set(card.slug, card);
      }
    }
    console.log(`[Backloggd Sync] Wishlist games detected: ${wishlistMap.size}`);
  } catch (err) {
    console.warn('[Backloggd Sync] Could not fetch wishlist list:', err.message);
  }

  // 3. Fetch all library pages
  let page = 1;
  const rawList = [];
  const seenSlugs = new Set();

  while (true) {
    const url = `https://backloggd.com/u/${USERNAME}/games?page=${page}`;
    console.log(`[Backloggd Sync] Requesting page ${page}...`);

    let res;
    try {
      res = await fetchWithCookie(url, COOKIE);
    } catch (err) {
      console.error(`[Backloggd Sync] Network request failed:`, err.message);
      break;
    }

    if (!res.ok) {
      console.warn(`[Backloggd Sync] HTTP ${res.status}: ${res.statusText}`);
      break;
    }

    const html = await res.text();
    if (html.includes("Making sure you're not a bot")) {
      console.error(
        '\n❌ [Backloggd Sync] Anubis proof-of-work challenge blocked the request.'
      );
      console.error(
        'Please refresh your browser session on backloggd.com and copy the updated Cookie header.\n'
      );
      break;
    }

    const cards = parseCardsFromHtml(html);
    let pageMatches = cards.length;

    for (const card of cards) {
      const { slug, title, cover, rating } = card;

      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      let status = 'completed';
      if (playingMap.has(slug)) {
        status = 'playing';
      } else if (wishlistMap.has(slug)) {
        status = 'wishlist';
      } else if (rating === 5) {
        status = 'mastered';
      }

      rawList.push({
        id: slug,
        slug,
        title,
        cover,
        rating,
        status,
        isFavorite: rating === 5 || undefined,
      });
    }

    console.log(`[Backloggd Sync] Page ${page}: ${pageMatches} games parsed.`);

    if (pageMatches === 0 || page > 50) {
      break;
    }

    page++;
    await new Promise((r) => setTimeout(r, 600));
  }

  // 4. Merge unlisted Playing games
  for (const [slug, card] of playingMap.entries()) {
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      rawList.unshift({
        id: slug,
        slug,
        title: card.title,
        cover: card.cover,
        rating: card.rating,
        status: 'playing',
        isFavorite: undefined,
      });
    }
  }

  // 5. Merge unlisted Wishlist games
  for (const [slug, card] of wishlistMap.entries()) {
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      rawList.push({
        id: slug,
        slug,
        title: card.title,
        cover: card.cover,
        rating: card.rating,
        status: 'wishlist',
        isFavorite: undefined,
      });
    }
  }

  console.log(`\n[Backloggd Sync] Total games discovered: ${rawList.length}`);
  console.log(`[Backloggd Sync] Enriching descriptions, release years, developers, genres, and platforms...`);

  let completedCount = 0;
  const enrichedGames = await pool(rawList, 8, async (game) => {
    const details = await fetchGameDetails(game.slug, COOKIE);
    completedCount++;
    if (completedCount % 25 === 0 || completedCount === rawList.length) {
      console.log(`[Backloggd Details] Progress: ${completedCount}/${rawList.length} games enriched.`);
    }

    return {
      id: game.id,
      title: game.title,
      cover: game.cover,
      rating: game.rating,
      status: game.status,
      releaseYear: details?.releaseYear || undefined,
      developer: details?.developer || undefined,
      synopsis: details?.synopsis || undefined,
      platforms: details?.platforms || ['PC'],
      genres: details?.genres || ['Video Game'],
      isFavorite: game.isFavorite,
    };
  });

  if (enrichedGames.length > 0) {
    const payload = {
      username: USERNAME,
      fetchedAt: new Date().toISOString(),
      total: enrichedGames.length,
      data: enrichedGames,
    };
    await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
    console.log(
      `\n✅ [Backloggd Sync] Successfully enriched and saved ${enrichedGames.length} games to:`
    );
    console.log(`   ${outputPath}`);
    console.log(`\nPreview at: http://localhost:4321/games\n`);
  } else {
    console.log('[Backloggd Sync] No games could be parsed from the HTML.');
  }
}

main().catch((err) => {
  console.error('[Backloggd Sync] Fatal Error:', err);
});
