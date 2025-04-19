<script lang="ts">
  import { techItems } from '../../data/techstack.ts';
  import TechCard from '../TechCard.svelte';
  import type { Tech } from '../../types/techstack.ts';
  import { fade, fly } from 'svelte/transition';

  let hovered = $state(false);
  let { title, description, image, tech = [], url = undefined, slug } = $props();

  function resolveTech(techNames: string[]): Tech[] {
    return techNames.map(name => {
      return (
        techItems.find(t => t.name.toLowerCase() === name.toLowerCase()) ?? {
          name,
          type: 'tech',
          icon: 'i-heroicons-question-mark-circle',
        }
      );
    });
  }
</script>

<div 
  class="relative image-border2 hover:hov-fx rounded-2 overflow-hidden transition-all duration-300 ease-in-out w-full h-54"
  role="button"
  tabindex="0"
  onmouseover={() => (hovered = true)} 
  onfocus={() => (hovered = true)}
  onmouseleave={() => (hovered = false)}
  onblur={() => (hovered = false)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (slug) {
        window.location.href = `/projects/${slug}`;
      } else if (url) {
        window.location.href = url;
      }
    }
  }}
>
  <img src={image} alt={title} class="w-full h-full object-cover" />

  {#if hovered}
    <div 
      class="absolute inset-0 bg-black/80 text-white flex flex-col p-4 gap-2"
      transition:fade={{ duration: 200 }}
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-bold">{title}</h3>
        
        {#if slug}
          <a 
            class="bg-main px-3 py-1 rounded-md text-black-text no-underline text-xs font-medium hover:bg-main-light transition-colors" 
            href={`/projects/${slug}`}
            transition:fly={{ y: -10, duration: 200, delay: 100 }}
          >
            Learn more →
          </a>
        {/if}
      </div>
      
      <p class="text-sm">{description}</p>

      <div 
        class="flex gap-1 flex-wrap mt-auto"
        transition:fly={{ y: 10, duration: 200, delay: 100 }}
      >
        {#each resolveTech(tech) as t}
          <TechCard {...t} iconClass="w-4 h-4" showName={false} customClass="px-2 py-1" />
        {/each}
      </div>
    </div>
  {/if}
</div>
