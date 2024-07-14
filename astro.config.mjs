import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({
    applyBaseStyles: false
  }), mdx()],
  vite: {
    css: {
      preprocessorOptions: {
        css: {
          additionalData: `@import 'src/styles/base.css';`
        }
      }
    }
  }
});