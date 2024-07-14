import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { defineCollection, z } from 'astro:content';
import tailwind from "@astrojs/tailwind";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.string(),
    description: z.string(),
    author: z.string(),
  }),
});

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
  ], 
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: `@import 'src/styles/base.css';`
        }
      }
    }
  },
  collections: {
    blog: blogCollection,
  },
});
