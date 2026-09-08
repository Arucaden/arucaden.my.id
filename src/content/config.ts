import { defineCollection, z } from 'astro:content';

const galleryItemSchema = z.union([
  z.string(),
  z.object({
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
  }),
]);

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    tech: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    url: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    sourceUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    gallery: z.array(galleryItemSchema).optional(),
    draft: z.boolean().optional(),
    pin: z.boolean().optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    draft: z.boolean().optional(),
    pin: z.boolean().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  blog: blogCollection,
};
