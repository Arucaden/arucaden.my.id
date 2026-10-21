import type { BackloggdGame, BackloggdStats } from '../types/backloggd.ts';
import backloggdGamesData from '../data/backloggd-games.json';

export const BACKLOGGD_USERNAME =
  import.meta.env.BACKLOGGD_USERNAME || 'Arucaden';

export function computeBackloggdStats(items: BackloggdGame[]): BackloggdStats {
  let playing = 0;
  let completed = 0;
  let mastered = 0;
  let backlog = 0;
  let abandoned = 0;
  let wishlist = 0;

  let totalRating = 0;
  let ratedCount = 0;
  const ratingDistribution: Record<number | string, number> = {
    5: 0,
    4.5: 0,
    4: 0,
    3.5: 0,
    3: 0,
    2.5: 0,
    2: 0,
    1.5: 0,
    1: 0,
    0.5: 0,
  };

  const genreCounts: Record<string, number> = {};
  const platformCounts: Record<string, number> = {};

  for (const item of items) {
    const s = item.status;
    if (s === 'playing') playing++;
    else if (s === 'completed') completed++;
    else if (s === 'mastered') mastered++;
    else if (s === 'backlog') backlog++;
    else if (s === 'abandoned' || s === 'retired') abandoned++;
    else if (s === 'wishlist') wishlist++;

    const rating = item.rating;
    if (rating && rating > 0) {
      ratedCount++;
      totalRating += rating;
      const normalized = rating > 5 ? rating / 2 : rating;
      const step = Math.round(normalized * 2) / 2;
      ratingDistribution[step] = (ratingDistribution[step] || 0) + 1;
    }

    if (item.genres) {
      for (const g of item.genres) {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      }
    }

    if (item.platforms) {
      for (const p of item.platforms) {
        platformCounts[p] = (platformCounts[p] || 0) + 1;
      }
    }
  }

  const meanRating =
    ratedCount > 0 ? Number((totalRating / ratedCount).toFixed(2)) : 0;

  const topGenres = Object.entries(genreCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topPlatforms = Object.entries(platformCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    total: items.length,
    playing,
    completed,
    mastered,
    backlog,
    abandoned,
    wishlist,
    meanRating,
    ratedCount,
    ratingDistribution,
    topGenres,
    topPlatforms,
  };
}

export function pruneBackloggdGame(game: BackloggdGame): BackloggdGame {
  return {
    id: game.id,
    title: game.title,
    slug: game.slug,
    cover: game.cover,
    releaseYear: game.releaseYear,
    platforms: game.platforms,
    genres: game.genres,
    developer: game.developer,
    publisher: game.publisher,
    synopsis: game.synopsis,
    status: game.status,
    rating: game.rating,
    hoursPlayed: game.hoursPlayed,
    review: game.review,
    notes: game.notes,
    finishedDate: game.finishedDate,
    updatedAt: game.updatedAt,
    isFavorite: game.isFavorite,
  };
}

export async function getBackloggdGameList(): Promise<{
  data: BackloggdGame[];
  username: string;
  source: 'cached';
  fetchedAt: string;
}> {
  const games = (backloggdGamesData.data as BackloggdGame[]) || [];
  return {
    data: games.map(pruneBackloggdGame),
    username: backloggdGamesData.username || BACKLOGGD_USERNAME,
    source: 'cached',
    fetchedAt: backloggdGamesData.fetchedAt || new Date().toISOString(),
  };
}
