<script lang="ts">
    import ProjectCard from './ProjectCard.svelte';
    import type { Project } from '../../types/project.ts';
    let { projects = [] }: { projects?: Project[] } = $props();
</script>
  
<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
  {#each projects as p}
    <ProjectCard {...p} slug={p.slug} />
  {/each}
</div>