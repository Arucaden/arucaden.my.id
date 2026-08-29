<script lang="ts">
  import type { Artwork } from '@/types/artwork.ts';

  let {
    artworks,
    onSelect = undefined,
    previewMode = false,
  }: {
    artworks: Artwork[];
    onSelect?: (art: Artwork) => void;
    previewMode?: boolean;
  } = $props();

  const sortedArtworks = $derived(
    [...artworks].sort((a, b) => (b.year || 0) - (a.year || 0))
  );

  const tags = ['#2d', '#pixel', '#scenery', '#oc', '#fanart', '#design', '#3d'];
  let selectedTags = $state<string[]>([]);

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  let filtered = $derived(
    selectedTags.length > 0
      ? sortedArtworks.filter((art) =>
          selectedTags.every((selectedTag) => art.tags.includes(selectedTag))
        )
      : sortedArtworks
  );
</script>

{#if !previewMode}
  <div class="flex flex-wrap gap-2 mb-4">
    {#each tags as tag}
      <button
        type="button"
        class="filter-btn {selectedTags.includes(tag) ? 'filter-btn-active' : 'filter-btn-inactive'}"
        onclick={() => toggleTag(tag)}
      >
        {tag}
      </button>
    {/each}
  </div>
{/if}

<div
  class={previewMode
    ? 'flex overflow-x-auto gap-4 py-2'
    : 'grid grid-cols-2 sm:grid-cols-5 gap-2'}
>
  {#each filtered as art (art.title)}
    <button
      type="button"
      class="relative overflow-hidden image-border2 hover:hov-fx cursor-pointer text-left bg-transparent block"
      onclick={() => onSelect?.(art)}
    >
      <img
        src={art.image}
        alt={art.title}
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover aspect-square"
        width="300"
        height="300"
      />
      {#if !previewMode}
        <div
          class="absolute inset-x-0 bottom-0 bg-black/70 p-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity"
        >
          <p class="text-xs text-white truncate font-bold">{art.title}</p>
          <div class="flex flex-wrap gap-1 mt-1">
            {#each art.tags.filter((tag) => selectedTags.includes(tag)) as tag}
              <span class="badge badge-active">{tag}</span>
            {/each}
          </div>
        </div>
      {/if}
    </button>
  {/each}
</div>
