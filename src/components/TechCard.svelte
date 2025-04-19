<script lang="ts">
  import type { Tech } from '../types/techstack.ts';

  let { 
    name, icon, highlight = false, customClass = '', iconClass = 'w-5 h-5', showName = true }: 
    Tech & { highlight?: boolean; customClass?: string; iconClass?: string; showName?: boolean; } = $props();
</script>

<div
  class={`inline-flex items-center gap-2 border-2 rounded-xl px-4 py-2 text-sm
    transition-all hover:hov-fx
    ${highlight 
      ? 'bg-main text-black-text border border-main' 
      : 'text-gray-text border-secondary hover:border-main hover:text-white'} ${customClass}
  `}
>
  {#if icon}
    <img src={icon} alt={name} class={`transition-transform duration-200 ${iconClass}`} />
  {/if}

  {#if showName}
    <span class="text-sm font-semibold cursor-default">{name}</span>
  {/if}
</div>
