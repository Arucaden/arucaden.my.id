<script lang="ts">
  import type { Tech } from '../data/techstack.ts';

  let { name, type, icon, highlight = false, customClass = '' }: 
  Tech & { highlight?: boolean; customClass?: string; } = $props();
</script>

<div
  class={`inline-flex items-center gap-2 border-2 rounded-xl px-4 py-2 text-sm
    transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_0_12px_rgba(255,77,109,0.5)]
    ${highlight 
      ? 'bg-main text-black-text border border-main hover:bg-secondary' 
      : 'bg-white/5 text-white border-secondary hover:border-main hover:bg-black/50'} ${customClass}
  `}
>
  {#if icon}
    <div class={`${icon} w-5 h-5 transition-transform duration-200`}></div>
  {/if}
  <span class="text-sm font-semibold">{name}</span>
</div>
