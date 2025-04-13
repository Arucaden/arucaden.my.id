import { defineCollection, z } from 'astro:content';

// Define the schema for your projects
export const collections = {
  projects: defineCollection({
    schema: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
      tech: z.array(z.string()).default([]),
      url: z.string().optional(),
    }),
  }),
};