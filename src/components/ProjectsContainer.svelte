<script lang="ts">
    import ProjectCard from '../components/ProjectCard.svelte';
    import type { Project } from '../data/projects.ts';
    let { projects = [] }: { projects?: Project[] } = $props();
</script>
  
<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {#each projects as p}
    <ProjectCard {...p} />
  {/each}
</div>