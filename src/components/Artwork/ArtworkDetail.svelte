<script lang="ts">
  import type { Artwork } from '../../types/artwork.ts';
  let { artwork }: { artwork: Artwork } = $props();
</script>

<div class="flex flex-col md:flex-row text-white gap-6 mb-6">
  <div class="w-full md:w-1/2 aspect-[3/1.8] relative overflow-hidden">
    <img 
      src={artwork.image} 
      alt={artwork.title} 
      class="image-border w-full h-full object-cover absolute inset-0 rounded-lg" 
    />
  </div>

  <div class="flex flex-col w-full md:w-1/2 space-y-4">
    <div>
      <span class="section-title">/ Title</span>
      <h2 class="text-lg font-bold">{artwork.title} ({artwork.year})</h2>
    </div>
    
    <div>
      <span class="section-title">/ Description</span>
      <p class="text-md">{artwork.description}</p>
    </div>
    
    <div>
      <span class="section-title">/ Tags</span>
      <div class="flex flex-wrap gap-2">
        {#each artwork.tags as tag}
          <span class="mt-1 text-xs py-1 px-2 rounded-full bg-main/20 text-secondary">
            {tag}
          </span>
        {/each}
      </div>
    </div>
  </div>
</div>