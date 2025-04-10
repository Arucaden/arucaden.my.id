<script lang="ts">
  import Artwork from './ArtworkDetail.svelte';
  import ArtworkList from './ArtworkList.svelte';
  import { fly } from 'svelte/transition';
  import type { Artwork as ArtType } from '../../types/artwork.ts';

  let { artworks }: { artworks: ArtType[] } = $props();

  let expanded = $state(false);
  let currentArtwork: ArtType = $state(artworks[0]);

  function handleSelect(art: ArtType) {
    currentArtwork = art;
    expanded = false;
  }

  const previewArtworks = artworks.slice(0, 4);
</script>

<button 
  type="button" 
  class="w-full text-right mb-4 text-sm cursor-pointer text-white hover:text-main transition-all"
  onclick={() => expanded = !expanded}
>
  {expanded ? 'Collapse ˅' : 'Expand ^'}
</button>

{#if !expanded}
  <!-- Big Preview -->
  <Artwork artwork={currentArtwork} />

  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
    {#each previewArtworks as art (art.title)}
      <button
        class="border rounded-xl overflow-hidden bg-white/10 hover:bg-main hover:text-black-text transition-all"
        onclick={() => (currentArtwork = art)}
      >
        <img src={art.image} alt={art.title} class="w-full h-24 object-cover rounded-md" />
      </button>
    {/each}
  </div>
{/if}

{#if expanded}
  <div transition:fly={{ y: 20, duration: 300 }}>
    <ArtworkList artworks={artworks} onSelect={handleSelect} />
  </div>
{/if}