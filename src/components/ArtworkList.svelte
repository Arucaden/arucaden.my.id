<script lang="ts">
  import type { Artwork } from '../data/artMeta.ts';
  let { artworks, onSelect }: { artworks: Artwork[], onSelect: (art: Artwork) => void } = $props();

  const tags = ["#2D", "#3D", "#Pixel", "#Scenery"];
  let selectedTag = $state<string | null>(null);

  let filtered = $derived(selectedTag ? artworks.filter(art => art.tags.includes(selectedTag)) : artworks);
</script>

<div class="flex flex-wrap gap-2 mb-4">
  {#each tags as tag}
    <button
      class="px-3 py-1 border rounded-full text-sm transition-all
             {selectedTag === tag ? 'bg-main text-black-text' : 'bg-white/10 text-white'}"
      onclick={() => selectedTag = selectedTag === tag ? null : tag}
    >
      {tag}
    </button>
  {/each}
</div>

<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
  {#each filtered as art (art.title)}
    <button
      class="border rounded-xl overflow-hidden bg-white/10 hover:bg-main hover:text-black-text transition-all"
      onclick={() => {;
        onSelect(art);
      }}
    >
      <img src={art.image} alt={art.title} class="w-full h-32 object-cover rounded-t-md" />
      <div class="p-2 text-sm font-semibold text-left">{art.title}</div>
    </button>
  {/each}
</div>