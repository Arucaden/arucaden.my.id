<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import ViewAllButton from '../Common/ViewAllButton.svelte';
  import type { Project } from '../../types/project.ts';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  
  let { projects = [] }: { projects?: Project[] } = $props();
  
  let isMobile = $state(false);
  let overlayVisible = $state(false);
  let activeFilter = $state('#all');

  const availableTags = ['#all', '#game', '#apps', '#web', '#mobile'];
  
  const previewProjects = $derived(projects.slice(0, 6));

  const filteredProjects = $derived(
    activeFilter === '#all'
      ? projects
      : projects.filter((p) => p.tags && p.tags.includes(activeFilter))
  );
  
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
</script>

<div id="projects-shell" class="relative">
  <!-- Preview Grid -->
  <div id="projects-content" class={overlayVisible ? 'invisible pointer-events-none' : ''}>
    {#if isMobile}
      <div class="projects-wrapper">
        <div 
          id="projects-container"
          class="grid grid-cols-1 gap-4 max-h-screen overflow-y-auto scrollbar-hidden pb-4 px-3"
        >
          {#each previewProjects as p}
            <div class="card-wrapper">
              <ProjectCard {...p} slug={p.slug} />
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-2">
        {#each previewProjects as p}
          <ProjectCard {...p} slug={p.slug} />
        {/each}
      </div>
    {/if}

    <ViewAllButton
      text="Show All Projects"
      onclick={() => (overlayVisible = true)}
    />
  </div>

  <!-- Full List Projects -->
  <div id="projects-overlay" class={`absolute inset-0 overlay-base flex flex-col p-2 ${overlayVisible ? 'overlay-visible' : ''}`}>
    <div class="flex items-center justify-between mb-3 bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 sticky top-0 z-20 backdrop-blur-md">
      <h2 class="text-sm font-mono font-bold tracking-wider text-white uppercase m-0">Projects</h2>
      <button type="button" class="btn-secondary py-1 px-3 text-xs" onclick={() => (overlayVisible = false)}>
        Close
      </button>
    </div>
    
    <div class="flex-1 overflow-y-auto w-full pb-4">
      {#if overlayVisible}
        <div class="p-1" in:fly={{ y: 20, duration: 250 }}>
          <!-- Filter Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            {#each availableTags as tag}
              <button
                type="button"
                class="filter-btn {activeFilter === tag ? 'filter-btn-active' : 'filter-btn-inactive'}"
                onclick={() => (activeFilter = tag)}
              >
                {tag}
              </button>
            {/each}
          </div>

          <!-- Filtered Grid -->
          <div class="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3">
            {#each filteredProjects as p}
              {#if isMobile}
                <div class="card-wrapper">
                  <ProjectCard {...p} slug={p.slug} />
                </div>
              {:else}
                <ProjectCard {...p} slug={p.slug} />
              {/if}
            {/each}
          </div>

          {#if filteredProjects.length === 0}
            <div class="text-xs font-mono text-gray-text py-12 text-center bg-white/[0.02] border border-white/5 rounded-2xl">
              No projects found with tag {activeFilter}.
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  @media (max-width: 768px) {
    .projects-wrapper {
      position: relative;
      z-index: 1;
      overflow: visible;
    }
    
    #projects-container {
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0.3));
      -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0.3));
      padding-bottom: 20px;
      -ms-overflow-style: none; 
      scrollbar-width: none;  
    }
    
    #projects-container::-webkit-scrollbar {
      display: none;
    }
    
    .card-wrapper {
      margin: -6px;
      margin-top: 4px;
      overflow: visible;
      position: relative;
      z-index: 10;
    }
    
    .card-wrapper:hover {
      z-index: 10;
    }
  }

  /* Overlay Base matching artworks transition */
  .overlay-base {
    opacity: 0;
    transform: translateY(8px);
    pointer-events: none;
    background: rgba(8, 6, 11, 0.9);
    backdrop-filter: blur(16px);
    transition: opacity 200ms ease, transform 200ms ease;
    border-radius: 1rem;
    z-index: 50;
  }
  .overlay-base.overlay-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
</style>