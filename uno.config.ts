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
        sans: 'Figtree:400,700,800',
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
    ['badge-shape', 'rounded-md border font-medium tracking-wide whitespace-nowrap transition-all'],
    ['badge', 'px-2 py-0.5 text-xs badge-shape'],
    ['badge-lg', 'px-3 py-1 text-sm rounded-lg border-2 font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer'],
    ['badge-active', 'bg-main/15 text-main border-main/40'],
    ['badge-inactive', 'bg-black/40 text-gray-text border-tertiary/70'],
    ['badge-solid', 'bg-main border-main text-black-text shadow-[0_0_8px_rgba(226,81,114,0.4)]'],
    ['button-fx', 'bg-main/20 text-main font-medium hover:hov-button-fx transition-all py-2 px-4 rounded-lg text-center cursor-pointer'],
    ['hov-button-fx', 'scale-102% duration-200 ease-in-out shadow-[0_0_12px_rgba(255,77,109,0.2)] text-white'],
    
    ['purosu', 'prose prose-p:text-white-text prose-headings:text-main prose-strong:text-white prose-a:text-main prose-a:underline hover:prose-a:text-white prose-li:marker:text-secondary prose-li:text-white-text prose-ul:list-[\'-\'] prose-blockquote:bg-secondary/15 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-lg prose-blockquote:break-words prose-blockquote:border-main prose-table:border-collapse prose-table:text-white/90 prose-th:bg-secondary/20 prose-th:text-left prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-tr:border-b prose-tr:border-secondary/30'],
  ],
  theme: {
    colors: {
      'main': '#E25172',
      'secondary': '#E25172',
      'tertiary': '#934355',
      'main-shade': '#A13741',
      'white-text': '#F7E2E5',
      'gray-text': '#E1BBC2',
      'black-text': '#310C0C',
    },
  },
});
