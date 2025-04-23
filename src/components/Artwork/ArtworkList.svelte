<script lang="ts">
  import type { Artwork } from '../../types/artwork.ts';
  let { artworks, onSelect, previewMode = false }: {
    artworks: Artwork[],
    onSelect: (art: Artwork) => void,
    previewMode?: boolean
  } = $props();

  const tags = ["#2d", "#pixel", "#scenery", '#oc', '#fanart'];
  let selectedTags = $state<string[]>([]);

  // Toggle tag selection
  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }

  // Filter artworks based on selected tags - AND logic
  let filtered = $derived(
    selectedTags.length > 0 
      ? artworks.filter(art => 
          // Show only artworks that have ALL the selected tags (AND relationship)
          selectedTags.every(selectedTag => 
            art.tags.includes(selectedTag)
          )
        )
      : artworks
  );
</script>

{#if !previewMode}
  <div class="flex flex-wrap gap-2 mb-4">
    {#each tags as tag}
      <button
        class="px-3 py-1 border-2 border-secondary hover:hov-fx rounded-xl text-sm transition-all
               {selectedTags.includes(tag) ? 'bg-main text-black-text' : 'bg-white/10 text-white'}"
        onclick={() => toggleTag(tag)}
      >
        {tag}
      </button>
    {/each}
  </div>
{/if}

<div class={previewMode ? 'flex overflow-x-auto gap-4 py-2' : 'grid grid-cols-2 sm:grid-cols-5 gap-2'}>
  {#each filtered as art (art.title)}
    <button
      class="image-border2 overflow-hidden hover:hov-fx transition-all w-full flex flex-col"
      onclick={() => { onSelect(art); }}
    >
      <img 
        src={art.image} 
        alt={art.title} 
        loading="lazy" 
        decoding="async"
        width="800"
        height="600"
        class="rounded-sm object-cover w-full h-36"
      />
      {#if !previewMode}
        <div class="p-2 text-sm font-semibold text-left">
          {art.title}
          
          <!-- Show matching tags -->
          {#if selectedTags.length > 0}
            <div class="flex flex-wrap gap-1 mt-1">
              {#each art.tags.filter(tag => selectedTags.includes(tag)) as tag}
                <span class="text-xs text-main">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </button>
  {/each}
</div>
