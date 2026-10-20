<script lang="ts">
  import type { MALMangaItem } from '@/types/mal.ts';

  let {
    item,
    onSelect,
  }: {
    item: MALMangaItem;
    onSelect: (item: MALMangaItem) => void;
  } = $props();

  function getStatusStyle(status: string) {
    switch (status) {
      case 'reading':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-500';
      case 'plan_to_read':
        return 'bg-zinc-800 text-zinc-200 border-zinc-600';
      case 'dropped':
        return 'bg-rose-950 text-rose-300 border-rose-500';
      default:
        return 'bg-zinc-800 text-gray-text border-zinc-700';
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'reading':
        return 'Reading';
      case 'completed':
        return 'Completed';
      case 'plan_to_read':
        return 'Plan to Read';
      case 'dropped':
        return 'Dropped';
      default:
        return status.replace(/_/g, ' ');
    }
  }

  const userScore = $derived(item.list_status.score);
  const readChapters = $derived(item.list_status.num_chapters_read || 0);
  const totalChapters = $derived(item.node.num_chapters || 0);
  const progressPercent = $derived(
    totalChapters > 0
      ? Math.min(100, Math.round((readChapters / totalChapters) * 100))
      : readChapters > 0
      ? 100
      : 0
  );

  const releaseYear = $derived(
    item.node.start_date ? item.node.start_date.slice(0, 4) : ''
  );

  const primaryAuthor = $derived.by(() => {
    if (item.node.authors && item.node.authors.length > 0) {
      const a = item.node.authors[0].node;
      const name = `${a.first_name || ''} ${a.last_name || ''}`.trim();
      if (name) return name;
    }
    if (item.node.serialization && item.node.serialization.length > 0) {
      return item.node.serialization[0].node.name;
    }
    return item.node.media_type ? item.node.media_type.toUpperCase() : 'Manga';
  });

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
  <!-- Poster Image Area -->
  <div class="relative w-full aspect-[2/3] overflow-hidden bg-white/[0.04]">
    <!-- Skeleton placeholder while image loads -->
    {#if !imgLoaded}
      <div class="absolute inset-0 bg-white/[0.04] animate-pulse flex items-center justify-center">
        <span class="i-ri-image-line w-7 h-7 text-white/15"></span>
      </div>
    {/if}

    <img
      src={item.node.main_picture?.medium || item.node.main_picture?.large}
      alt={item.node.title}
      loading="lazy"
      decoding="async"
      onload={() => (imgLoaded = true)}
      class={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
        imgLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    />

    <!-- Gradient overlay for text contrast -->
    <div class="absolute inset-0 bg-gradient-to-t from-[rgba(14,10,18,0.95)] via-transparent to-black/30 pointer-events-none"></div>

    <!-- Status pill top-left -->
    <div class="absolute top-2 left-2 z-10 max-w-[65%]">
      <span class={`block truncate px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold tracking-wide border uppercase shadow-md ${getStatusStyle(item.list_status.status)}`}>
        {getStatusLabel(item.list_status.status)}
      </span>
    </div>

    <!-- User score badge top-right -->
    <div class="absolute top-2 right-2 z-10 shrink-0">
      {#if userScore > 0}
        <span class="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold bg-black border border-main text-main shadow-[0_0_8px_var(--color-accent-glow)]">
          <span class="i-ri-star-fill w-3 h-3 text-main"></span>
          <span>{userScore}</span>
        </span>
      {:else}
        <span class="inline-flex items-center px-1.5 py-0.5 rounded-lg text-[11px] sm:text-xs font-mono bg-zinc-900 text-gray-text/70 border border-white/20">
          -
        </span>
      {/if}
    </div>

    <!-- Chapters Progress Bar at bottom of poster -->
    <div class="absolute bottom-0 inset-x-0 h-1 bg-white/10">
      <div
        class="h-full bg-main transition-all duration-300"
        style={`width: ${progressPercent}%;`}
      ></div>
    </div>
  </div>

  <!-- Content / Info -->
  <div class="p-3 sm:p-3.5 flex flex-col flex-grow justify-between gap-2">
    <div>
      <h3
        class="text-sm font-bold text-white group-hover:text-main transition-colors line-clamp-2 leading-snug"
        title={item.node.title}
      >
        {item.node.title}
      </h3>

      <div class="flex items-center justify-between text-xs font-mono text-gray-text mt-1.5">
        <span class="truncate" title={primaryAuthor}>
          {primaryAuthor}
        </span>
        {#if item.node.mean}
          <span class="flex items-center gap-1 text-white/90 font-medium shrink-0 ml-1">
            <span class="i-ri-award-line w-3 h-3 text-amber-400"></span>
            {item.node.mean}
          </span>
        {/if}
      </div>
    </div>

    <!-- Footer meta -->
    <div class="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-gray-text">
      <span>
        {readChapters} / {totalChapters > 0 ? totalChapters : '?'}
      </span>

      {#if releaseYear}
        <span class="px-1.5 py-0.5 rounded bg-zinc-800 text-gray-text border border-white/10 shrink-0 font-medium text-xs">
          {releaseYear}
        </span>
      {/if}
    </div>
  </div>
</div>
