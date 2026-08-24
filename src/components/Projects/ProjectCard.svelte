<script lang="ts">
  import { techItems } from '@/data/techstack.ts';
  import TechCard from '../TechCard.svelte';
  import TiltCard3D from '../3D/TiltCard3D.svelte';
  import type { Tech } from '@/types/techstack.ts';

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

  // Derive smart category for UI/UX & Gamedev
  const category = $derived(
    tech.some((t) => ['Flutter', 'Tailwind', 'Laravel', 'Alpine', 'Figma'].includes(t))
      ? 'UI/UX & Mobile / Web'
      : tech.some((t) => ['Unity', 'C#', 'Blender', 'Godot'].includes(t))
      ? 'Game Systems & Shader Dev'
      : 'Interactive Tech'
  );

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
  <TiltCard3D tiltMaxAngle={7} class="w-full h-full">
    <a
      href={href}
      class="group relative flex flex-col h-full rounded-2xl bg-[rgba(18,14,24,0.85)] border border-white/10 hover:border-main/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[0_12px_36px_-10px_rgba(255,59,105,0.25)] block"
    >
      <!-- Media Frame -->
      <div class="relative w-full aspect-[16/10] overflow-hidden bg-black/50">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
          class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        <!-- Ambient overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-[rgba(18,14,24,0.95)] via-[rgba(18,14,24,0.2)] to-transparent"></div>

        <!-- Badges on image -->
        <div class="absolute top-3 left-3 flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/70 border border-white/15 text-white backdrop-blur-md">
            {category}
          </span>
        </div>

        {#if pin}
          <div
            class="absolute top-3 right-3 px-2 py-1 rounded-full bg-main/90 border border-main text-black text-[10px] font-mono font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(255,59,105,0.5)]"
          >
            <div class="i-ri-pushpin-fill w-3 h-3"></div>
            <span>FLAGSHIP</span>
          </div>
        {/if}
      </div>

      <!-- Card Body -->
      <div class="flex-1 p-5 flex flex-col justify-between gap-4">
        <div>
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <h3 class="text-lg font-bold text-white group-hover:text-main transition-colors leading-snug">
              {title}
            </h3>
            <span class="text-main group-hover:translate-x-1 transition-transform text-sm font-mono font-bold">➔</span>
          </div>

          <p class="text-xs text-gray-text line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <!-- Tech Stack Chips -->
        <div class="pt-3 border-t border-white/10 flex items-center justify-between">
          <div class="flex flex-wrap gap-1">
            {#each resolveTech(tech).slice(0, 4) as t}
              <TechCard
                {...t}
                iconClass="w-3.5 h-3.5"
                showName={false}
                customClass="px-1.5 py-0.5 bg-white/5 border-white/10"
              />
            {/each}
          </div>

          <span class="text-[11px] font-mono text-gray-text group-hover:text-white transition-colors">
            Case Study
          </span>
        </div>
      </div>
    </a>
  </TiltCard3D>
{:else}
  <div class="relative flex flex-col h-full rounded-2xl bg-[rgba(18,14,24,0.85)] border border-white/10 overflow-hidden">
    <div class="relative w-full aspect-[16/10] overflow-hidden bg-black/50">
      <img
        src={image}
        alt={title}
        loading="lazy"
        decoding="async"
        width="800"
        height="500"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-base font-bold text-white">{title}</h3>
      <p class="text-xs text-gray-text mt-1">{description}</p>
    </div>
  </div>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

