import { defineConfig, presetAttributify, presetIcons, presetWind4, presetWebFonts} from 'unocss'
import { presetAnimations } from 'unocss-preset-animations'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetAnimations(),
    presetWebFonts({
      themeKey: 'font',
      provider: 'google',
      fonts: {
        sans: 'Figtree',
        mono: 'Fira Code',
      }
    }),

    presetIcons({
      collections: {
        'grommet-icons': () => import('@iconify-json/grommet-icons/icons.json').then(i => i.default),
        'ri': () => import('@iconify-json/ri/icons.json').then(i => i.default),
      }
    }),

  ],
  shortcuts: [
    ['image-border', 'border-2 border-secondary p-1'],
    ['image-border2', 'border-2 border-tertiary p-1'],
    ['hov-fx', 'scale-104% duration-200 ease-in-out shadow-[0_0_16px_rgba(255,77,109,0.5)] border-2 border-main'],
  ],
  theme: {
    colors: {
      'main': '#ff0077',
      'secondary': '#DB4B59',
      'tertiary': '#8A2F38',
      'main-shade': '#A13741',
      'white-text': '#F7E2E5',
      'black-text': '#310C0C',
    },
  },
  safelist: [
    'i-grommet-icons:js',
    'i-grommet-icons:python',
    'i-grommet-icons:gamepad',
    'i-grommet-icons:code',
    'i-grommet-icons:brush',
    'i-grommet-icons:astro',
    'i-grommet-icons:css3',
    'i-grommet-icons:svelte',
    'i-grommet-icons:blender',
    'i-grommet-icons:figma',
    'i-grommet-icons:database',
    'i-grommet-icons:flutter',
    'i-grommet-icons:java',
    'i-grommet-icons:clipstudio',
  ],
});
