<script lang="ts">
  import type { Artwork } from '../../types/artwork.ts';
  let { artworks, onSelect, previewMode = false }: {
    artworks: Artwork[],
    onSelect: (art: Artwork) => void,
    previewMode?: boolean
  } = $props();

  const tags = ["#2D", "#3D", "#Pixel", "#Scenery"];
  let selectedTag = $state<string | null>(null);

  let filtered = $derived(
    selectedTag ? artworks.filter(art => art.tags.includes(selectedTag)) : artworks
  );
</script>

{#if !previewMode}
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
{/if}

<!-- All -->
<div class={previewMode ? 'flex overflow-x-auto gap-4 py-2' : 'grid grid-cols-2 sm:grid-cols-5 gap-2'}>
  {#each filtered as art (art.title)}
    <button
      class="border-2 border-secondary overflow-hidden hover:scale-108% transition-all w-full flex flex-col"
      onclick={() => { onSelect(art); }}
    >
      <img src={art.image} alt={art.title} class="w-full h-full object-cover" />
      {#if !previewMode}
        <div class="p-2 text-sm font-semibold text-left">{art.title}</div>
      {/if}
    </button>
  {/each}
</div>
