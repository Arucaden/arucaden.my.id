<script lang="ts">
  import Artwork from './ArtworkDetail.svelte';
  import ArtworkList from './ArtworkList.svelte';
  import { fly } from 'svelte/transition';
  import type { Artwork as ArtType } from '../../types/artwork.ts';
  import '../../styles/global.css';

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

  <!-- Button styled like ProfileWrapper's Show Portrait button -->
  <button 
    type="button" 
    class="bg-main/20 text-main hover:bg-main hover:text-black-text transition-colors py-2 px-4 rounded-lg text-center mt-4 w-full"
    onclick={() => expanded = !expanded}
  >
    View All Artworks
  </button>
  
  <!-- Highlights (hidden on mobile) -->
  <div class="hidden sm:grid grid-cols-5 gap-2 mt-4">
    {#each previewArtworks as art (art.title)}
      <button
        class="image-border2 brightness-90 overflow-hidden hover:hov-fx hover:brightness-100 transition-all"
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
    class="bg-main/20 text-main hover:bg-main hover:text-black-text transition-colors py-2 px-4 rounded-lg text-center mb-4 w-full"
    onclick={() => expanded = !expanded}
  >
    Back to Preview
  </button>

  <div in:fly={{ y: 20, duration: 300 }} class="p-1 h-md overflow-x-auto custom-scroll-container">
    <ArtworkList artworks={artworks} onSelect={handleSelect} />
  </div>
{/if}