<script lang="ts">
  import { techItems } from '../../data/techstack.ts';
  import TechCard from '../TechCard.svelte';
  import type { Tech } from '../../types/techstack.ts';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  let hovered = $state(false);
  let isMobile = $state(false);
  let { title, description, image, tech = [], url = undefined, slug } = $props();

  onMount(() => {
    isMobile = window.innerWidth < 768;
    
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

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
  
  function handleCardClick() {
    if (isMobile && slug) {
      window.location.href = `/projects/${slug}`;
    }
  }
</script>

<div 
  class="relative image-border2 hover:hov-fx rounded-2 overflow-hidden transition-all duration-300 ease-in-out w-full h-54"
  role="button"
  tabindex="0"
  onmouseover={() => (!isMobile && (hovered = true))} 
  onfocus={() => (!isMobile && (hovered = true))}
  onmouseleave={() => (!isMobile && (hovered = false))}
  onblur={() => (!isMobile && (hovered = false))}
  onclick={handleCardClick}
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
  <img 
    src={image} 
    alt={title} 
    loading="lazy" 
    decoding="async"
    width="800"
    height="600"
    class="rounded-sm object-cover w-full h-full"
  />

  <!-- Mobile bar  -->
  <div class="md:hidden absolute bottom-0 left-0 right-0 bg-black/70 p-3 gap-2">
    <h3 class="text-base font-bold text-white truncate">{title}</h3>
    <p class="text-sm text-gray-300 line-clamp-1">{description}</p>
  </div>

  <!-- Desktop overlay -->
  {#if hovered && !isMobile}
    <div 
      class="absolute inset-0 bg-black/80 text-white flex flex-col p-4 gap-2"
      transition:fade={{ duration: 200 }}
    >
      <div class="flex justify-between items-first mb-2">
        <h3 class="text-lg font-bold max-w-[65%]">{title}</h3>
        
        {#if slug}
          <a 
            class="bg-main px-3 py-2 h-fit rounded-md text-black-text no-underline text-xs font-bold hover:bg-main-light transition-colors" 
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

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
