import type { TechName } from '../data/techstack.ts';

export type ProjectCategory = 'game' | 'web' | 'mobile' | 'apps';
export type ProjectTag = '#game' | '#apps' | '#web' | '#mobile';

export type ProjectGalleryItem =
  | string
  | {
      src: string;
      alt?: string;
      caption?: string;
    };

export type Project = {
  title: string;
  description: string;
  date: string;
  image: string;
  tech: TechName[];
  tags: ProjectTag[];
  category?: ProjectCategory;
  url?: string;
  liveUrl?: string;
  sourceUrl?: string;
  repoUrl?: string;
  gallery?: ProjectGalleryItem[];
  slug: string;
  pin?: boolean;
};
