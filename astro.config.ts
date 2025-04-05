// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro'


import svelte from '@astrojs/svelte';


// https://astro.build/config
export default defineConfig({
    integrations: [UnoCSS({
        // Specify the UnoCSS options here
        presets: [
            // Add any presets you want to use
        ],
        rules: [
            // Add any custom rules you want to define
        ],
        safelist: [
            // Add any classes you want to safelist
        ],
    }), svelte()],
});