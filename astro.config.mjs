import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind({
    applyBaseStyles: false,
  })],
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