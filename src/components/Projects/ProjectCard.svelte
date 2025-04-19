<script lang="ts">
  import { techItems } from '../../data/techstack.ts';
  import TechCard from '../TechCard.svelte';
  import type { Tech } from '../../types/techstack.ts';
  

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
  class="relative border border-solid border-[#a73344] rounded-2 overflow-hidden transition duration-300 ease"
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
  <img src={image} alt={title} class="w-full h-auto block" />

  {#if hovered}
    <div class="absolute inset-0 bg-[rgba(20,10,10,0.95)] text-white flex flex-col justify-center p-4 gap-2">
      <h3 class="text-lg font-bold">{title}</h3>
      <p class="text-sm">{description}</p>

      <div class="flex gap-2 flex-wrap">
        {#each resolveTech(tech) as t}
          <TechCard {...t} iconClass="w-4 h-4" showName={false} />
        {/each}
      </div>

      {#if slug}
        <a class="mt-2 inline-block bg-[#ff0077] px-4 py-2 rounded-md text-white no-underline text-sm" 
        href={`/projects/${slug}`}>
          Learn more →
        </a>
      {/if}
    </div>
  {/if}
</div>
