<script lang="ts">
  import type { Artwork } from '@/types/artwork.ts';
  let { artwork }: { artwork: Artwork } = $props();
</script>

<div class="flex flex-col md:flex-row text-white gap-6 mb-6">
  <!-- Big Highlighted Preview Artwork with Persistent Main Color Outline & Glow -->
  <div class="w-full md:w-1/2 relative overflow-hidden flex items-center justify-center">
    <div class="max-w-2xl max-h-[500px] w-full">
      <div class="aspect-[3/1.8] relative rounded-2xl overflow-hidden border-1 border-main/80 bg-main/5 p-1 shadow-[0_0_20px_var(--color-accent-glow)] transition-all duration-300">
        <img 
          src={artwork.image} 
          alt={artwork.title} 
          loading="lazy"
          decoding="async"
          class="w-full h-full object-contain rounded-xl"
        />
      </div>
    </div>
  </div>

  <div class="flex flex-col w-full md:w-1/2 space-y-4">
    <div>
      <span class="section-title">// TITLE</span>
      <h2 class="text-xl sm:text-2xl font-bold flex flex-row items-end gap-2 text-white">
        {artwork.title} 
        <span class="text-xs font-mono text-gray-text pb-1">({artwork.year})</span> 
      </h2>
    </div>
    
    <div>
      <span class="section-title">// DESCRIPTION</span>
      <p class="text-sm text-gray-text leading-relaxed">{artwork.description}</p>
    </div>
    
    <div>
      <span class="section-title">// TAGS</span>
      <div class="flex flex-wrap gap-1.5 mt-1">
        {#each artwork.tags as tag}
          <span class="px-3 py-1 text-xs font-mono rounded-full border border-white/20 bg-white/0.1 text-white/80 font-medium">
            {tag}
          </span>
        {/each}
      </div>
    </div>
  </div>
</div>