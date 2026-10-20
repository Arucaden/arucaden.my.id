import type {
  MALAnimeItem,
  MALStats,
  MALMangaItem,
  MALMangaStats,
} from '../types/mal.ts';
import fallbackAnimeData from '../data/mal-anime.json';
import fallbackMangaData from '../data/mal-manga.json';

export const MAL_CLIENT_ID =
  import.meta.env.MAL_CLIENT_ID || '9c2f703956c1c0150ed0d94c45ac5b9c';
export const MAL_CLIENT_SECRET =
  import.meta.env.MAL_CLIENT_SECRET ||
  '3c3bfc92e59b7f3c57b57cbb31ea098de83b8ffac3f31e4298e2e9fe70188818';
export const MAL_USERNAME =
  import.meta.env.MAL_USERNAME || 'Arucaden';

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

export async function fetchLiveUserAnimeList(
  username: string = MAL_USERNAME
): Promise<MALAnimeItem[]> {
  const items: MALAnimeItem[] = [];
  let nextUrl: string | null = `https://api.myanimelist.net/v2/users/${username}/animelist?limit=100&fields=${encodeURIComponent(ANIME_FIELDS)}`;

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      headers: {
        'X-MAL-CLIENT-ID': MAL_CLIENT_ID,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`MAL API error: ${res.status} ${res.statusText}`);
    }

    const data: { data?: MALAnimeItem[]; paging?: { next?: string } } = await res.json();
    if (Array.isArray(data.data)) {
      items.push(...data.data);
    }
    nextUrl = data.paging?.next || null;
  }

  return items;
}

export async function getMalAnimeList(forceLive: boolean = false): Promise<{
  data: MALAnimeItem[];
  username: string;
  source: 'live' | 'cached';
  fetchedAt: string;
}> {
  if (forceLive) {
    try {
      const liveData = await fetchLiveUserAnimeList(MAL_USERNAME);
      if (liveData && liveData.length > 0) {
        return {
          data: liveData,
          username: MAL_USERNAME,
          source: 'live',
          fetchedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[MAL API] Live fetch failed or timed out, using cached dataset:', err);
    }
  }

  return {
    data: (fallbackAnimeData.data as unknown as MALAnimeItem[]) || [],
    username: fallbackAnimeData.username || MAL_USERNAME,
    source: 'cached',
    fetchedAt: fallbackAnimeData.fetchedAt || '2026-10-08T09:27:00Z',
  };
}

export function computeMalStats(items: MALAnimeItem[]): MALStats {
  let watching = 0;
  let completed = 0;
  let planToWatch = 0;
  let dropped = 0;
  let onHold = 0;
  let episodesWatched = 0;
  let totalDurationSec = 0;

  let totalScore = 0;
  let ratedCount = 0;
  const scoreDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  };

  const genreCounts: Record<string, number> = {};
  const studioCounts: Record<string, number> = {};

  for (const item of items) {
    const s = item.list_status?.status;
    if (s === 'watching') watching++;
    else if (s === 'completed') completed++;
    else if (s === 'plan_to_watch') planToWatch++;
    else if (s === 'dropped') dropped++;
    else if (s === 'on_hold') onHold++;

    const ep = item.list_status?.num_episodes_watched || 0;
    episodesWatched += ep;

    const duration = item.node?.average_episode_duration || 1440; // ~24 mins default
    totalDurationSec += ep * duration;

    const score = item.list_status?.score;
    if (score && score > 0) {
      ratedCount++;
      totalScore += score;
      scoreDistribution[score] = (scoreDistribution[score] || 0) + 1;
    }

    if (item.node?.genres) {
      for (const g of item.node.genres) {
        genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
      }
    }

    if (item.node?.studios) {
      for (const st of item.node.studios) {
        studioCounts[st.name] = (studioCounts[st.name] || 0) + 1;
      }
    }
  }

  const daysWatched = Number((totalDurationSec / 86400).toFixed(1));
  const meanScore = ratedCount > 0 ? Number((totalScore / ratedCount).toFixed(2)) : 0;

  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topStudios = Object.entries(studioCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: items.length,
    watching,
    completed,
    planToWatch,
    dropped,
    onHold,
    episodesWatched,
    daysWatched,
    meanScore,
    ratedCount,
    scoreDistribution,
    topGenres,
    topStudios,
  };
}

export async function fetchLiveUserMangaList(
  username: string = MAL_USERNAME
): Promise<MALMangaItem[]> {
  const items: MALMangaItem[] = [];
  let nextUrl: string | null = `https://api.myanimelist.net/v2/users/${username}/mangalist?limit=100&fields=${encodeURIComponent(MANGA_FIELDS)}`;

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      headers: {
        'X-MAL-CLIENT-ID': MAL_CLIENT_ID,
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`MAL API error: ${res.status} ${res.statusText}`);
    }

    const data: { data?: MALMangaItem[]; paging?: { next?: string } } = await res.json();
    if (Array.isArray(data.data)) {
      items.push(...data.data);
    }
    nextUrl = data.paging?.next || null;
  }

  return items;
}

