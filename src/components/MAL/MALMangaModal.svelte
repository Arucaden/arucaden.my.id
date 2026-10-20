<script lang="ts">
  import type { MALMangaItem } from '@/types/mal.ts';

  let {
    manga,
    onClose,
  }: {
    manga: MALMangaItem | null;
    onClose: () => void;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  $effect(() => {
    if (manga) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  });

  function getStatusLabel(status: string) {
    switch (status) {
      case 'reading':
        return 'Currently Reading';
      case 'completed':
        return 'Completed';
      case 'plan_to_read':
        return 'Plan to Read';
      case 'dropped':
        return 'Dropped';
      case 'on_hold':
        return 'On Hold';
      default:
        return status.replace(/_/g, ' ');
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'reading':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]';
      case 'plan_to_read':
        return 'bg-zinc-800 text-zinc-200 border-zinc-600 shadow-[0_0_12px_rgba(156,163,175,0.2)]';
      case 'dropped':
        return 'bg-rose-950 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
      default:
        return 'bg-zinc-800 text-gray-text border-zinc-700';
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if manga}
  <!-- Full Screen Backdrop (No scroll) -->
  <div
    class="modal-backdrop fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen h-[100dvh] z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden select-none"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-manga-title"
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
        aria-label="Close manga details"
      >
        <span class="i-ri-close-line w-5 h-5"></span>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-5 sm:gap-7 items-start">
        <!-- Poster Column -->
        <div class="flex flex-row md:flex-col items-center sm:items-start gap-4 shrink-0">
          <div class="relative w-28 sm:w-36 md:w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group shrink-0">
            <img
              src={manga.node.main_picture?.large || manga.node.main_picture?.medium}
              alt={manga.node.title}
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {#if manga.list_status.score > 0}
              <div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/90 border border-main text-main font-mono font-bold text-xs sm:text-sm flex items-center gap-1 shadow-lg">
                <span class="i-ri-star-fill w-3 h-3 text-main"></span>
                <span>{manga.list_status.score}</span>
              </div>
            {/if}
          </div>

          <div class="flex flex-col gap-2.5 w-full">
            <!-- Watch status badge -->
            <div class={`w-full text-center px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold uppercase tracking-wider ${getStatusColor(manga.list_status.status)}`}>
              {getStatusLabel(manga.list_status.status)}
            </div>

            <!-- External MAL Link -->
            <a
              href={`https://myanimelist.net/manga/${manga.node.id}`}
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
            <h2 id="modal-manga-title" class="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
              {manga.node.title}
            </h2>
            {#if manga.node.alternative_titles?.ja || manga.node.alternative_titles?.en}
              <p class="text-xs sm:text-sm font-mono text-gray-text/80 mt-1 truncate">
                {manga.node.alternative_titles?.en || manga.node.alternative_titles?.ja}
              </p>
            {/if}
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">My Score</span>
              <span class="text-base sm:text-lg font-bold text-main flex items-center gap-1.5 mt-1">
                {manga.list_status.score > 0 ? `${manga.list_status.score} / 10` : 'Unrated'}
              </span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">MAL Score</span>
              <span class="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 mt-1">
                <span class="i-ri-award-line w-4 h-4 text-amber-400"></span>
                {manga.node.mean ? `${manga.node.mean}` : 'N/A'}
              </span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">Chapters</span>
              <span class="text-base sm:text-lg font-bold text-white mt-1 block">
                {manga.list_status.num_chapters_read} / {manga.node.num_chapters || '?'}
              </span>
            </div>

            <div class="p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <span class="text-gray-text/75 block text-xs font-medium uppercase tracking-wider">Volumes</span>
              <span class="text-base sm:text-lg font-bold text-white mt-1 block">
                {manga.list_status.num_volumes_read} / {manga.node.num_volumes || '?'}
              </span>
            </div>
          </div>

          <!-- Metadata Tags -->
          <div class="flex flex-wrap gap-2 text-xs sm:text-sm font-mono">
            {#if manga.node.authors && manga.node.authors.length > 0}
              {#each manga.node.authors as author}
                <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text flex items-center gap-1.5">
                  <span class="i-ri-user-star-line w-3.5 h-3.5 text-main"></span>
                  {author.node.first_name} {author.node.last_name} ({author.role})
                </span>
              {/each}
            {/if}

            {#if manga.node.serialization && manga.node.serialization.length > 0}
              {#each manga.node.serialization as ser}
                <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text flex items-center gap-1.5">
                  <span class="i-ri-book-line w-3.5 h-3.5 text-main"></span>
                  {ser.node.name}
                </span>
              {/each}
            {/if}

            {#if manga.node.media_type}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text uppercase">
                {manga.node.media_type}
              </span>
            {/if}

            {#if manga.node.status}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text capitalize">
                Status: {manga.node.status.replace(/_/g, ' ')}
              </span>
            {/if}

            {#if manga.node.rank}
              <span class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-text">
                Rank #{manga.node.rank}
              </span>
            {/if}
          </div>

          <!-- Genres -->
          {#if manga.node.genres && manga.node.genres.length > 0}
            <div class="flex flex-wrap gap-1.5">
              {#each manga.node.genres as genre}
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
              {manga.node.synopsis || 'No synopsis provided.'}
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
