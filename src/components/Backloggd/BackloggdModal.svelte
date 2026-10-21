<script lang="ts">
  import type { BackloggdGame } from '@/types/backloggd.ts';

  let {
    game,
    onClose,
  }: {
    game: BackloggdGame | null;
    onClose: () => void;
  } = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'playing':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500';
      case 'completed':
        return 'bg-blue-950 text-blue-300 border-blue-500';
      case 'mastered':
        return 'bg-amber-950 text-amber-300 border-amber-500';
      case 'backlog':
        return 'bg-zinc-800 text-zinc-300 border-zinc-600';
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

  $effect(() => {
    if (game) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if game}
  <!-- Backdrop (overflow-hidden) -->
  <div
    class="modal-backdrop fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden select-none"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-game-title"
    tabindex="-1"
  >
    <!-- Modal Card (max-w-4xl, overflow-hidden) -->
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
        aria-label="Close game details"
      >
        <span class="i-ri-close-line w-5 h-5"></span>
      </button>

      <div class="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-5 sm:gap-7 items-start">
        <!-- Cover Column -->
        <div class="flex flex-row md:flex-col items-center sm:items-start gap-4 shrink-0">
          <div class="relative w-28 sm:w-36 md:w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group shrink-0">
            <img
              src={game.cover}
              alt={game.title}
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {#if game.rating && game.rating > 0}
              <div class="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/90 border border-main text-main font-mono font-bold text-xs sm:text-sm flex items-center gap-1 shadow-lg">
                <span class="i-ri-star-fill w-3 h-3 text-main"></span>
                <span>{game.rating}</span>
              </div>
            {/if}
          </div>

          <div class="flex flex-col gap-2.5 w-full">
            <div class={`w-full text-center px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold uppercase tracking-wider ${getStatusColor(game.status)}`}>
              {getStatusLabel(game.status)}
            </div>

            {#if game.hoursPlayed}
              <div class="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-center">
                <span class="text-xs font-mono text-gray-text block uppercase">Playtime</span>
                <span class="text-sm sm:text-base font-bold font-mono text-white">
                  {game.hoursPlayed} hours
                </span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Detail Column -->
        <div class="flex flex-col gap-4 min-w-0 pr-0 md:pr-4">
          <div>
            <h2 id="modal-game-title" class="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
              {game.title}
            </h2>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs sm:text-sm font-mono text-gray-text">
              {#if game.developer}
                <span>Dev: <strong class="text-white">{game.developer}</strong></span>
              {/if}
              {#if game.publisher}
                <span>Pub: <strong class="text-white">{game.publisher}</strong></span>
              {/if}
              {#if game.releaseYear}
                <span>Year: <strong class="text-white">{game.releaseYear}</strong></span>
              {/if}
            </div>
          </div>

          <!-- Platforms -->
          {#if game.platforms && game.platforms.length > 0}
            <div class="flex flex-wrap gap-1.5 items-center">
              <span class="text-xs font-mono text-gray-text uppercase mr-1">Platforms:</span>
              {#each game.platforms as platform}
                <span class="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white">
                  {platform}
                </span>
              {/each}
            </div>
          {/if}

          <!-- Genres -->
          {#if game.genres && game.genres.length > 0}
            <div class="flex flex-wrap gap-1.5">
              {#each game.genres as genre}
                <span class="px-2.5 py-0.5 rounded-full text-xs font-mono bg-main/10 text-main border border-main/30">
                  {genre}
                </span>
              {/each}
            </div>
          {/if}

          <!-- Review Note (if any) -->
          {#if game.review}
            <div class="p-3.5 rounded-xl bg-main/5 border border-main/30 text-xs sm:text-sm font-mono text-gray-text leading-relaxed">
              <span class="text-main font-bold block mb-1 uppercase tracking-wider">// Personal Review</span>
              <p class="m-0 text-white italic">"{game.review}"</p>
            </div>
          {/if}

          <!-- Synopsis (Only this section scrolls if long) -->
          {#if game.synopsis}
            <div class="pt-2 border-t border-white/10">
              <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold mb-1.5">
                Synopsis
              </h3>
              <p class="text-xs sm:text-sm text-gray-text leading-relaxed whitespace-pre-line max-h-36 sm:max-h-44 md:max-h-48 overflow-y-auto custom-scroll pr-2">
                {game.synopsis}
              </p>
            </div>
          {/if}

          <!-- External link -->
          <div class="pt-2 flex justify-end">
            <a
              href={`https://backloggd.com/games/${game.slug || game.id}`}
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-mono text-main hover:underline flex items-center gap-1"
            >
              <span>View on Backloggd</span>
              <span class="i-ri-external-link-line w-3.5 h-3.5"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    animation: modalBackdropFadeIn 0.12s ease-out forwards;
  }
  @keyframes modalBackdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
