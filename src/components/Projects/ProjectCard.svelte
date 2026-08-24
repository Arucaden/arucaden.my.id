<script lang="ts">
  import { techItems } from '@/data/techstack.ts';
  import TechCard from '../TechCard.svelte';
  import type { Tech } from '@/types/techstack.ts';
  import { fade, fly } from 'svelte/transition';

  let hovered = $state(false);
  let {
    title,
    description,
    image,
    tech = [],
    url = undefined,
    slug,
    pin = false,
  }: {
    title: string;
    description: string;
    image: string;
    tech?: string[];
    url?: string;
    slug?: string;
    pin?: boolean;
  } = $props();

  const href = $derived(slug ? `/projects/${slug}` : url);

  function resolveTech(techNames: string[]): Tech[] {
    return techNames.map((name) => {
      return (
        techItems.find((t) => t.name.toLowerCase() === name.toLowerCase()) ?? {
          name,
          type: 'tech' as const,
          icon: undefined,
        }
      );
    });
  }
</script>

{#if href}
  <a
    href={href}
    class="relative image-border2 hover:hov-fx rounded-2 overflow-hidden transition-all duration-300 ease-in-out w-full h-54 block group"
    onmouseenter={() => (hovered = true)}
    onfocus={() => (hovered = true)}
    onmouseleave={() => (hovered = false)}
    onblur={() => (hovered = false)}
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
      <div
        class="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 z-20 border border-white/10 backdrop-blur-sm"
        title="Pinned Project"
      >
        <div class="i-ri-pushpin-fill w-4 h-4 text-white"></div>
      </div>
    {/if}

    <!-- Mobile bar -->
    <div
      class="md:hidden absolute bottom-1 left-1 right-1 bg-black/70 p-3 gap-2 rounded-b-sm z-10"
    >
      <h3 class="text-base font-bold text-white truncate">{title}</h3>
      <p class="text-sm text-gray-300 line-clamp-1">{description}</p>
    </div>

    <!-- Desktop overlay -->
    {#if hovered}
      <div
        class="hidden md:flex absolute inset-1 rounded-sm bg-black/80 text-white flex-col p-4 gap-2 z-10"
        transition:fade={{ duration: 200 }}
      >
        <div class="mb-2">
          <h3 class="text-lg font-bold leading-snug link-fx-white">{title}</h3>
        </div>

        <p class="text-sm">{description}</p>

        <div
          class="flex gap-1 flex-wrap mt-auto"
          transition:fly={{ y: 10, duration: 200, delay: 100 }}
        >
          {#each resolveTech(tech) as t}
            <TechCard
              {...t}
              iconClass="w-4 h-4"
              showName={false}
              customClass="px-2 py-1"
            />
          {/each}
        </div>
      </div>
    {/if}
  </a>
{:else}
  <div
    class="relative image-border2 rounded-2 overflow-hidden transition-all duration-300 ease-in-out w-full h-54"
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
    <div
      class="absolute bottom-1 left-1 right-1 bg-black/70 p-3 gap-2 rounded-b-sm z-10"
    >
      <h3 class="text-base font-bold text-white truncate">{title}</h3>
      <p class="text-sm text-gray-300 line-clamp-1">{description}</p>
    </div>
  </div>
{/if}

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
