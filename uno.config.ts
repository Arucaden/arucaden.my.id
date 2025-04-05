// uno.config.ts
import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetAttributify(),
  ],
  shortcuts: [
    // shortcut class custom buat efek CRT
    ['crt-bg', 'bg-[#140a0d] relative overflow-hidden'],
    ['crt-lines', 'absolute inset-0 bg-repeat bg-[linear-gradient(rgba(255,255,255,0.05)_0px,rgba(77,21,21,0.1)_2px,rgba(0,0,0,0.2)_4px)] opacity-30 animate-scanline z-10 pointer-events-none'],
    ['crt-text', 'text-pink-400 text-shadow-[0_0_5px_#ff4d6d,0_0_10px_#ff4d6d,0_0_15px_#ff4d6d] animate-flicker'],
  ],
  theme: {
    colors: {
      'crt-red': '#ff4d6d',
      'crt-bg': '#140a0d'
    }
  },
  safelist: ['animate-scanline', 'animate-flicker'],
});
