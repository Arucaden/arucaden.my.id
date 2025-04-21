import { defineConfig, presetAttributify, presetIcons, presetWind4, presetWebFonts} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetWebFonts({
      themeKey: 'font',
      provider: 'google',
      fonts: {
        sans: 'Figtree',
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
    ['image-border', 'border-2 border-secondary p-1 rounded-lg'],
    ['image-border2', 'border-2 border-tertiary p-1 rounded-lg'],
    ['hov-fx', 'scale-104% duration-200 ease-in-out shadow-[0_0_16px_rgba(255,77,109,0.5)] border-2 border-main'],
    ['section-title', 'text-sm font-medium text-secondary text-secondary mb-1'],
    ['project-side-title', 'text-base font-bold text-main text-secondary mb-1'],
    ['prose-text', 'text-base leading-relaxed text-white'],
  ],
  theme: {
    colors: {
      'main': '#FF0077',
      'secondary': '#DB4B59',
      'tertiary': '#8A2F38',
      'main-shade': '#A13741',
      'white-text': '#F7E2E5',
      'gray-text': '#E1BBC2',
      'black-text': '#310C0C',
    },
  },
  safelist: [],
});
