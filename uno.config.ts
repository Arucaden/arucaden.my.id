import { defineConfig, presetAttributify, presetIcons, presetWind4, presetWebFonts, presetTypography} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
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
    ['button-fx', 'bg-main/20 text-main font-medium hover:hov-button-fx transition-all py-2 px-4 rounded-lg text-center cursor-pointer'],
    ['hov-button-fx', 'scale-102% duration-200 ease-in-out shadow-[0_0_12px_rgba(255,77,109,0.2)] text-white'],
    ['purosu', 'prose prose-p:text-white-text prose-headings:text-white-text prose-strong:text-secondary prose-a:text-white prose-li:marker:text-secondary prose-blockquote:bg-secondary/15 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:break-words prose-table:border-collapse prose-table:text-white/90 prose-th:bg-secondary/20 prose-th:text-left prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-tr:border-b prose-tr:border-secondary/30'],
  ],
  theme: {
    colors: {
      'main': '#FF2E5E',
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
