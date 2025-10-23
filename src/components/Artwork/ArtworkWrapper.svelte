<script lang="ts">
  import Artwork from './ArtworkDetail.svelte';
  import type { Artwork as ArtType } from '@/types/artwork.ts';
  import '@/styles/global.css';
  import ArtworkList from './ArtworkList.svelte';
  import { fly } from 'svelte/transition';

  let { artworks }: { artworks: ArtType[] } = $props();

  let currentArtwork: ArtType = $state(artworks[0]);
  let overlayVisible = $state(false);

  function handleSelect(art: ArtType) {
    currentArtwork = art;
    overlayVisible = false;
  }

  // featured artwork titles
  const featuredArtworkTitles = [
    "Mikazuki 「三日月」 feat. 1koma",
    "孤独",
    "Sorasaki Hina 「空崎ヒナ」",
    "Dusk 「黄昏」",
    "Magical Pixel"
  ];
  
  // Filter featured ones
  const previewArtworks = artworks.filter(art => 
    featuredArtworkTitles.includes(art.title)
  );
  
  previewArtworks.sort((a, b) => {
    return featuredArtworkTitles.indexOf(a.title) - featuredArtworkTitles.indexOf(b.title);
  });
</script>

<div id="artworks-shell" class="relative">
  <div id="artworks-content" class={overlayVisible ? 'invisible pointer-events-none' : ''}>
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
      id="show-all-artworks"
      type="button" 
      class="button-fx w-full mt-4"
      onclick={() => overlayVisible = true}
    >
      View All Artworks
    </button>
  </div>

  <!-- List artworks -->
  <div id="artworks-overlay" class={`absolute inset-0 overlay-base flex flex-col p-2 ${overlayVisible ? 'overlay-visible' : ''}`}>
    <div class="flex items-center justify-between mb-2 bg-black/70 border border-secondary/30 rounded-md px-3 py-2 sticky top-0 z-20">
      <h2 class="section-title m-0">.Artworks</h2>
      <button id="hide-all-artworks" type="button" class="button-fx" onclick={() => overlayVisible = false}>Back</button>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="p-1" in:fly={{ y: 20, duration: 250 }}>
        <script>
          import ArtworkList from './ArtworkList.svelte';
        </script>
        <ArtworkList artworks={artworks} onSelect={handleSelect} />
      </div>
    </div>
  </div>
</div>

<style>
  .overlay-base {
    opacity: 0;
    transform: translateY(8px);
    pointer-events: none;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    transition: opacity 200ms ease, transform 200ms ease;
  }
  .overlay-base.overlay-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
</style>
