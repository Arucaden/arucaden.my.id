// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro'
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import rehypeSlug from 'rehype-slug';

// https://astro.build/config
export default defineConfig({
    integrations: 
    [
        UnoCSS(), 
        svelte( { extensions: ['.svelte'] }),
        mdx({
            remarkPlugins: [],
            rehypePlugins: [rehypeSlug],
          }),
    ],
    server: {
        host: true,
    }
});