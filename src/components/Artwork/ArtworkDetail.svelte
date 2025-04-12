<script lang="ts">
  import type { Artwork } from '../../types/artwork.ts';
  let { artwork }: { artwork: Artwork } = $props();
</script>

<div class="flex flex-row rounded-xl text-white gap-4 mb-4">
  <img src={artwork.image} alt={artwork.title} class="w-1/2 border-2 border-secondary p-1" />

  <div>
    <h2 class="text-lg font-bold">{artwork.title} ({artwork.year})</h2>
    <p class="text-sm">{artwork.description}</p>
    <div class="text-xs text-secondary mt-2">
      {#each artwork.tags as tag}
        <span> {tag} </span>
      {/each}
    </div>
  </div>
</div>