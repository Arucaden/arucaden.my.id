<script lang="ts">
  import type { Artwork } from '../../types/artwork.ts';
  let { artwork }: { artwork: Artwork } = $props();
</script>

<div class="flex flex-row text-white gap-4 mb-4">
  <img src={artwork.image} alt={artwork.title} class="w-1/2 image-border" />

  <div>
    <span>/ Title</span>
    <h2 class="text-lg font-bold">{artwork.title} ({artwork.year})</h2>
    <span>/ Description</span>
    <p class="text-sm">{artwork.description}</p>
    <span>/ Tag</span>
    <div class="text-sm text-secondary mt-2">
      {#each artwork.tags as tag}
        <span class="mr-3"> {tag} </span>
      {/each}
    </div>
  </div>
</div>