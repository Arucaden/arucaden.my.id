<script lang="ts">
  import type { Tech } from '../types/techstack.ts';

  let { 
    name, 
    icon, 
    highlight = false, 
    customClass = '',
    showName = true 
  }: 
  Tech & { 
    highlight?: boolean; 
    customClass?: string;
    showName?: boolean;
  } = $props();
</script>

<div
  class={`inline-flex items-center gap-2 border-2 rounded-xl px-4 py-2 text-sm
    transition-all hover:hov-fx
    ${highlight 
      ? 'bg-main text-black-text border border-main' 
      : 'text-text-white border-secondary hover:border-main'} ${customClass}
  `}
>
  {#if icon}
    <div class={`${icon} w-5 h-5 transition-transform duration-200`}></div>
  {/if}
  {#if showName}
    <span class="text-sm font-semibold cursor-default">{name}</span>
  {/if}
</div>
