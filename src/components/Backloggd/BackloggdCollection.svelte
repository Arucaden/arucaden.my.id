<script lang="ts">
  import type { BackloggdGame, BackloggdStats, BackloggdStatus } from '@/types/backloggd.ts';
  import BackloggdStatsHeader from './BackloggdStatsHeader.svelte';
  import BackloggdCard from './BackloggdCard.svelte';
  import BackloggdModal from './BackloggdModal.svelte';
  import BackloggdSkeleton from './BackloggdSkeleton.svelte';

  let {
    items = [],
    stats,
    username,
    source = 'cached',
    fetchedAt = '',
    loading = false,
  }: {
    items?: BackloggdGame[];
    stats?: BackloggdStats;
    username: string;
    source?: 'live' | 'cached';
    fetchedAt?: string;
    loading?: boolean;
  } = $props();

  let searchQuery = $state('');
  let activeStatus = $state<string>('all');
  let selectedGenre = $state<string>('all');
  let selectedPlatform = $state<string>('all');
  let sortBy = $state<string>('rating_desc');
  let viewMode = $state<'grid' | 'list'>('grid');
  let selectedGame = $state<BackloggdGame | null>(null);

  // Responsive batch size: 24 on desktop (>=768px), 12 on mobile (<768px)
  let isDesktop = $state(false);
  let displayLimit = $state(12);

  $effect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(min-width: 768px)');
      isDesktop = mq.matches;
      displayLimit = isDesktop ? 24 : 12;

      const handler = (e: MediaQueryListEvent) => {
        isDesktop = e.matches;
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  });

  const batchSize = $derived(isDesktop ? 24 : 12);

  // Extract unique genres
  const availableGenres = $derived.by(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.genres) {
        for (const g of item.genres) {
          set.add(g);
        }
      }
    }
    return Array.from(set).sort();
  });

  // Extract unique platforms
  const availablePlatforms = $derived.by(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.platforms) {
        for (const p of item.platforms) {
          set.add(p);
        }
      }
    }
    return Array.from(set).sort();
  });

  // Filtered & Sorted items
  const filteredItems = $derived.by(() => {
    let list = items;

    // Filter by status
    if (activeStatus !== 'all') {
      if (activeStatus === 'top_rated') {
        list = list.filter((i) => i.rating === 5);
      } else {
        list = list.filter((i) => i.status === activeStatus);
      }
    }

    // Filter by genre
    if (selectedGenre !== 'all') {
      list = list.filter((i) => i.genres?.includes(selectedGenre));
    }

    // Filter by platform
    if (selectedPlatform !== 'all') {
      list = list.filter((i) => i.platforms?.includes(selectedPlatform));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((i) => {
        const title = i.title.toLowerCase();
        const dev = i.developer?.toLowerCase() || '';
        const genres = i.genres?.map((g) => g.toLowerCase()).join(' ') || '';
        const platforms = i.platforms?.map((p) => p.toLowerCase()).join(' ') || '';
        return (
          title.includes(q) ||
          dev.includes(q) ||
          genres.includes(q) ||
          platforms.includes(q)
        );
      });
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy === 'rating_desc') {
        const diff = (b.rating || 0) - (a.rating || 0);
        if (diff !== 0) return diff;
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      }
      if (sortBy === 'rating_asc') {
        return (a.rating || 0) - (b.rating || 0);
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'year_desc') {
        return (b.releaseYear || 0) - (a.releaseYear || 0);
      }
      if (sortBy === 'hours_desc') {
        return (b.hoursPlayed || 0) - (a.hoursPlayed || 0);
      }
      return 0;
    });
  });

  const displayedItems = $derived(filteredItems.slice(0, displayLimit));
  const hasMore = $derived(displayLimit < filteredItems.length);

  function resetFilters() {
    searchQuery = '';
    activeStatus = 'all';
    selectedGenre = 'all';
    selectedPlatform = 'all';
    sortBy = 'rating_desc';
    displayLimit = batchSize;
  }
</script>

