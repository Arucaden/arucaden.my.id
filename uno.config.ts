import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  presetTypography,
} from 'unocss';

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      collections: {
        'grommet-icons': () =>
          import('@iconify-json/grommet-icons/icons.json').then((i) => i.default),
        ri: () => import('@iconify-json/ri/icons.json').then((i) => i.default),
      },
    }),
  ],
  shortcuts: [
    // Glassmorphism & Surface utilities
    ['glass-panel', 'bg-[rgba(18,14,24,0.75)] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.37)]'],
    ['glass-panel-subtle', 'bg-[rgba(14,11,18,0.6)] backdrop-blur-md border border-white/[0.08] rounded-xl'],
    ['glass-panel-glow', 'bg-[rgba(22,16,30,0.85)] backdrop-blur-xl border border-main/30 rounded-2xl shadow-[0_0_24px_rgba(255,59,105,0.15)]'],
    
    // Interactive & Cards
    ['interactive-card', 'transition-all duration-300 ease-out hover:translate-y--1 hover:border-main/50 hover:shadow-[0_12px_30px_-10px_rgba(255,59,105,0.25)]'],
    ['image-border', 'border border-white/10 p-1 rounded-xl'],
    ['image-border2', 'border border-tertiary/60 p-1 rounded-xl'],
    [
      'hov-fx',
      'transition-all duration-300 ease-out hover:scale-[1.02] hover:border-main hover:shadow-[0_0_20px_rgba(255,59,105,0.35)]',
    ],
    
    // Typography & Titles
    ['section-title', 'text-xs font-mono font-medium tracking-widest text-main uppercase mb-1'],
    ['project-side-title', 'text-base font-bold text-main mb-1'],
    ['prose-text', 'text-base leading-relaxed text-gray-text'],
    ['editorial-title', 'text-3xl md:text-5xl font-black tracking-tight text-white'],
    
    // Badges & Chips
    [
      'badge-shape',
      'inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wide whitespace-nowrap transition-all',
    ],
    ['badge', 'px-2.5 py-0.5 text-xs badge-shape border-white/10 bg-white/5 text-gray-text'],
    ['badge-accent', 'px-2.5 py-0.5 text-xs badge-shape border-main/40 bg-main/15 text-main font-medium'],
    [
      'badge-lg',
      'px-3.5 py-1 text-xs rounded-full border border-white/15 bg-white/5 font-mono tracking-wide whitespace-nowrap transition-all cursor-pointer hover:border-main hover:text-white',
    ],
    ['badge-active', 'bg-main/20 text-white border-main shadow-[0_0_12px_rgba(255,59,105,0.3)]'],
    ['badge-inactive', 'bg-black/40 text-gray-text border-white/10 hover:border-white/20 hover:text-white'],
    [
      'badge-solid',
      'bg-main border-main text-black font-semibold shadow-[0_0_12px_rgba(255,59,105,0.4)]',
    ],
    
    // Buttons
    [
      'btn-primary',
      'inline-flex items-center justify-center gap-2 bg-gradient-to-r from-main to-tertiary text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,59,105,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
    ],
    [
      'btn-secondary',
      'inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white-text border border-white/10 hover:border-white/25 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer',
    ],
    [
      'button-fx',
      'bg-main/15 text-main border border-main/30 font-medium hover:bg-main hover:text-black transition-all duration-200 py-2 px-4 rounded-xl text-center cursor-pointer shadow-sm hover:shadow-[0_0_14px_rgba(255,59,105,0.3)]',
    ],
    [
      'hov-button-fx',
      'scale-102% duration-200 ease-in-out shadow-[0_0_12px_rgba(255,59,105,0.2)] text-white',
    ],

    [
      'purosu',
      "prose prose-p:text-gray-text prose-headings:text-white prose-strong:text-white prose-a:text-main prose-a:underline hover:prose-a:text-white prose-li:marker:text-main prose-li:text-gray-text prose-ul:list-disc prose-blockquote:bg-main/10 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-xl prose-blockquote:break-words prose-blockquote:border-main prose-table:border-collapse prose-table:text-white/90 prose-th:bg-main/15 prose-th:text-left prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-tr:border-b prose-tr:border-white/10",
    ],
  ],
  theme: {
    colors: {
      main: '#FF3B69',
      secondary: '#FF3B69',
      tertiary: '#934355',
      'main-shade': '#A13741',
      'white-text': '#F5E6EB',
      'gray-text': '#C8BAC3',
      'black-text': '#08060B',
    },
    fontFamily: {
      sans: 'Figtree, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
});

