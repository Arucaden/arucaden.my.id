<script lang="ts">
  import type { MALAnimeItem } from '@/types/mal.ts';

  let {
    anime,
    onClose,
  }: {
    anime: MALAnimeItem | null;
    onClose: () => void;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  $effect(() => {
    if (anime) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  });

  function getStatusLabel(status: string) {
    switch (status) {
      case 'watching':
        return 'Currently Watching';
      case 'completed':
        return 'Completed';
      case 'plan_to_watch':
        return 'Plan to Watch';
      case 'dropped':
        return 'Dropped';
      case 'on_hold':
        return 'On Hold';
      default:
        return status;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'watching':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]';
      case 'plan_to_watch':
        return 'bg-zinc-800 text-zinc-200 border-zinc-600 shadow-[0_0_12px_rgba(156,163,175,0.2)]';
      case 'dropped':
        return 'bg-rose-950 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
      default:
        return 'bg-zinc-800 text-gray-text border-zinc-700';
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if anime}
  <!-- Full Screen Backdrop (No scroll) -->
  <div
    class="modal-backdrop fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen h-[100dvh] z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden select-none"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-anime-title"
    tabindex="-1"
  >
    <!-- Modal Dialog (Wider max-w-4xl, Fixed with no scroll, only synopsis scrollable) -->
    <div
      class="modal-content relative w-full max-w-4xl max-h-[92vh] my-auto rounded-3xl bg-[rgba(18,14,24,0.96)] border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-5 sm:p-7 md:p-8 overflow-hidden select-text"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Close Button -->
      <button
        type="button"
        onclick={onClose}
        class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-main/20 border border-white/15 hover:border-main text-white hover:text-main flex items-center justify-center transition-all cursor-pointer shadow-md"
        aria-label="Close anime details"
      >
        <span class="i-ri-close-line w-5 h-5"></span>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-5 sm:gap-7 items-start">
        <!-- Poster Column -->
        <div class="flex flex-row md:flex-col items-center sm:items-start gap-4 shrink-0">
          <div class="relative w-28 sm:w-36 md:w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group shrink-0">
            <img
              src={anime.node.main_picture?.large || anime.node.main_picture?.medium}
              alt={anime.node.title}
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {#if anime.list_status.score > 0}
              <div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/90 border border-main text-main font-mono font-bold text-xs sm:text-sm flex items-center gap-1 shadow-lg">
                <span class="i-ri-star-fill w-3 h-3 text-main"></span>
                <span>{anime.list_status.score}</span>
              </div>
            {/if}
          </div>

          <div class="flex flex-col gap-2.5 w-full">
            <!-- Watch status badge -->
            <div class={`w-full text-center px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold uppercase tracking-wider ${getStatusColor(anime.list_status.status)}`}>
              {getStatusLabel(anime.list_status.status)}
            </div>

            <!-- External MAL Link -->
            <a
              href={`https://myanimelist.net/anime/${anime.node.id}`}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full btn-secondary text-xs sm:text-sm font-mono py-2 px-3 flex items-center justify-center gap-2 group hover:border-main"
            >
              <span>View on MAL</span>
              <span class="i-ri-external-link-line w-3.5 h-3.5 text-main transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></span>
            </a>
          </div>
        </div>

        <!-- Details Column -->
        <div class="space-y-4 sm:space-y-4.5 min-w-0">
          <div>
            <h2 id="modal-anime-title" class="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              {anime.node.title}
            </h2>
            {#if anime.node.alternative_titles?.ja || anime.node.alternative_titles?.en}
              <p class="text-xs sm:text-sm font-mono text-gray-text/80 mt-1 truncate">
                {anime.node.alternative_titles?.en || anime.node.alternative_titles?.ja}
              </p>
            {/if}
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">My Score</span>
              <span class="text-base sm:text-lg font-bold text-main flex items-center gap-1.5 mt-1">
                {anime.list_status.score > 0 ? `${anime.list_status.score} / 10` : 'Unrated'}
              </span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">MAL Score</span>
              <span class="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 mt-1">
                <span class="i-ri-award-line w-4 h-4 text-amber-400"></span>
                {anime.node.mean ? `${anime.node.mean}` : 'N/A'}
              </span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">Episodes</span>
              <span class="text-base sm:text-lg font-bold text-white mt-1 block">
                {anime.list_status.num_episodes_watched} / {anime.node.num_episodes || '?'} 
              </span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">Format</span>
              <span class="text-base sm:text-lg font-bold text-white uppercase mt-1 block">
                {anime.node.media_type || 'TV'}
              </span>
            </div>
          </div>

          <!-- Metadata Tags -->
          <div class="flex flex-wrap gap-2 text-xs sm:text-sm font-mono">
            {#if anime.node.start_season}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text capitalize flex items-center gap-1.5">
                <span class="i-ri-calendar-line w-3.5 h-3.5 text-main"></span>
                {anime.node.start_season.season} {anime.node.start_season.year}
              </span>
            {/if}

            {#if anime.node.studios && anime.node.studios.length > 0}
              {#each anime.node.studios as studio}
                <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text flex items-center gap-1.5">
                  <span class="i-ri-building-line w-3.5 h-3.5 text-main"></span>
                  {studio.name}
                </span>
              {/each}
            {/if}

            {#if anime.node.source}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text capitalize">
                Source: {anime.node.source.replace(/_/g, ' ')}
              </span>
            {/if}

            {#if anime.node.rank}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text">
                Rank #{anime.node.rank}
              </span>
            {/if}
          </div>

          <!-- Genres -->
          {#if anime.node.genres && anime.node.genres.length > 0}
            <div class="flex flex-wrap gap-1.5">
              {#each anime.node.genres as genre}
                <span class="px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-mono bg-main/10 text-main border border-main/30">
                  {genre.name}
                </span>
              {/each}
            </div>
          {/if}

          <!-- Synopsis (Only this section scrolls if long) -->
          <div class="pt-2 border-t border-white/10">
            <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold mb-1.5">
              Synopsis
            </h3>
            <p class="text-xs sm:text-sm text-gray-text leading-relaxed whitespace-pre-line max-h-36 sm:max-h-44 md:max-h-48 overflow-y-auto custom-scroll pr-2">
              {anime.node.synopsis || 'No synopsis provided.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    min-height: 100%;
    z-index: 9999;
    animation: modalBackdropFadeIn 0.12s ease-out forwards;
  }
  .modal-content {
    animation: modalContentScaleIn 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes modalBackdropFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes modalContentScaleIn {
    from {
      opacity: 0;
      transform: scale(0.97) translateY(6px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
