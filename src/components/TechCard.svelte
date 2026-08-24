<script lang="ts">
  import type { Tech } from '@/types/techstack.ts';

  let { 
    name, icon, highlight = false, customClass = '', iconClass = 'w-4 h-4', showName = true }: 
    Tech & { highlight?: boolean; customClass?: string; iconClass?: string; showName?: boolean; } = $props();
</script>

<div
  class={`inline-flex items-center gap-2 rounded-xl bg-white/[0.04] border px-3 py-1.5 text-xs font-mono transition-all duration-200 hover:border-main hover:bg-main/15 hover:text-main hover:shadow-[0_0_12px_var(--color-accent-glow)] cursor-default
    ${highlight 
      ? 'text-white border-main bg-main/10 shadow-[0_0_12px_var(--color-accent-glow)]' 
      : 'text-gray-text border-white/10'} ${customClass}
  `}
>
  {#if icon}
    <img 
      src={icon} 
      alt={name} 
      width="18"
      height="18"
      class={`transition-transform duration-200 ${iconClass}`} 
    />
  {/if}

  {#if showName}
    <span class="font-medium cursor-default">{name}</span>
  {/if}
</div>
