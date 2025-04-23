import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    tech: z.array(z.string()).optional(),
    url: z.string().optional(),
    sourceUrl: z.string().optional(),
    publishDate: z.date().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
};