import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    image: z.string().optional(),
    tech: z.array(z.string()).optional(),
    url: z.string().optional(),
    sourceUrl: z.string().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
};