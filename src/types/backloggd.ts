export type BackloggdStatus =
  | 'playing'
  | 'completed'
  | 'mastered'
  | 'backlog'
  | 'abandoned'
  | 'retired'
  | 'wishlist';

export interface BackloggdGame {
  id: string | number;
  title: string;
  slug?: string;
  cover: string;
  releaseYear?: number;
  platforms?: string[];
  genres?: string[];
  developer?: string;
  publisher?: string;
  synopsis?: string;
  status: BackloggdStatus;
  rating?: number; // 0.5 to 5.0 stars (or 1 to 10)
  hoursPlayed?: number;
  review?: string;
  notes?: string;
  finishedDate?: string;
  updatedAt?: string;
  isFavorite?: boolean;
}

export interface BackloggdStats {
  total: number;
  playing: number;
  completed: number;
  mastered: number;
  backlog: number;
  abandoned: number;
  wishlist: number;
  meanRating: number;
  ratedCount: number;
  ratingDistribution: Record<number | string, number>; // 5 down to 0.5 stars
  topGenres: { name: string; count: number }[];
  topPlatforms: { name: string; count: number }[];
}
