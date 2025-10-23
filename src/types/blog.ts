export type Blog = {
  title: string;
  slug: string;
  excerpt: string;
  date: string; // ISO or human-readable
  readTime?: string; // e.g., '5 min read'
  tags?: string[];
  href?: string; // optional absolute or relative link
};