export async function getMalMangaList(forceLive: boolean = false): Promise<{
  data: MALMangaItem[];
  username: string;
  source: 'live' | 'cached';
  fetchedAt: string;
}> {
  if (forceLive) {
    try {
      const liveData = await fetchLiveUserMangaList(MAL_USERNAME);
      if (liveData && liveData.length > 0) {
        return {
          data: liveData,
          username: MAL_USERNAME,
          source: 'live',
          fetchedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[MAL API] Live manga fetch failed or timed out, using cached dataset:', err);
    }
  }

  return {
    data: (fallbackMangaData.data as unknown as MALMangaItem[]) || [],
    username: fallbackMangaData.username || MAL_USERNAME,
    source: 'cached',
    fetchedAt: fallbackMangaData.fetchedAt || '2026-10-20T00:00:00Z',
  };
}

export function computeMalMangaStats(items: MALMangaItem[]): MALMangaStats {
  let reading = 0;
  let completed = 0;
  let planToRead = 0;
  let dropped = 0;
  let onHold = 0;
  let chaptersRead = 0;
  let volumesRead = 0;

  let totalScore = 0;
  let ratedCount = 0;
  const scoreDistribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
  };

  const genreCounts: Record<string, number> = {};
  const authorCounts: Record<string, number> = {};

  for (const item of items) {
    const s = item.list_status?.status;
    if (s === 'reading') reading++;
    else if (s === 'completed') completed++;
    else if (s === 'plan_to_read') planToRead++;
    else if (s === 'dropped') dropped++;
    else if (s === 'on_hold') onHold++;

    const ch = item.list_status?.num_chapters_read || 0;
    chaptersRead += ch;

    const vol = item.list_status?.num_volumes_read || 0;
    volumesRead += vol;

    const score = item.list_status?.score;
    if (score && score > 0) {
      ratedCount++;
      totalScore += score;
      scoreDistribution[score] = (scoreDistribution[score] || 0) + 1;
    }

    if (item.node?.genres) {
      for (const g of item.node.genres) {
        genreCounts[g.name] = (genreCounts[g.name] || 0) + 1;
      }
    }

    if (item.node?.authors) {
      for (const a of item.node.authors) {
        const name = `${a.node.first_name || ''} ${a.node.last_name || ''}`.trim();
        if (name) {
          authorCounts[name] = (authorCounts[name] || 0) + 1;
        }
      }
    }
  }

  const meanScore = ratedCount > 0 ? Number((totalScore / ratedCount).toFixed(2)) : 0;

  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topAuthors = Object.entries(authorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: items.length,
    reading,
    completed,
    planToRead,
    dropped,
    onHold,
    chaptersRead,
    volumesRead,
    meanScore,
    ratedCount,
    scoreDistribution,
    topGenres,
    topAuthors,
  };
}
