<script lang="ts">
  import type { BackloggdStats } from '@/types/backloggd.ts';

  let {
    stats,
    username,
    source = 'cached',
    fetchedAt,
  }: {
    stats: BackloggdStats;
    username: string;
    source?: string;
    fetchedAt?: string;
  } = $props();

  let showInsights = $state(false);

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

  const RATING_STEPS = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="glass-panel p-6 sm:p-8 md:p-10 mb-8 border border-white/10 relative overflow-hidden">
  <!-- Top Row: User & Links -->
  <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
    <div class="flex items-center gap-4">
      <div class="flex flex-col">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            @{username}
          </h1>
        </div>

        <p class="text-sm sm:text-base font-mono text-gray-text mt-1.5">
          Personal video game library, backlog tracking, playthrough logs, and ratings.
        </p>
      </div>
    </div>

    <!-- Right Action Buttons -->
    <div class="flex flex-row items-center gap-2 sm:gap-3 w-full md:w-auto">
      <a
        href={`https://backloggd.com/u/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 md:flex-initial btn-secondary text-xs sm:text-sm font-mono py-2 sm:py-2.5 px-3 sm:px-4 hover:border-main text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
      >
        <span class="i-ri-external-link-line w-4 h-4 text-main"></span>
        <span>Backloggd</span>
      </a>

      <button
        type="button"
        onclick={() => (showInsights = true)}
        class="flex-1 md:flex-initial btn-secondary text-xs sm:text-sm font-mono py-2 sm:py-2.5 px-3 sm:px-4 hover:border-main text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
      >
        <span class="i-ri-bar-chart-box-line w-4 h-4 text-main"></span>
        <span>Analytics</span>
      </button>
    </div>
  </div>

  <!-- Metric Badges Row -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4 pt-6">
    <!-- Total Games -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
      <span class="text-xs font-mono text-gray-text uppercase tracking-wider">Total Games</span>
      <div class="text-xl sm:text-2xl font-black font-mono text-white mt-1">
        {stats.total}
      </div>
    </div>

    <!-- Playing -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
      <span class="text-xs font-mono text-emerald-300 uppercase tracking-wider">Playing</span>
      <div class="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
        {stats.playing}
      </div>
    </div>

    <!-- Completed -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 flex flex-col justify-between">
      <span class="text-xs font-mono text-blue-300 uppercase tracking-wider">Completed</span>
      <div class="text-xl sm:text-2xl font-black font-mono text-blue-400 mt-1">
        {stats.completed}
      </div>
    </div>

    <!-- Mastered -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex flex-col justify-between">
      <span class="text-xs font-mono text-amber-300 uppercase tracking-wider">Mastered</span>
      <div class="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-1">
        {stats.mastered}
      </div>
    </div>

    <!-- Wishlist (Gray Badge) -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-zinc-900/80 border border-zinc-700/60 flex flex-col justify-between">
      <span class="text-xs font-mono text-zinc-300 uppercase tracking-wider">{stats.wishlist > 0 ? 'Wishlist' : 'Backlog'}</span>
      <div class="text-xl sm:text-2xl font-black font-mono text-zinc-200 mt-1">
        {stats.wishlist > 0 ? stats.wishlist : stats.backlog}
      </div>
    </div>

    <!-- Mean Rating -->
    <div class="p-3.5 sm:p-4 rounded-xl bg-[#200a12] border border-main/40 flex flex-col justify-between">
      <span class="text-xs font-mono text-main uppercase tracking-wider">Mean Rating</span>
      <div class="text-xl sm:text-2xl font-black font-mono text-main flex items-center gap-1 mt-1">
        <span class="i-ri-star-fill w-5 h-5 text-main"></span>
        <span>{stats.meanRating > 0 ? stats.meanRating : '-'}</span>
      </div>
    </div>
  </div>
</div>

<!-- Analytics & Insights Modal Dialog (One-Page Merged, No Tabs, max-w-4xl) -->
{#if showInsights}
  <div
    class="modal-backdrop fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden select-none"
    onclick={() => (showInsights = false)}
    role="dialog"
    aria-modal="true"
    aria-label="Backloggd Analytics Modal"
    tabindex="-1"
  >
    <div
      class="relative w-full max-w-4xl max-h-[92vh] my-auto rounded-3xl bg-[rgba(18,14,24,0.96)] border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.9)] p-6 sm:p-8 md:p-10 flex flex-col overflow-hidden select-text"
      onclick={(e) => e.stopPropagation()}
      role="document"
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 mb-6 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-main/10 border border-main/20 flex items-center justify-center text-main shrink-0">
            <span class="i-ri-bar-chart-box-line w-5 h-5 sm:w-6 sm:h-6"></span>
          </div>
          <div>
            <h2 class="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight m-0">
              Game Analytics & Insights
            </h2>
            <p class="text-xs sm:text-sm font-mono text-gray-text mt-0.5">
              Overview for @{username} • Mean Rating: <strong class="text-main">{stats.meanRating > 0 ? `${stats.meanRating}★` : '-'}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onclick={() => (showInsights = false)}
          class="w-9 h-9 rounded-full bg-white/10 hover:bg-main/20 border border-white/15 hover:border-main text-white hover:text-main flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <span class="i-ri-close-line w-5 h-5"></span>
        </button>
      </div>

      <!-- Single Page Content: Two Columns on Desktop, Clean Scroll on Mobile -->
      <div class="flex-1 overflow-y-auto custom-scroll pr-1 md:pr-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <!-- Column 1: Rating Distribution (Exact 10 intervals from 5.0 down to 0.5) -->
          <div class="space-y-3 sm:space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold flex items-center gap-2 m-0">
                <span class="i-ri-star-fill w-4 h-4"></span>
                <span>Rating Distribution</span>
              </h3>
              <span class="text-xs font-mono text-gray-text">{stats.ratedCount} rated titles</span>
            </div>

            <div class="space-y-2">
              {#each RATING_STEPS as score}
                {@const count = stats.ratingDistribution[score] || 0}
                {@const percentNum = stats.ratedCount > 0 ? (count / stats.ratedCount) * 100 : 0}
                {@const percentText = percentNum.toFixed(1)}
                <div class="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-mono">
                  <span class="w-12 font-bold text-gray-text shrink-0 text-right flex items-center justify-end gap-1">
                    <span>{score.toFixed(1)}</span>
                    <span class="i-ri-star-fill w-3 h-3 text-main"></span>
                  </span>

                  <div class="flex-grow h-3 sm:h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                    <div
                      class="h-full bg-main transition-all duration-500 rounded-full shadow-[0_0_8px_var(--color-accent-glow)]"
                      style={`width: ${count > 0 ? Math.max(percentNum, 1.5) : 0}%;`}
                    ></div>
                  </div>

                  <div class="flex items-center justify-end gap-1.5 shrink-0 whitespace-nowrap min-w-[76px] text-right text-xs sm:text-sm">
                    <span class="text-white font-bold">{count}</span>
                    <span class="text-gray-text/70">({percentText}%)</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Column 2: Top Genres, Top Platforms & Status Overview -->
          <div class="space-y-6">
            <!-- Top Genres -->
            <div>
              <div class="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold flex items-center gap-2 m-0">
                  <span class="i-ri-price-tag-3-line w-4 h-4"></span>
                  <span>Top Genres</span>
                </h3>
                <span class="text-xs font-mono text-gray-text">Top {stats.topGenres.length} categories</span>
              </div>

              <div class="flex flex-wrap gap-2">
                {#each stats.topGenres.slice(0, 10) as genre}
                  <div class="px-2.5 sm:px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 hover:border-main/50 text-xs sm:text-sm font-mono flex items-center gap-2 transition-all">
                    <span class="text-white">{genre.name}</span>
                    <span class="px-1.5 py-0.2 rounded-md bg-main/20 text-main text-xs font-bold">
                      {genre.count}
                    </span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Top Platforms -->
            <div>
              <div class="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                <h3 class="text-xs sm:text-sm font-mono uppercase tracking-wider text-main font-bold flex items-center gap-2 m-0">
                  <span class="i-ri-gamepad-line w-4 h-4"></span>
                  <span>Top Platforms</span>
                </h3>
                <span class="text-xs font-mono text-gray-text">Top {stats.topPlatforms.length} platforms</span>
              </div>

              <div class="flex flex-wrap gap-2">
                {#each stats.topPlatforms.slice(0, 10) as platform}
                  <div class="px-2.5 sm:px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 text-xs sm:text-sm font-mono flex items-center gap-2 transition-all">
                    <span class="text-gray-200">{platform.name}</span>
                    <span class="px-1.5 py-0.2 rounded-md bg-white/10 text-white text-xs font-bold">
                      {platform.count}
                    </span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Library Overview Status Pill Row -->
            <div class="pt-4 border-t border-white/10 grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div class="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <span class="block text-emerald-400 font-bold text-sm sm:text-base">{stats.playing}</span>
                <span class="text-emerald-300 text-[11px] uppercase tracking-wider">Playing</span>
              </div>
              <div class="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                <span class="block text-blue-400 font-bold text-sm sm:text-base">{stats.completed}</span>
                <span class="text-blue-300 text-[11px] uppercase tracking-wider">Completed</span>
              </div>
              <div class="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                <span class="block text-amber-400 font-bold text-sm sm:text-base">{stats.mastered}</span>
                <span class="text-amber-300 text-[11px] uppercase tracking-wider">Mastered</span>
              </div>
              <div class="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/60">
                <span class="block text-zinc-200 font-bold text-sm sm:text-base">{stats.wishlist}</span>
                <span class="text-zinc-400 text-[11px] uppercase tracking-wider">Wishlist</span>
              </div>
            </div>
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
