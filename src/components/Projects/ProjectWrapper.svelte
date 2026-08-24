<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import type { Project } from '../../types/project.ts';
  import { fly, fade } from 'svelte/transition';

  let { projects = [] }: { projects?: Project[] } = $props();

  let activeFilter = $state<'all' | 'uiux' | 'gamedev'>('all');
  let showAll = $state(false);

  const filteredProjects = $derived(
    projects.filter((p) => {
      if (activeFilter === 'all') return true;
      const techList = p.tech || [];
      const isUiUx = techList.some((t) =>
        ['Flutter', 'Tailwind', 'Laravel', 'Alpine', 'Figma', 'TypeScript', 'Astro'].includes(t)
      );
      const isGameDev = techList.some((t) =>
        ['Unity', 'C#', 'Blender', 'Godot', 'Clip Studio'].includes(t)
      );

      if (activeFilter === 'uiux') return isUiUx;
      if (activeFilter === 'gamedev') return isGameDev;
      return true;
    })
  );

  const displayedProjects = $derived(
    showAll ? filteredProjects : filteredProjects.slice(0, 6)
  );
</script>

<div class="flex flex-col gap-6">
  <!-- Filter Tabs & Stats -->
  <div class="flex flex-wrap items-center justify-between gap-3 pb-2">
    <div class="flex flex-wrap gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10">
      <button
        type="button"
        onclick={() => (activeFilter = 'all')}
        class={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
          activeFilter === 'all'
            ? 'bg-main text-black font-bold shadow-[0_0_12px_rgba(255,59,105,0.4)]'
            : 'text-gray-text hover:text-white hover:bg-white/5'
        }`}
      >
        All Works ({projects.length})
      </button>

      <button
        type="button"
        onclick={() => (activeFilter = 'uiux')}
        class={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
          activeFilter === 'uiux'
            ? 'bg-main text-black font-bold shadow-[0_0_12px_rgba(255,59,105,0.4)]'
            : 'text-gray-text hover:text-white hover:bg-white/5'
        }`}
      >
        UI/UX & Web
      </button>

      <button
        type="button"
        onclick={() => (activeFilter = 'gamedev')}
        class={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
          activeFilter === 'gamedev'
            ? 'bg-main text-black font-bold shadow-[0_0_12px_rgba(255,59,105,0.4)]'
            : 'text-gray-text hover:text-white hover:bg-white/5'
        }`}
      >
        Game Systems & 3D
      </button>
    </div>

    <span class="text-xs font-mono text-gray-text hidden sm:inline-block">
      Showing {displayedProjects.length} of {filteredProjects.length} case studies
    </span>
  </div>

  <!-- Projects Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
    {#each displayedProjects as p (p.slug || p.title)}
      <div in:fly={{ y: 20, duration: 300 }}>
        <ProjectCard {...p} slug={p.slug} />
      </div>
    {/each}
  </div>

  <!-- Expand / Collapse All -->
  {#if filteredProjects.length > 6}
    <div class="flex justify-center mt-4">
      <button
        type="button"
        onclick={() => (showAll = !showAll)}
        class="btn-secondary text-xs font-mono py-2.5 px-6"
      >
        {showAll ? 'Collapse to Featured' : `View All (${filteredProjects.length}) Projects ➔`}
      </button>
    </div>
  {/if}
</div>