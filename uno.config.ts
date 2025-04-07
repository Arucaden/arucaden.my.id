// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetWebFonts, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      collections: {
        'grommet-icons': () => import('@iconify-json/grommet-icons/icons.json').then(i => i.default),
        'ri': () => import('@iconify-json/ri/icons.json').then(i => i.default),
      }
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: '"Figtree", sans-serif'
      }
    }),

  ],
  shortcuts: [
    ['crt-bg', 'bg-[#140a0d] relative overflow-hidden'],
    ['crt-lines', 'absolute inset-0 bg-repeat bg-[linear-gradient(rgba(255,255,255,0.05)_0px,rgba(77,21,21,0.1)_2px,rgba(0,0,0,0.2)_4px)] opacity-30 animate-scanline z-10 pointer-events-none'],
    ['crt-text', 'text-pink-400 text-shadow-[0_0_5px_#ff4d6d,0_0_10px_#ff4d6d,0_0_15px_#ff4d6d] animate-flicker'],
  ],
  theme: {
    fontFamily: {
      sans: '"Figtree", sans-serif',
    },
    colors: {
      'crt-red': '#ff4d6d',
      'crt-bg': '#140a0d',
      'main': '#E7576C',
      'secondary': '#BB404D',
      'white-text': '#F7E2E5',
      'black-text': '#310C0C',
    }
  },
  safelist: ['animate-scanline', 'animate-flicker'],
});
