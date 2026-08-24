<script lang="ts">
  import Artwork from './ArtworkDetail.svelte';
  import ViewAllButton from '../Common/ViewAllButton.svelte';
  import type { Artwork as ArtType } from '@/types/artwork.ts';
  import '@/styles/global.css';
  import ArtworkList from './ArtworkList.svelte';
  import { fly } from 'svelte/transition';

  let { artworks }: { artworks: ArtType[] } = $props();

  // featured artwork titles
  const featuredArtworkTitles = [
    "Mikazuki 「三日月」 feat. 1koma",
    "孤独",
    "Sorasaki Hina 「空崎ヒナ」",
    "Dusk 「黄昏」",
    "Magical Pixel"
  ];
  
  // Filter featured ones
  const previewArtworks = [...artworks]
    .filter((art) => featuredArtworkTitles.includes(art.title))
    .sort(
      (a, b) =>
        featuredArtworkTitles.indexOf(a.title) -
        featuredArtworkTitles.indexOf(b.title)
    );

  let currentArtwork: ArtType = $state(previewArtworks.length > 0 ? previewArtworks[0] : artworks[0]);
  let overlayVisible = $state(false);

  function handleSelect(art: ArtType) {
    currentArtwork = art;
    overlayVisible = false;
  }
</script>

<div id="artworks-shell" class="relative">
  <div id="artworks-content" class={overlayVisible ? 'invisible pointer-events-none' : ''}>
    <!-- Big Preview -->
    <Artwork artwork={currentArtwork} />

    <!-- Highlights (hidden on mobile) -->
    <div class="hidden sm:grid grid-cols-5 gap-2 mt-4">
      {#each previewArtworks as art (art.title)}
        <button
          class="image-border2 brightness-90 overflow-hidden hover:hov-fx hover:brightness-100 transition-all cursor-pointer"
          onclick={() => (currentArtwork = art)}
        >
          <img src={art.image} alt={art.title} class="w-full h-24 object-cover rounded-md" />
        </button>
      {/each}
    </div>

    <ViewAllButton
      id="show-all-artworks"
      text={`View All Artworks (${artworks.length})`}
      onclick={() => (overlayVisible = true)}
    />
  </div>

  <!-- List artworks -->
  <div id="artworks-overlay" class={`absolute inset-0 overlay-base flex flex-col p-2 ${overlayVisible ? 'overlay-visible' : ''}`}>
    <div class="flex items-center justify-between mb-2 bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 sticky top-0 z-20 backdrop-blur-md">
      <h2 class="text-sm font-mono font-bold tracking-wider text-white uppercase m-0">Artworks</h2>
      <button id="hide-all-artworks" type="button" class="btn-secondary py-1 px-3 text-xs" onclick={() => (overlayVisible = false)}>
        Close
      </button>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="p-1" in:fly={{ y: 20, duration: 250 }}>
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
    background: rgba(8, 6, 11, 0.85);
    backdrop-filter: blur(12px);
    transition: opacity 200ms ease, transform 200ms ease;
    border-radius: 1rem;
    z-index: 50;
  }
  .overlay-base.overlay-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
</style>
