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

  const previewArtworks = artworks.slice(0, 5);
</script>

{#if !expanded}
  <!-- Big Preview -->
  <Artwork artwork={currentArtwork} />

  <button 
    type="button" 
    class="w-full text-right border-b-2 py-2 border-secondary mb-4 text-sm cursor-pointer text-white-text hover:text-main transition-all"
    onclick={() => expanded = !expanded}
  > Full Art ^
  </button>
  
  <!-- Highlights -->
  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
    {#each previewArtworks as art (art.title)}
      <button
        class="image-border2 overflow-hidden hover:hov-fx transition-all"
        onclick={() => (currentArtwork = art)}
      >
        <img src={art.image} alt={art.title} class="w-full h-24 object-cover rounded-md" />
      </button>
    {/each}
  </div>
{/if}

{#if expanded}
<button 
  type="button" 
  class="w-full text-right mb-4 text-sm cursor-pointer text-white hover:text-main transition-all"
  onclick={() => expanded = !expanded}
  >
  {expanded ? 'Collapse ˅' : 'Expand ^'}
</button>

  <div in:fly={{ y: 20, duration: 300 }}>
    <ArtworkList artworks={artworks} onSelect={handleSelect} />
  </div>
{/if}