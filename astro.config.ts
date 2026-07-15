import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro'
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
    integrations: [
        UnoCSS(), 
        svelte({ extensions: ['.svelte'] }),
        mdx({
            remarkPlugins: [],
            rehypePlugins: [rehypeSlug],
        }),
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
                }
            }
        ]
    },
    server: {
        host: true,
    }
});
