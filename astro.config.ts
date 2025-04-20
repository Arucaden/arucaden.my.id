// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro'
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
    integrations: 
    [
        UnoCSS(), 
        svelte( { extensions: ['.svelte'] }),
        mdx(),
    ],
});