import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLIENT_ID = process.env.MAL_CLIENT_ID || '9c2f703956c1c0150ed0d94c45ac5b9c';
const USERNAME = process.env.MAL_USERNAME || 'Arucaden';

const ANIME_FIELDS = [
  'list_status{status,score,num_episodes_watched,is_rewatching,updated_at,start_date,finish_date,comments}',
  'alternative_titles',
  'start_date',
  'end_date',
  'synopsis',
  'mean',
  'rank',
  'popularity',
  'num_list_users',
  'num_scoring_users',
  'media_type',
  'status',
  'genres',
  'num_episodes',
  'start_season',
  'source',
  'average_episode_duration',
  'rating',
  'studios',
].join(',');

const MANGA_FIELDS = [
  'list_status{status,score,num_volumes_read,num_chapters_read,is_rereading,updated_at,start_date,finish_date,comments}',
  'alternative_titles',
  'start_date',
  'end_date',
  'synopsis',
  'mean',
  'rank',
  'popularity',
  'num_list_users',
  'num_scoring_users',
  'media_type',
  'status',
  'genres',
  'num_volumes',
  'num_chapters',
  'authors{node{id,first_name,last_name},role}',
  'serialization{node{id,name}}',
].join(',');

async function syncList(endpoint, fields, outputFilename, label) {
  console.log(`[MAL Sync] Fetching ${label} list for user: ${USERNAME}...`);
  let url = `https://api.myanimelist.net/v2/users/${USERNAME}/${endpoint}?limit=100&fields=${encodeURIComponent(fields)}`;
  const allItems = [];

  while (url) {
    console.log(`[MAL Sync] Requesting ${label} batch: ${url.slice(0, 80)}...`);
    const res = await fetch(url, {
      headers: {
        'X-MAL-CLIENT-ID': CLIENT_ID,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch MAL ${label} data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (Array.isArray(data.data)) {
      allItems.push(...data.data);
    }
    url = data.paging?.next || null;
  }

  const outputPath = path.resolve(__dirname, `../src/data/${outputFilename}`);
  const payload = {
    username: USERNAME,
    fetchedAt: new Date().toISOString(),
    total: allItems.length,
    data: allItems,
  };

  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[MAL Sync] Successfully saved ${allItems.length} ${label} entries to ${outputPath}`);
}

async function main() {
  await syncList('animelist', ANIME_FIELDS, 'mal-anime.json', 'anime');
  await syncList('mangalist', MANGA_FIELDS, 'mal-manga.json', 'manga');
}

main().catch((err) => {
  console.error('[MAL Sync] Error:', err);
  process.exit(1);
});
