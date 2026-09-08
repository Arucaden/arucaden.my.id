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
  tech: string[];
  tags?: string[];
  category?: string;
  url?: string;
  liveUrl?: string;
  sourceUrl?: string;
  repoUrl?: string;
  gallery?: ProjectGalleryItem[];
  slug: string;
  pin?: boolean;
};