<script lang="ts">
  import type { Artwork } from '../data/artMeta.ts';
  let { artworks, onSelect }: { artworks: Artwork[], onSelect: (art: Artwork) => void } = $props();
  console.log("[ArtworkList] now artwork:", artworks);
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
  {#each artworks as art (art.title)}
    <button
      class="border rounded-xl overflow-hidden bg-white/10 hover:bg-main hover:text-black-text transition-all"
      onclick={() => {;
      console.log("p");
        onSelect(art);
      }}
    >
      <img src={art.image} alt={art.title} class="w-full h-32 object-cover rounded-t-md" />
      <div class="p-2 text-sm font-semibold text-left">{art.title}</div>
    </button>
  {/each}
</div>