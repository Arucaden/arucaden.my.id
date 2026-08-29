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
    ['glass-panel-glow', 'bg-[rgba(22,16,30,0.85)] backdrop-blur-xl border border-main rounded-2xl shadow-[0_0_24px_var(--color-accent-glow)]'],
    ['article-container', 'bg-[rgba(18,14,24,0.8)] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-10'],
    
    // Interactive & Cards
    ['interactive-card', 'bg-white/[0.03] border border-white/10 hover:border-main hover:bg-white/[0.06] hover:shadow-[0_0_24px_var(--color-accent-glow)] rounded-2xl transition-all duration-300'],
    ['image-border', 'border border-white/10 hover:border-main transition-all duration-300 p-1 rounded-xl'],
    ['image-border2', 'border border-white/10 hover:border-main transition-all duration-300 p-1 rounded-xl shadow-sm hover:shadow-[0_0_24px_var(--color-accent-glow)]'],
    [
      'hov-fx',
      'transition-all duration-300 ease-out hover:scale-[1.01] hover:border-main hover:shadow-[0_0_24px_var(--color-accent-glow)]',
    ],
    
    // Typography
    ['section-title', 'text-xs font-mono font-medium tracking-widest text-main uppercase mb-1'],
    ['project-side-title', 'text-sm font-mono font-bold tracking-wider text-main uppercase mb-2'],
    ['prose-text', 'text-base leading-relaxed text-gray-text'],
    ['editorial-title', 'text-3xl md:text-5xl font-black tracking-tight text-white'],
    
    // Badges & Chips
    [
      'badge-shape',
      'inline-flex items-center gap-2 rounded-full border font-mono tracking-wide whitespace-nowrap transition-all',
    ],
    ['badge', 'px-4 py-2 text-xs badge-shape border-white/10 bg-white/5 text-gray-text'],
    ['badge-accent', 'px-3 py-1 text-xs rounded-xl border-main/40 bg-main/15 text-main font-medium'],
    [
      'badge-lg',
      'px-3.5 py-1.5 text-xs font-mono rounded-xl border border-white/10 bg-white/[0.04] text-gray-text tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer hover:border-main hover:text-main hover:bg-main/15 hover:shadow-[0_0_12px_var(--color-accent-glow)]',
    ],
    ['badge-active', 'bg-main/20 text-main border-main font-semibold shadow-[0_0_12px_var(--color-accent-glow)]'],
    ['badge-inactive', 'bg-white/[0.04] text-gray-text border-white/10 hover:border-main hover:text-main hover:bg-main/15 hover:shadow-[0_0_12px_var(--color-accent-glow)]'],
    [
      'badge-solid',
      'bg-main border-main text-black font-bold shadow-[0_0_14px_var(--color-accent-glow)]',
    ],
    [
      'filter-btn',
      'inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs border transition-all duration-200 cursor-pointer select-none shadow-sm',
    ],
    [
      'filter-btn-inactive',
      'bg-white/[0.04] border-white/10 text-gray-text hover:border-main hover:text-main hover:bg-main/15 hover:shadow-[0_0_12px_var(--color-accent-glow)]',
    ],
    [
      'filter-btn-active',
      'bg-main text-black border-main font-bold shadow-[0_0_14px_var(--color-accent-glow)]',
    ],
    
    // Buttons
    [
      'btn-primary',
      'inline-flex items-center justify-center gap-2 bg-gradient-to-r from-main to-tertiary text-white font-medium px-4 py-4 rounded-xl transition-all duration-200 hover:shadow-[0_0_12px_var(--color-accent-glow)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer',
    ],
    [
      'btn-secondary',
      'inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white-text border border-white/10 hover:border-main hover:text-main font-medium px-4 py-4 rounded-xl transition-all duration-200 cursor-pointer',
    ],
    [
      'btn-back',
      'inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-main/15 border border-white/10 hover:border-main text-xs font-mono font-bold text-gray-text hover:text-main transition-all duration-200 shadow-sm cursor-pointer',
    ],
    [
      'btn-view-all',
      'w-full mt-4 py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-main/15 border border-white/10 hover:border-main text-xs font-mono font-bold text-gray-text hover:text-main uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-[0_0_12px_var(--color-accent-glow)] cursor-pointer',
    ],
    [
      'button-fx',
      'bg-main/15 text-main border border-main/30 font-medium hover:bg-main hover:text-black transition-all duration-200 py-2 px-4 rounded-xl text-center cursor-pointer shadow-sm hover:shadow-[0_0_12px_var(--color-accent-glow)]',
    ],
    [
      'hov-button-fx',
      'scale-102% duration-200 ease-in-out shadow-[0_0_8px_var(--color-accent-glow)] text-white',
    ],

    // Markdown styling
    [
      'purosu',
      'prose prose-invert max-w-none w-full prose-p:max-w-none prose-p:w-full prose-headings:max-w-none prose-headings:w-full prose-p:text-gray-text prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-main/30 prose-h2:pb-2 prose-h3:text-lg prose-strong:text-white prose-a:text-main prose-a:no-underline hover:prose-a:underline prose-li:marker:text-main prose-li:text-gray-text prose-ul:list-disc prose-blockquote:bg-main/10 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-xl prose-blockquote:border-l-4 prose-blockquote:border-main prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-code:text-main prose-code:font-mono prose-table:border-collapse prose-table:text-white/90 prose-th:bg-main/15 prose-th:text-left prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-tr:border-b prose-tr:border-main/20',
    ],
  ],
  theme: {
    colors: {
      main: 'var(--color-main, #FF3B69)',
      secondary: 'var(--color-secondary, #FF3B69)',
      tertiary: 'var(--color-tertiary, #934355)',
      'main-shade': 'var(--color-main-shade, #A13741)',
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
