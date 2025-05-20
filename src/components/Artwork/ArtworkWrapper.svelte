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

  // Define your featured/showcase artwork titles
  const featuredArtworkTitles = [
    "Mikazuki 「三日月」 feat. 1koma",
    "孤独",
    "Sorasaki Hina 「空崎ヒナ」",
    "Dusk 「黄昏」",
    "Magical Pixel"
  ];
  
  // Filter the artworks to get only the featured ones
  const previewArtworks = artworks.filter(art => 
    featuredArtworkTitles.includes(art.title)
  );
  
  // Sort them according to the order in featuredArtworkTitles
  previewArtworks.sort((a, b) => {
    return featuredArtworkTitles.indexOf(a.title) - featuredArtworkTitles.indexOf(b.title);
  });
</script>

{#if !expanded}
  <!-- Big Preview -->
  <Artwork artwork={currentArtwork} />
  
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

  <button 
    type="button" 
    class="button-fx w-full mt-4"
    onclick={() => expanded = !expanded}
    >
    View All Artworks
  </button>
{/if}

{#if expanded}
  <div in:fly={{ y: 20, duration: 300 }} class="p-1 h-md overflow-x-auto custom-scroll-container">
    <ArtworkList artworks={artworks} onSelect={handleSelect} />
  </div>

  <button 
    type="button" 
    class="button-fx mt-4 w-full"
    onclick={() => expanded = !expanded}
  >
  Back to Preview
</button>
{/if}