{#if loading}
  <BackloggdSkeleton />
{:else}
  <div class="w-full space-y-6">
    <!-- Top Stats Hero Header -->
    {#if stats}
      <BackloggdStatsHeader
        {stats}
        {username}
        {source}
        {fetchedAt}
      />
    {/if}

    <!-- Filter & Controls Toolbar -->
    <div class="glass-panel p-4 sm:p-5 border border-white/10 space-y-4">
      <!-- Row 1: Status Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scroll">
        <button
          type="button"
          onclick={() => { activeStatus = 'all'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'all' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>All</span>
          <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-gray-300 text-xs font-bold">
            {stats?.total || items.length}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'playing'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'playing' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Playing</span>
          <span class="px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-bold">
            {stats?.playing || 0}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'completed'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'completed' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Completed</span>
          <span class="px-1.5 py-0.2 rounded-md bg-blue-950 text-blue-300 border border-blue-600/40 text-xs font-bold">
            {stats?.completed || 0}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'mastered'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'mastered' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Mastered</span>
          <span class="px-1.5 py-0.2 rounded-md bg-amber-950 text-amber-300 border border-amber-600/40 text-xs font-bold">
            {stats?.mastered || 0}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'backlog'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'backlog' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Backlog</span>
          <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-600/40 text-xs font-bold">
            {stats?.backlog || 0}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'wishlist'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'wishlist' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Wishlist</span>
          <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-600/40 text-xs font-bold">
            {stats?.wishlist || 0}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'abandoned'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'abandoned' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Abandoned</span>
          <span class="px-1.5 py-0.2 rounded-md bg-rose-950 text-rose-300 border border-rose-600/40 text-xs font-bold">
            {stats?.abandoned || 0}
          </span>
        </button>

        <button
          type="button"
          onclick={() => { activeStatus = 'top_rated'; displayLimit = batchSize; }}
          class={`filter-btn text-xs sm:text-sm ${activeStatus === 'top_rated' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
        >
          <span>Top Rated (5★)</span>
          <span class="px-1.5 py-0.2 rounded-md bg-[#2d050e] text-main border border-main/40 text-xs font-bold">
            {stats?.ratingDistribution[5] || 0}
          </span>
        </button>
      </div>

      <!-- Row 2: Search, Filters & View Toggle -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <!-- Search Input -->
        <div class="lg:col-span-4 relative">
          <span class="i-ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-text w-4 h-4 pointer-events-none"></span>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search title, developer, platform..."
            class="w-full pl-10 pr-9 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-main/50 focus:border-main focus:outline-none text-xs sm:text-sm font-mono text-white placeholder-gray-text/60 transition-all"
          />
          {#if searchQuery}
            <button
              type="button"
              onclick={() => (searchQuery = '')}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-white text-xs sm:text-sm cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          {/if}
        </div>

        <!-- Genre Filter -->
        <div class="lg:col-span-2">
          <select
            bind:value={selectedGenre}
            class="w-full py-2 px-3 rounded-xl bg-[rgba(18,14,24,0.9)] border border-white/10 hover:border-main/50 focus:border-main focus:outline-none text-xs sm:text-sm font-mono text-white cursor-pointer"
          >
            <option value="all">All Genres ({availableGenres.length})</option>
            {#each availableGenres as genre}
              <option value={genre}>{genre}</option>
            {/each}
          </select>
        </div>

        <!-- Platform Filter -->
        <div class="lg:col-span-2">
          <select
            bind:value={selectedPlatform}
            class="w-full py-2 px-3 rounded-xl bg-[rgba(18,14,24,0.9)] border border-white/10 hover:border-main/50 focus:border-main focus:outline-none text-xs sm:text-sm font-mono text-white cursor-pointer"
          >
            <option value="all">All Platforms ({availablePlatforms.length})</option>
            {#each availablePlatforms as platform}
              <option value={platform}>{platform}</option>
            {/each}
          </select>
        </div>

        <!-- Sort By -->
        <div class="lg:col-span-3">
          <select
            bind:value={sortBy}
            class="w-full py-2 px-3 rounded-xl bg-[rgba(18,14,24,0.9)] border border-white/10 hover:border-main/50 focus:border-main focus:outline-none text-xs sm:text-sm font-mono text-white cursor-pointer"
          >
            <option value="rating_desc">Rating: Highest First</option>
            <option value="rating_asc">Rating: Lowest First</option>
            <option value="year_desc">Release Year: Newest First</option>
            <option value="hours_desc">Hours: Most Played First</option>
            <option value="title_asc">Title: A to Z</option>
          </select>
        </div>

        <!-- View Mode Switcher -->
        <div class="lg:col-span-1 flex justify-end gap-1">
          <button
            type="button"
            onclick={() => (viewMode = 'grid')}
            class={`p-2 rounded-xl border transition-all ${
              viewMode === 'grid'
                ? 'bg-main/20 text-main border-main'
                : 'bg-white/[0.04] text-gray-text border-white/10 hover:text-white'
            }`}
            aria-label="Grid View"
            title="Grid View"
          >
            <span class="i-ri-grid-fill w-4 h-4 block"></span>
          </button>

          <button
            type="button"
            onclick={() => (viewMode = 'list')}
            class={`p-2 rounded-xl border transition-all ${
              viewMode === 'list'
                ? 'bg-main/20 text-main border-main'
                : 'bg-white/[0.04] text-gray-text border-white/10 hover:text-white'
            }`}
            aria-label="List View"
            title="List View"
          >
            <span class="i-ri-list-check w-4 h-4 block"></span>
          </button>
        </div>
      </div>

      <!-- Active Filters Summary & Count -->
      <div class="flex items-center justify-between text-xs sm:text-sm font-mono text-gray-text pt-2 border-t border-white/5">
        <div>
          Showing <span class="text-main font-bold">{filteredItems.length}</span> of {items.length} games
          {#if searchQuery || activeStatus !== 'all' || selectedGenre !== 'all' || selectedPlatform !== 'all'}
            <button
              type="button"
              onclick={resetFilters}
              class="ml-3 text-xs sm:text-sm text-main hover:underline cursor-pointer font-semibold"
            >
              Reset filters
            </button>
          {/if}
        </div>

        {#if searchQuery}
          <span class="truncate max-w-[200px]">
            Results for "{searchQuery}"
          </span>
        {/if}
      </div>
    </div>

    <!-- Content List Area -->
    {#if filteredItems.length === 0}
      <!-- Empty State -->
      <div class="glass-panel p-12 text-center border border-white/10 my-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-text">
          <span class="i-ri-gamepad-line w-8 h-8"></span>
        </div>
        <h3 class="text-lg font-bold text-white">No games found</h3>
        <p class="text-xs sm:text-sm font-mono text-gray-text mt-1 max-w-sm mx-auto">
          No games match your current search query or filter combination.
        </p>
        <button
          type="button"
          onclick={resetFilters}
          class="mt-4 btn-secondary text-xs sm:text-sm font-mono py-2 px-4 hover:border-main text-main cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    {:else if viewMode === 'grid'}
      <!-- Grid View (Desktop 24 per section, Mobile 12) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {#each displayedItems as item (item.id)}
          <BackloggdCard {item} onSelect={(selected) => (selectedGame = selected)} />
        {/each}
      </div>
    {:else}
      <!-- List / Table View -->
      <div class="glass-panel overflow-hidden border border-white/10">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm font-mono">
            <thead class="bg-white/5 border-b border-white/10 text-gray-text uppercase tracking-wider text-xs">
              <tr>
                <th class="py-3 px-4">#</th>
                <th class="py-3 px-4">Title</th>
                <th class="py-3 px-4">Year</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">My Score</th>
                <th class="py-3 px-4">Hours</th>
                <th class="py-3 px-4">Platforms / Dev</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#each displayedItems as item, idx (item.id)}
                <tr
                  onclick={() => (selectedGame = item)}
                  class="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                >
                  <td class="py-3 px-4 text-gray-text/70">{idx + 1}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <img
                        src={item.cover}
                        alt={item.title}
                        class="w-8 h-11 object-cover rounded-md border border-white/10 shrink-0"
                        loading="lazy"
                      />
                      <div>
                        <div class="font-bold text-white group-hover:text-main transition-colors line-clamp-1 text-sm">
                          {item.title}
                        </div>
                        <div class="text-xs text-gray-text/70 line-clamp-1 mt-0.5">
                          {item.genres?.slice(0, 3).join(', ') || '-'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-gray-text">
                    {item.releaseYear || '-'}
                  </td>
                  <td class="py-3 px-4">
                    <span class="capitalize text-gray-text">
                      {item.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    {#if item.rating && item.rating > 0}
                      <span class="inline-flex items-center gap-1 font-bold text-main">
                        <span class="i-ri-star-fill w-3.5 h-3.5"></span>
                        {item.rating}
                      </span>
                    {:else}
                      <span class="text-gray-text/50">-</span>
                    {/if}
                  </td>
                  <td class="py-3 px-4 text-gray-text">
                    {item.hoursPlayed ? `${item.hoursPlayed}h` : '-'}
                  </td>
                  <td class="py-3 px-4 text-gray-text truncate max-w-[160px]">
                    {item.developer || item.platforms?.slice(0, 2).join(', ') || '-'}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    <!-- Load More / Pagination (Desktop 24 more, Mobile 12 more) -->
    {#if hasMore}
      <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onclick={() => (displayLimit += batchSize)}
          class="btn-secondary text-xs sm:text-sm font-mono py-2.5 px-6 hover:border-main flex items-center gap-2 group cursor-pointer"
        >
          <span>Load More ({batchSize} more)</span>
          <span class="i-ri-arrow-down-line w-4 h-4 text-main transition-transform group-hover:translate-y-0.5"></span>
        </button>

        <button
          type="button"
          onclick={() => (displayLimit = filteredItems.length)}
          class="text-xs sm:text-sm font-mono text-gray-text hover:text-main py-2 px-4 transition-colors cursor-pointer"
        >
          Show All ({filteredItems.length - displayLimit} remaining)
        </button>
      </div>
    {/if}

    <!-- Detail Modal -->
    <BackloggdModal game={selectedGame} onClose={() => (selectedGame = null)} />
  </div>
{/if}
