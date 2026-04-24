<script lang="ts">
  import { techItems } from '@/data/techstack.ts';
  import TechCard from '../TechCard.svelte';
  import type { Tech } from '@/types/techstack.ts';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { Image } from 'astro:assets';
  import arrow from 'public/icons/arrow-down.svg';

  let hovered = $state(false);
  let isMobile = $state(false);
  let { title, description, image, tech = [], url = undefined, slug, pin = false } = $props();

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

  {#if pin}
    <div class="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 z-20 shadow-sm border border-white/10 backdrop-blur-sm" title="Pinned Project">
      <div class="i-ri-pushpin-fill w-4 h-4 text-white"></div>
    </div>
  {/if}

  <!-- Mobile bar  -->
  <div class="md:hidden absolute bottom-1 left-1 right-1 bg-black/70 p-3 gap-2 rounded-b-sm z-10">
    <h3 class="text-base font-bold text-white truncate">{title}</h3>
    <p class="text-sm text-gray-300 line-clamp-1">{description}</p>
  </div>

  <!-- Desktop overlay -->
  {#if hovered && !isMobile}
    <div 
      class="absolute inset-1 rounded-sm bg-black/80 text-white flex flex-col p-4 gap-2 z-10"
      transition:fade={{ duration: 200 }}
    >
      <div class="mb-2">
        <h3 class="text-lg font-bold leading-snug">
          {#if slug || url}
            <a 
              href={slug ? `/projects/${slug}` : url} 
              class="link-fx-white"
            >
              {title}
            </a>
          {:else}
            {title}
          {/if}
        </h3>
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
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
