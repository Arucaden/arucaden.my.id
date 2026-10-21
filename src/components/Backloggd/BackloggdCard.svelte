<script lang="ts">
  import type { BackloggdGame } from '@/types/backloggd.ts';

  let {
    item,
    onSelect,
  }: {
    item: BackloggdGame;
    onSelect: (item: BackloggdGame) => void;
  } = $props();

  function getStatusStyle(status: string) {
    switch (status) {
      case 'playing':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-500';
      case 'mastered':
        return 'bg-amber-950 text-amber-300 border-amber-500';
      case 'backlog':
        return 'bg-zinc-800 text-zinc-200 border-zinc-600';
      case 'abandoned':
      case 'retired':
        return 'bg-rose-950 text-rose-300 border-rose-500';
      case 'wishlist':
        return 'bg-zinc-800 text-zinc-300 border-zinc-600';
      default:
        return 'bg-zinc-800 text-gray-text border-zinc-700';
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'playing':
        return 'Playing';
      case 'completed':
        return 'Completed';
      case 'mastered':
        return 'Mastered';
      case 'backlog':
        return 'Backlog';
      case 'abandoned':
        return 'Abandoned';
      case 'wishlist':
        return 'Wishlist';
      default:
        return status;
    }
  }

  let imgLoaded = $state(false);
</script>

<div
  role="button"
  tabindex="0"
  onclick={() => onSelect(item)}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item);
    }
  }}
  class="group relative flex flex-col rounded-2xl overflow-hidden bg-[rgba(18,14,24,0.7)] border border-white/10 hover:border-main/70 hover:shadow-[0_0_24px_var(--color-accent-glow)] transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-main"
>
  <!-- Cover Image Area -->
  <div class="relative w-full aspect-[3/4] overflow-hidden bg-white/[0.04]">
    {#if !imgLoaded}
      <div class="absolute inset-0 bg-white/[0.04] animate-pulse flex items-center justify-center">
        <span class="i-ri-gamepad-line w-7 h-7 text-white/15"></span>
      </div>
    {/if}

    <img
      src={item.cover}
      alt={item.title}
      loading="lazy"
      decoding="async"
      onload={() => (imgLoaded = true)}
      class={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
        imgLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    />

    <div class="absolute inset-0 bg-gradient-to-t from-[rgba(14,10,18,0.95)] via-transparent to-black/30 pointer-events-none"></div>

    <!-- Status Badge -->
    <div class="absolute top-2 left-2 z-10 max-w-[65%]">
      <span class={`block truncate px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold tracking-wide border uppercase shadow-md ${getStatusStyle(item.status)}`}>
        {getStatusLabel(item.status)}
      </span>
    </div>

    <!-- Rating Badge -->
    <div class="absolute top-2 right-2 z-10 shrink-0">
      {#if item.rating && item.rating > 0}
        <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold bg-black border border-main text-main shadow-[0_0_8px_var(--color-accent-glow)]">
          <span class="i-ri-star-fill w-3 h-3 text-main"></span>
          <span>{item.rating}</span>
        </span>
      {:else}
        <span class="inline-flex items-center px-1.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono bg-zinc-900 text-gray-text/70 border border-white/20">
          -
        </span>
      {/if}
    </div>

    {#if item.isFavorite}
      <div class="absolute bottom-2 right-2 z-10 bg-black/80 p-1 rounded-full border border-pink-500/60 shadow-lg" title="Favorite">
        <span class="i-ri-heart-3-fill w-3.5 h-3.5 text-pink-500 block"></span>
      </div>
    {/if}
  </div>

  <!-- Content & Info -->
  <div class="p-3 sm:p-3.5 flex flex-col flex-grow justify-between gap-2">
    <div>
      <h3
        class="text-sm font-bold text-white group-hover:text-main transition-colors line-clamp-2 leading-snug"
        title={item.title}
      >
        {item.title}
      </h3>

      <div class="flex items-center justify-between text-xs font-mono text-gray-text mt-1.5">
        <span class="truncate">
          {item.developer || (item.genres && item.genres[0]) || ''}
        </span>
        {#if item.releaseYear}
          <span class="text-white/80 shrink-0 ml-1">
            {item.releaseYear}
          </span>
        {/if}
      </div>
    </div>

    <!-- Footer Meta -->
    <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-text">
      <span class="truncate max-w-[120px]">
        {item.platforms && item.platforms.length > 0 ? item.platforms[0] : (item.genres && item.genres[0]) || ''}
      </span>

      {#if item.hoursPlayed}
        <span class="px-1.5 py-0.5 rounded bg-zinc-800 text-gray-text border border-white/10 shrink-0 font-medium text-xs">
          {item.hoursPlayed}h
        </span>
      {/if}
    </div>
  </div>
</div>
