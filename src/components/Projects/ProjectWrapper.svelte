<script lang="ts">
  import ProjectCard from './ProjectCard.svelte';
  import type { Project } from '../../types/project.ts';
  import { onMount } from 'svelte';
  
  let { projects = [] }: { projects?: Project[] } = $props();
  
  // Check if we're on mobile (client-side only)
  let isMobile = $state(false);
  
  onMount(() => {
    isMobile = window.innerWidth < 768;
    
    // Listen for window resize
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
</script>

<!-- Mobile layout with scrollable container - scrollbar hidden -->
{#if isMobile}
  <div class="projects-wrapper">
    <div 
      id="projects-container"
      class="grid grid-cols-1 gap-4 max-h-[750px] overflow-y-auto scrollbar-hidden pb-4 px-3"
    >
      {#each projects as p}
        <div class="card-wrapper">
          <ProjectCard {...p} slug={p.slug} />
        </div>
      {/each}
    </div>
  </div>
{:else}
  <!-- Desktop layout (unchanged) -->
  <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-2">
    {#each projects as p}
      <ProjectCard {...p} slug={p.slug} />
    {/each}
  </div>
{/if}

<style>
  /* Apply gradient fade effect and hide scrollbar */
  @media (max-width: 768px) {
    /* Wrapper to help with overflow */
    .projects-wrapper {
      position: relative;
      z-index: 1;
      overflow: visible; /* This is important */
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
</style>