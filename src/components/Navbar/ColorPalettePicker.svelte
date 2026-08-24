<script lang="ts">
  import { onMount } from 'svelte';

  const DEFAULT_COLOR = '#FF3B69';

  const presets = [
    { name: 'Electric Crimson', hex: '#FF3B69' },
    { name: 'Cyber Cyan', hex: '#00F0FF' },
    { name: 'Neon Emerald', hex: '#00FF9D' },
    { name: 'Ultra Violet', hex: '#A855F7' },
    { name: 'Solar Amber', hex: '#FFB800' },
    { name: 'Hyper Blue', hex: '#3B82F6' },
    { name: 'Sakura Pink', hex: '#FF69B4' },
    { name: 'Matrix Green', hex: '#22C55E' },
  ];

  let isOpen = $state(false);
  let activeHex = $state(DEFAULT_COLOR);

  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleanHex = hex.replace(/^#/, '');
    if (cleanHex.length === 3) {
      const r = parseInt(cleanHex[0] + cleanHex[0], 16);
      const g = parseInt(cleanHex[1] + cleanHex[1], 16);
      const b = parseInt(cleanHex[2] + cleanHex[2], 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return { r, g, b };
    }
    if (cleanHex.length === 6) {
      const r = parseInt(cleanHex.substring(0, 2), 16);
      const g = parseInt(cleanHex.substring(2, 4), 16);
      const b = parseInt(cleanHex.substring(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return { r, g, b };
    }
    return null;
  }

  function applyColor(hex: string, save = true) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    activeHex = hex.toUpperCase();

    // Darker tone for tertiary & shade
    const tertiaryR = Math.round(rgb.r * 0.58);
    const tertiaryG = Math.round(rgb.g * 0.58);
    const tertiaryB = Math.round(rgb.b * 0.58);

    const shadeR = Math.round(rgb.r * 0.63);
    const shadeG = Math.round(rgb.g * 0.63);
    const shadeB = Math.round(rgb.b * 0.63);

    // Apply directly to Document Element Root
    const root = document.documentElement;
    root.style.setProperty('--color-main', hex);
    root.style.setProperty('--color-main-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty('--color-secondary', hex);
    root.style.setProperty('--color-secondary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    root.style.setProperty('--color-tertiary-rgb', `${tertiaryR}, ${tertiaryG}, ${tertiaryB}`);
    root.style.setProperty('--color-main-shade-rgb', `${shadeR}, ${shadeG}, ${shadeB}`);
    root.style.setProperty('--color-accent', hex);
    root.style.setProperty('--color-accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);

    if (save && typeof window !== 'undefined') {
      try {
        localStorage.setItem('arucaden_theme_color', hex);
      } catch (e) {}
    }

    // Broadcast event for components
    window.dispatchEvent(
      new CustomEvent('theme-color-change', {
        detail: { hex, r: rgb.r, g: rgb.g, b: rgb.b },
      })
    );
  }

  function resetDefault() {
    applyColor(DEFAULT_COLOR);
  }

  onMount(() => {
    try {
      const saved = localStorage.getItem('arucaden_theme_color');
      if (saved) {
        applyColor(saved, false);
      }
    } catch (e) {}

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#palette-picker-container')) {
        isOpen = false;
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div id="palette-picker-container" class="relative inline-block">
  <!-- Trigger Button beside Date -->
  <button
    type="button"
    onclick={(e) => {
      e.stopPropagation();
      isOpen = !isOpen;
    }}
    class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-main/50 transition-all duration-200 cursor-pointer group shadow-sm"
    title="Customize Website Accent Color"
    aria-label="Theme Color Picker"
  >
    <div
      class="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125 shadow-[0_0_8px_var(--color-accent-glow)]"
      style="background-color: {activeHex};"
    ></div>
    <span class="i-ri-palette-line w-3.5 h-3.5 text-gray-text group-hover:text-main transition-colors"></span>
  </button>

  <!-- Floating Preset Popover -->
  {#if isOpen}
    <div
      class="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[rgba(14,10,18,0.96)] backdrop-blur-2xl border border-white/15 p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 animate-in fade-in zoom-in-95 duration-150"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Popover Header -->
      <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
        <div class="flex items-center gap-1.5">
          <span class="i-ri-palette-fill w-3.5 h-3.5 text-main"></span>
          <span class="text-[11px] font-mono font-bold text-white tracking-wider uppercase">
            Theme Palette
          </span>
        </div>
        <button
          type="button"
          onclick={() => (isOpen = false)}
          class="text-gray-text hover:text-white p-0.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <span class="i-ri-close-line w-3.5 h-3.5"></span>
        </button>
      </div>

      <!-- Preset Swatches List -->
      <div class="grid grid-cols-2 gap-1.5 mb-2.5">
        {#each presets as preset}
          <button
            type="button"
            onclick={() => applyColor(preset.hex)}
            class="flex items-center gap-2 p-1.5 rounded-xl border transition-all duration-200 cursor-pointer text-left {
              activeHex.toLowerCase() === preset.hex.toLowerCase()
                ? 'border-white/40 bg-white/10 shadow-[0_0_10px_var(--color-accent-glow)]'
                : 'border-white/5 hover:border-white/20 bg-black/40 hover:bg-white/5'
            }"
            title={preset.name}
          >
            <div
              class="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style="background-color: {preset.hex};"
            ></div>
            <span class="text-[10px] font-mono text-white/90 truncate font-medium">
              {preset.name.split(' ')[0]}
            </span>
          </button>
        {/each}
      </div>

      <!-- Quick Reset Button -->
      <div class="pt-2 border-t border-white/10 flex justify-between items-center">
        <span class="text-[9px] font-mono text-gray-text uppercase">Live Web Palette</span>
        <button
          type="button"
          onclick={resetDefault}
          class="text-[9px] font-mono text-main hover:text-white hover:underline transition-colors cursor-pointer"
        >
          Reset Default
        </button>
      </div>
    </div>
  {/if}
</div>
