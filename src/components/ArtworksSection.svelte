<script lang="ts">
  import Artwork from './Artwork.svelte';
  import ArtworkList from './ArtworkList.svelte';
  import { artworks } from '../data/artworks.ts';
  import Container from './';

  let selectedArtwork = $state(artworks[0]);

  function handleSelect(art: typeof artworks[0]) {
    selectedArtwork = art;
  }
</script>



<div class="space-y-6">
  <!-- Main artwork display -->
  <div class="border border-secondary bg-black/40 p-4 shadow-[0_0_16px_2px_rgba(255,0,102,0.3)]">
    <div class="bg-main text-black-text font-bold text-lg px-4 py-1">
      🎨 {selectedArtwork?.title || 'Artwork'}
    </div>
    <div class="mt-4">
      <Artwork artwork={selectedArtwork} />
    </div>
  </div>

  <!-- Gallery selection -->
  <div class="border border-secondary bg-black/40 p-4 shadow-[0_0_16px_2px_rgba(255,0,102,0.3)]">
    <div class="bg-main text-black-text font-bold text-lg px-4 py-1">
      Gallery
    </div>
    <div class="mt-4">
      <ArtworkList artworks={artworks} onSelect={handleSelect} />
    </div>
  </div>
</div>