<script lang="ts">
  import type { Artwork } from '../data/artMeta.ts';
  let { artwork }: { artwork: Artwork } = $props();
</script>

<div class="border p-4 rounded-xl bg-white/10 text-white">
  <img src={artwork.image} alt={artwork.title} class="w-full rounded-md mb-2" />
  <h2 class="text-lg font-bold">{artwork.title} ({artwork.year})</h2>
  <p class="text-sm">{artwork.description}</p>
  <div class="text-xs text-secondary mt-2">
    {#each artwork.tags as tag}
      <span>{tag} </span>
    {/each}
  </div>
</div>