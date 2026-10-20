<script lang="ts">
  import type { MALStats, MALMangaStats, MALMediaType } from '@/types/mal.ts';

  let {
    mediaType = 'anime',
    animeStats,
    mangaStats,
    username,
    source,
    fetchedAt,
    onSwitchMediaType,
  }: {
    mediaType?: MALMediaType;
    animeStats?: MALStats;
    mangaStats?: MALMangaStats;
    username: string;
    source: 'live' | 'cached';
    fetchedAt: string;
    onSwitchMediaType?: (type: MALMediaType) => void;
  } = $props();

  let showInsights = $state(false);
  let activeTab = $state<'scores' | 'insights'>('scores');

  const isAnime = $derived(mediaType === 'anime');
  const currentStats = $derived(isAnime ? animeStats : mangaStats);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && showInsights) {
      showInsights = false;
    }
  }

  $effect(() => {
    if (showInsights) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="glass-panel p-6 sm:p-8 md:p-10 mb-8 border border-white/10 relative overflow-hidden">
  <!-- Header Top Row -->
  <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
    <div class="flex items-center gap-4">
      <div class="flex flex-col">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            @{username}
          </h1>

          <!-- Flat Anime / Manga Toggle (Icon only, no text, flat solid container beside username) -->
          <div class="inline-flex items-center p-1 rounded-xl bg-[#140e1c] border border-white/15 gap-1 shadow-sm">
            <button
              type="button"
              onclick={() => onSwitchMediaType?.('anime')}
              class={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                isAnime
                  ? 'bg-main text-black font-bold'
                  : 'text-gray-text hover:text-white hover:bg-white/10'
              }`}
              title="Switch to Anime Collection"
              aria-label="Switch to Anime Collection"
            >
              <span class="i-ri-film-line w-4 h-4 sm:w-5 sm:h-5"></span>
            </button>
            <button
              type="button"
              onclick={() => onSwitchMediaType?.('manga')}
              class={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                !isAnime
                  ? 'bg-main text-black font-bold'
                  : 'text-gray-text hover:text-white hover:bg-white/10'
              }`}
              title="Switch to Manga Collection"
              aria-label="Switch to Manga Collection"
            >
              <span class="i-ri-book-open-line w-4 h-4 sm:w-5 sm:h-5"></span>
            </button>
          </div>
        </div>

        <p class="text-sm sm:text-base font-mono text-gray-text mt-1.5">
          {#if isAnime}
            My personal collection of anime ratings and statistics from official MyAnimeList API.
          {:else}
            My personal collection of manga ratings and reading statistics from official MyAnimeList API.
          {/if}
        </p>
      </div>
    </div>

    <!-- Right Controls / Links (Row on mobile and desktop) -->
    <div class="flex flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
      <a
        href={`https://myanimelist.net/profile/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 md:flex-initial btn-secondary group text-xs sm:text-sm font-mono py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2 hover:border-main text-center cursor-pointer"
      >
        <span>MyAnimeList</span>
        <span class="i-ri-external-link-line w-4 h-4 text-main transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"></span>
      </a>

      <!-- Insights modal trigger button -->
      <button
        type="button"
        onclick={() => (showInsights = true)}
        class="flex-1 md:flex-initial btn-secondary text-xs sm:text-sm font-mono py-2.5 px-3 sm:px-4 flex items-center justify-center gap-2 transition-all hover:border-main text-center cursor-pointer"
      >
        <span class="i-ri-bar-chart-box-line w-4 h-4 text-main shrink-0"></span>
        <span class="truncate sm:whitespace-nowrap">Analytics</span>
      </button>
    </div>
  </div>

  <!-- Key Statistics Grid -->
  {#if currentStats}
    <div class="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
      <!-- Total -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border-2 border-white/60 flex flex-col justify-between">
        <span class="text-xs font-mono font-semibold text-gray-text/90 uppercase tracking-wider">Tracked</span>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-black text-white font-mono">{currentStats.total}</span>
          <span class="text-xs font-mono text-gray-text">{isAnime ? 'anime' : 'manga'}</span>
        </div>
      </div>

      <!-- Consumed Units (Episodes / Chapters) -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border-2 border-white/60 flex flex-col justify-between">
        <span class="text-xs font-mono font-semibold text-gray-text/90 uppercase tracking-wider">
          {isAnime ? 'Watched' : 'Read'}
        </span>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-black text-white font-mono">
            {isAnime
              ? (animeStats?.episodesWatched || 0).toLocaleString()
              : (mangaStats?.chaptersRead || 0).toLocaleString()}
          </span>
          <span class="text-xs font-mono text-gray-text">
            {#if isAnime}
              eps.
            {:else}
              chs.
            {/if}
          </span>
        </div>
      </div>

      <!-- Mean Score -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-main/[0.07] border-2 border-main/30 flex flex-col justify-between">
        <span class="text-xs font-mono font-semibold text-main uppercase tracking-wider">Mean Rating</span>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-black text-main font-mono">{currentStats.meanScore}</span>
          <span class="text-xs font-mono text-main/80">/ 10</span>
        </div>
      </div>

      <!-- Completed -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-blue-500/[0.07] border-2 border-blue-500/20 flex flex-col justify-between">
        <span class="text-xs font-mono font-semibold text-blue-300 uppercase tracking-wider">Completed</span>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-black text-blue-400 font-mono">{currentStats.completed}</span>
          <span class="text-xs font-mono text-blue-300/80">{isAnime ? 'shows' : 'titles'}</span>
        </div>
      </div>

      <!-- In Progress (Watching / Reading) -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-emerald-500/[0.07] border-2 border-emerald-500/20 flex flex-col justify-between">
        <span class="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
          {isAnime ? 'Watching' : 'Reading'}
        </span>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {isAnime ? (animeStats?.watching || 0) : (mangaStats?.reading || 0)}
          </span>
          <span class="text-xs font-mono text-emerald-300/80">in progress</span>
        </div>
      </div>

      <!-- Queued (Plan to Watch / Plan to Read) -->
      <div class="p-3.5 sm:p-4 rounded-xl bg-gray-500/[0.07] border-2 border-gray-700 flex flex-col justify-between">
        <span class="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider">
          {isAnime ? 'Plan to Watch' : 'Plan to Read'}
        </span>
        <div class="mt-2 flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-black text-gray-400 font-mono">
            {isAnime ? (animeStats?.planToWatch || 0) : (mangaStats?.planToRead || 0)}
          </span>
          <span class="text-xs font-mono text-gray-400">queued</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Independent Analytics & Insights Modal Popup (Fixed, No Scroll, Full Screen Backdrop) -->
{#if showInsights && currentStats}
  <div
    class="modal-backdrop fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen h-[100dvh] z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md overflow-hidden select-none"
    onclick={() => (showInsights = false)}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-insights-title"
    tabindex="-1"
  >
    <!-- Modal Content Card: Enlarged & Fixed No Scroll -->
    <div
      class="modal-content relative w-full max-w-3xl sm:max-w-4xl rounded-3xl bg-[rgba(18,14,24,0.96)] border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-6 sm:p-8 md:p-10 overflow-hidden select-text"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Close Button -->
      <button
        type="button"
        onclick={() => (showInsights = false)}
        class="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-main/20 border border-white/15 hover:border-main text-white hover:text-main flex items-center justify-center transition-all cursor-pointer shadow-md"
        aria-label="Close analytics modal"
      >
        <span class="i-ri-close-line w-5 h-5"></span>
      </button>

      <!-- Modal Title Header -->
      <div class="flex items-center gap-3.5 pb-4 mb-5 border-b border-white/10 pr-10">
        <div class="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-main/10 border border-main/20 flex items-center justify-center text-main shrink-0">
          <span class="i-ri-bar-chart-box-line w-6 h-6"></span>
        </div>
        <div>
          <h2 id="modal-insights-title" class="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
            {isAnime ? 'Anime Analytics' : 'Manga Analytics'}
          </h2>
          <p class="text-xs sm:text-sm font-mono text-gray-text mt-0.5">
            Overview for @{username} • Mean Rating: <span class="text-main font-bold">{currentStats.meanScore}★</span>
          </p>
        </div>
      </div>

      <!-- Mobile Tab Switcher (Visible only on mobile screens <md) -->
      <div class="grid grid-cols-2 p-1 rounded-xl bg-white/5 border border-white/10 mb-5 md:hidden">
        <button
          type="button"
          onclick={() => (activeTab = 'scores')}
          class={`py-2 px-3 rounded-lg text-xs sm:text-sm font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'scores'
              ? 'bg-main text-black font-bold shadow-sm'
              : 'text-gray-text hover:text-white'
          }`}
        >
          <span class="i-ri-star-fill w-4 h-4"></span>
          <span>Scores</span>
        </button>
        <button
          type="button"
          onclick={() => (activeTab = 'insights')}
          class={`py-2 px-3 rounded-lg text-xs sm:text-sm font-mono font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'insights'
              ? 'bg-main text-black font-bold shadow-sm'
              : 'text-gray-text hover:text-white'
          }`}
        >
          <span class="i-ri-price-tag-3-line w-4 h-4"></span>
          <span>{isAnime ? 'Genres & Studios' : 'Genres & Authors'}</span>
        </button>
      </div>

      <!-- Modal Body (Grid on md+, Tab-switched on mobile) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        <!-- Score Distribution Column -->
        <div class={`space-y-3 sm:space-y-4 ${activeTab !== 'scores' ? 'hidden md:block' : ''}`}>
          <div class="flex items-center justify-between">
            <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold flex items-center gap-2">
              <span class="i-ri-star-fill w-4 h-4"></span>
              Score Distribution
            </h3>
            <span class="text-xs sm:text-sm font-mono text-gray-text">{currentStats.ratedCount} rated titles</span>
          </div>

          <div class="space-y-2 sm:space-y-2.5">
            {#each [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] as score}
              {@const count = currentStats.scoreDistribution[score] || 0}
              {@const percentNum = currentStats.ratedCount > 0 ? (count / currentStats.ratedCount) * 100 : 0}
              {@const percentText = percentNum.toFixed(1)}
              <div class="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-mono">
                <span class="w-5 sm:w-6 font-bold text-gray-text shrink-0 text-right">
                  {score}
                </span>

                <div class="flex-grow h-3 sm:h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                  <div
                    class="h-full bg-main transition-all duration-500 rounded-full"
                    style={`width: ${count > 0 ? Math.max(percentNum, 1.5) : 0}%;`}
                  ></div>
                </div>

                <div class="flex items-center justify-end gap-1.5 shrink-0 whitespace-nowrap min-w-[80px] text-right text-xs sm:text-sm">
                  <span class="text-white font-bold">{count}</span>
                  <span class="text-gray-text/70">({percentText}%)</span>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Top Genres & Creators Column -->
        <div class={`space-y-5 sm:space-y-6 ${activeTab !== 'insights' ? 'hidden md:block' : ''}`}>
          <div>
            <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold mb-3 flex items-center gap-2">
              <span class="i-ri-price-tag-3-line w-4 h-4"></span>
              {isAnime ? 'Top Watched Genres' : 'Top Read Genres'}
            </h3>
            <div class="flex flex-wrap gap-2">
              {#each currentStats.topGenres.slice(0, 8) as genre}
                <div class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-main/50 text-xs sm:text-sm font-mono flex items-center gap-2 transition-all">
                  <span class="text-white">{genre.name}</span>
                  <span class="px-1.5 py-0.2 rounded-md bg-main/20 text-main text-xs font-bold">
                    {genre.count}
                  </span>
                </div>
              {/each}
            </div>
          </div>

          <div>
            {#if isAnime && animeStats}
              <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold mb-3 flex items-center gap-2">
                <span class="i-ri-building-line w-4 h-4"></span>
                Top Studios
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each animeStats.topStudios.slice(0, 6) as studio}
                  <div class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm font-mono flex items-center gap-2">
                    <span class="text-gray-text">{studio.name}</span>
                    <span class="text-main font-bold text-xs sm:text-sm">{studio.count}</span>
                  </div>
                {/each}
              </div>
            {:else if !isAnime && mangaStats}
              <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold mb-3 flex items-center gap-2">
                <span class="i-ri-user-star-line w-4 h-4"></span>
                Top Authors
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each mangaStats.topAuthors.slice(0, 6) as author}
                  <div class="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm font-mono flex items-center gap-2">
                    <span class="text-gray-text">{author.name}</span>
                    <span class="text-main font-bold text-xs sm:text-sm">{author.count}</span>
                  </div>
                {/each}
              </div>
            {/if}
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
