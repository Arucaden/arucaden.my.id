import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  site: 'https://arucaden.my.id',
  integrations: [
    UnoCSS(),
    svelte({ extensions: ['.svelte'] }),
    mdx({
      remarkPlugins: [],
      rehypePlugins: [rehypeSlug],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [
      {
        name: 'serve-slides-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/slides' || req.url === '/slides/') {
              req.url = '/slides/index.html';
            }
            next();
          });
        },
      },
    ],
  },
  server: {
    host: true,
  },
});
