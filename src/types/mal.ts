export type MALWatchStatus =
  | 'watching'
  | 'completed'
  | 'on_hold'
  | 'dropped'
  | 'plan_to_watch';

export type MALMangaReadStatus =
  | 'reading'
  | 'completed'
  | 'on_hold'
  | 'dropped'
  | 'plan_to_read';

export interface MALGenre {
  id: number;
  name: string;
}

export interface MALStudio {
  id: number;
  name: string;
}

export interface MALAuthorNode {
  id: number;
  first_name: string;
  last_name: string;
}

export interface MALAuthor {
  node: MALAuthorNode;
  role: string;
}

export interface MALSerializationNode {
  id: number;
  name: string;
}

export interface MALSerialization {
  node: MALSerializationNode;
}

export interface MALMainPicture {
  medium: string;
  large?: string;
}

export interface MALStartSeason {
  year: number;
  season: 'winter' | 'spring' | 'summer' | 'fall' | string;
}

export interface MALAlternativeTitles {
  synonyms?: string[];
  en?: string;
  ja?: string;
}

export interface MALListStatus {
  status: MALWatchStatus;
  score: number;
  num_episodes_watched: number;
  is_rewatching: boolean;
  updated_at: string;
  start_date?: string;
  finish_date?: string;
  comments?: string;
}

export interface MALAnimeNode {
  id: number;
  title: string;
  main_picture?: MALMainPicture;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_episodes?: number;
  status?: string;
  genres?: MALGenre[];
  synopsis?: string;
  start_season?: MALStartSeason;
  studios?: MALStudio[];
  media_type?: string;
  source?: string;
  average_episode_duration?: number;
  rating?: string;
  alternative_titles?: MALAlternativeTitles;
}

export interface MALAnimeItem {
  node: MALAnimeNode;
  list_status: MALListStatus;
}

export interface MALStats {
  total: number;
  watching: number;
  completed: number;
  planToWatch: number;
  dropped: number;
  onHold: number;
  episodesWatched: number;
  daysWatched: number;
  meanScore: number;
  ratedCount: number;
  scoreDistribution: Record<number, number>;
  topGenres: { name: string; count: number }[];
  topStudios: { name: string; count: number }[];
}

export interface MALMangaListStatus {
  status: MALMangaReadStatus;
  score: number;
  num_volumes_read: number;
  num_chapters_read: number;
  is_rereading: boolean;
  updated_at: string;
  start_date?: string;
  finish_date?: string;
  comments?: string;
}

export interface MALMangaNode {
  id: number;
  title: string;
  main_picture?: MALMainPicture;
  mean?: number;
  rank?: number;
  popularity?: number;
  num_volumes?: number;
  num_chapters?: number;
  status?: string;
  genres?: MALGenre[];
  synopsis?: string;
  start_date?: string;
  end_date?: string;
  authors?: MALAuthor[];
  serialization?: MALSerialization[];
  media_type?: string;
  alternative_titles?: MALAlternativeTitles;
}

export interface MALMangaItem {
  node: MALMangaNode;
  list_status: MALMangaListStatus;
}

export interface MALMangaStats {
  total: number;
  reading: number;
  completed: number;
  planToRead: number;
  dropped: number;
  onHold: number;
  chaptersRead: number;
  volumesRead: number;
  meanScore: number;
  ratedCount: number;
  scoreDistribution: Record<number, number>;
  topGenres: { name: string; count: number }[];
  topAuthors: { name: string; count: number }[];
}

export type MALMediaType = 'anime' | 'manga';
