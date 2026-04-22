<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import type { Project } from '../../types/project.ts';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  
  let { projects = [] }: { projects?: Project[] } = $props();
  
  let isMobile = $state(false);
  let overlayVisible = $state(false);
  
  let previewProjects = projects.slice(0, 6);
  
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

<div class="relative">
  <div class={overlayVisible ? 'invisible pointer-events-none' : ''}>
    <!-- Mobile -->
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

    <button 
      type="button" 
      class="button-fx w-full mt-4"
      onclick={() => overlayVisible = true}
    >
      Show All Projects
    </button>
  </div>

  <!-- List projects (Overlay) -->
  <div class={`absolute inset-0 overlay-base flex flex-col p-2 ${overlayVisible ? 'overlay-visible' : ''}`}>
    <div class="flex items-center justify-between mb-2 bg-black/70 border border-secondary/30 rounded-md px-3 py-2 sticky top-0 z-20">
      <h2 class="section-title m-0">.Projects</h2>
      <button type="button" class="button-fx" onclick={() => overlayVisible = false}>Back</button>
    </div>
    
    <div class="flex-1 overflow-y-auto w-full pb-4">
      {#if overlayVisible}
        <div class="px-2 pt-2 pb-6 grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4" in:fly={{ y: 20, duration: 250 }}>
          {#each projects as p}
            {#if isMobile}
              <div class="card-wrapper">
                <ProjectCard {...p} slug={p.slug} />
              </div>
            {:else}
              <ProjectCard {...p} slug={p.slug} />
            {/if}
          {/each}
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

  /* Overlay Base */
  .overlay-base {
    opacity: 0;
    transform: translateY(8px);
    pointer-events: none;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    transition: opacity 200ms ease, transform 200ms ease;
    border-radius: 0.5rem;
    z-index: 50;
  }
  .overlay-base.overlay-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
</style>