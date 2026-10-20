<script lang="ts">
  import type {
    MALAnimeItem,
    MALStats,
    MALMangaItem,
    MALMangaStats,
    MALMediaType,
  } from '@/types/mal.ts';
  import MALStatsHeader from './MALStatsHeader.svelte';
  import MALAnimeCard from './MALAnimeCard.svelte';
  import MALMangaCard from './MALMangaCard.svelte';
  import MALAnimeModal from './MALAnimeModal.svelte';
  import MALMangaModal from './MALMangaModal.svelte';
  import MALSkeleton from './MALSkeleton.svelte';

  let {
    animeItems = [],
    animeStats,
    mangaItems = [],
    mangaStats,
    // backward compat fallback
    items,
    stats,
    username,
    source,
    fetchedAt,
    loading = false,
  }: {
    animeItems?: MALAnimeItem[];
    animeStats?: MALStats;
    mangaItems?: MALMangaItem[];
    mangaStats?: MALMangaStats;
    items?: MALAnimeItem[];
    stats?: MALStats;
    username: string;
    source: 'live' | 'cached';
    fetchedAt: string;
    loading?: boolean;
  } = $props();

  const finalAnimeItems = $derived(animeItems.length > 0 ? animeItems : items || []);
  const finalAnimeStats = $derived(animeStats || stats!);

  let mediaType = $state<MALMediaType>('anime');
  let searchQuery = $state('');
  let activeStatus = $state<string>('all');
  let selectedGenre = $state<string>('all');
  let sortBy = $state<string>('score_desc');
  let viewMode = $state<'grid' | 'list'>('grid');
  let selectedAnime = $state<MALAnimeItem | null>(null);
  let selectedManga = $state<MALMangaItem | null>(null);

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

  function switchMediaType(type: MALMediaType) {
    if (mediaType === type) return;
    mediaType = type;
    searchQuery = '';
    activeStatus = 'all';
    selectedGenre = 'all';
    sortBy = 'score_desc';
    displayLimit = batchSize;
  }

  // Extract all unique genres for currently active media type
  const availableGenres = $derived.by(() => {
    const set = new Set<string>();
    const currentList = mediaType === 'anime' ? finalAnimeItems : mangaItems;
    for (const it of currentList) {
      if (it.node.genres) {
        for (const g of it.node.genres) {
          set.add(g.name);
        }
      }
    }
    return Array.from(set).sort();
  });

  // Filtered & Sorted anime items
  const filteredAnimeItems = $derived.by(() => {
    let list = finalAnimeItems;

    if (activeStatus === 'watching') {
      list = list.filter((i) => i.list_status.status === 'watching');
    } else if (activeStatus === 'completed') {
      list = list.filter((i) => i.list_status.status === 'completed');
    } else if (activeStatus === 'plan_to_watch') {
      list = list.filter((i) => i.list_status.status === 'plan_to_watch');
    } else if (activeStatus === 'dropped') {
      list = list.filter((i) => i.list_status.status === 'dropped');
    } else if (activeStatus === 'top_rated') {
      list = list.filter((i) => i.list_status.score === 10);
    }

    if (selectedGenre !== 'all') {
      list = list.filter((i) =>
        i.node.genres?.some((g) => g.name === selectedGenre)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((i) => {
        const title = i.node.title.toLowerCase();
        const en = i.node.alternative_titles?.en?.toLowerCase() || '';
        const ja = i.node.alternative_titles?.ja?.toLowerCase() || '';
        const studios = i.node.studios?.map((s) => s.name.toLowerCase()).join(' ') || '';
        return (
          title.includes(q) ||
          en.includes(q) ||
          ja.includes(q) ||
          studios.includes(q)
        );
      });
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'score_desc') {
        const scoreDiff = (b.list_status.score || 0) - (a.list_status.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (b.node.mean || 0) - (a.node.mean || 0);
      }
      if (sortBy === 'score_asc') {
        return (a.list_status.score || 0) - (b.list_status.score || 0);
      }
      if (sortBy === 'mal_score_desc') {
        return (b.node.mean || 0) - (a.node.mean || 0);
      }
      if (sortBy === 'title_asc') {
        return a.node.title.localeCompare(b.node.title);
      }
      if (sortBy === 'units_desc') {
        return (
          (b.list_status.num_episodes_watched || 0) -
          (a.list_status.num_episodes_watched || 0)
        );
      }
      if (sortBy === 'updated_desc') {
        const dateA = a.list_status.updated_at ? new Date(a.list_status.updated_at).getTime() : 0;
        const dateB = b.list_status.updated_at ? new Date(b.list_status.updated_at).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  });

  // Filtered & Sorted manga items
  const filteredMangaItems = $derived.by(() => {
    let list = mangaItems;

    if (activeStatus === 'reading') {
      list = list.filter((i) => i.list_status.status === 'reading');
    } else if (activeStatus === 'completed') {
      list = list.filter((i) => i.list_status.status === 'completed');
    } else if (activeStatus === 'plan_to_read') {
      list = list.filter((i) => i.list_status.status === 'plan_to_read');
    } else if (activeStatus === 'dropped') {
      list = list.filter((i) => i.list_status.status === 'dropped');
    } else if (activeStatus === 'top_rated') {
      list = list.filter((i) => i.list_status.score === 10);
    }

    if (selectedGenre !== 'all') {
      list = list.filter((i) =>
        i.node.genres?.some((g) => g.name === selectedGenre)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((i) => {
        const title = i.node.title.toLowerCase();
        const en = i.node.alternative_titles?.en?.toLowerCase() || '';
        const ja = i.node.alternative_titles?.ja?.toLowerCase() || '';
        const authors = i.node.authors?.map((a) => `${a.node.first_name} ${a.node.last_name}`.toLowerCase()).join(' ') || '';
        const serialization = i.node.serialization?.map((s) => s.node.name.toLowerCase()).join(' ') || '';
        return (
          title.includes(q) ||
          en.includes(q) ||
          ja.includes(q) ||
          authors.includes(q) ||
          serialization.includes(q)
        );
      });
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'score_desc') {
        const scoreDiff = (b.list_status.score || 0) - (a.list_status.score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        return (b.node.mean || 0) - (a.node.mean || 0);
      }
      if (sortBy === 'score_asc') {
        return (a.list_status.score || 0) - (b.list_status.score || 0);
      }
      if (sortBy === 'mal_score_desc') {
        return (b.node.mean || 0) - (a.node.mean || 0);
      }
      if (sortBy === 'title_asc') {
        return a.node.title.localeCompare(b.node.title);
      }
      if (sortBy === 'units_desc') {
        return (
          (b.list_status.num_chapters_read || 0) -
          (a.list_status.num_chapters_read || 0)
        );
      }
      if (sortBy === 'updated_desc') {
        const dateA = a.list_status.updated_at ? new Date(a.list_status.updated_at).getTime() : 0;
        const dateB = b.list_status.updated_at ? new Date(b.list_status.updated_at).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  });

  const activeFilteredItems = $derived(
    mediaType === 'anime' ? filteredAnimeItems : filteredMangaItems
  );

  const displayedAnimeItems = $derived(filteredAnimeItems.slice(0, displayLimit));
  const displayedMangaItems = $derived(filteredMangaItems.slice(0, displayLimit));

  const hasMore = $derived(displayLimit < activeFilteredItems.length);

  function resetFilters() {
    searchQuery = '';
    activeStatus = 'all';
    selectedGenre = 'all';
    sortBy = 'score_desc';
    displayLimit = batchSize;
  }
</script>

{#if loading}
  <MALSkeleton />
{:else}
  <div class="w-full space-y-6">
    <!-- Top Stats Hero Header (Polymorphic: Anime or Manga with flat switcher beside username) -->
    <MALStatsHeader
      {mediaType}
      animeStats={finalAnimeStats}
      {mangaStats}
      {username}
      {source}
      {fetchedAt}
      onSwitchMediaType={switchMediaType}
    />

    <!-- Filter & Controls Toolbar -->
    <div class="glass-panel p-4 sm:p-5 border border-white/10 space-y-4">
      <!-- Row 1: Status Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scroll">
        {#if mediaType === 'anime'}
          <!-- Anime Status Pills -->
          <button
            type="button"
            onclick={() => { activeStatus = 'all'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'all' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>All</span>
            <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-gray-300 text-xs font-bold">
              {finalAnimeStats?.total || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'watching'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'watching' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Watching</span>
            <span class="px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-bold">
              {finalAnimeStats?.watching || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'completed'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'completed' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Completed</span>
            <span class="px-1.5 py-0.2 rounded-md bg-blue-950 text-blue-300 border border-blue-600/40 text-xs font-bold">
              {finalAnimeStats?.completed || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'plan_to_watch'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'plan_to_watch' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Plan to Watch</span>
            <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-600/40 text-xs font-bold">
              {finalAnimeStats?.planToWatch || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'dropped'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'dropped' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Dropped</span>
            <span class="px-1.5 py-0.2 rounded-md bg-rose-950 text-rose-300 border border-rose-600/40 text-xs font-bold">
              {finalAnimeStats?.dropped || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'top_rated'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'top_rated' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Top Rated (10★)</span>
            <span class="px-1.5 py-0.2 rounded-md bg-[#2d050e] text-main border border-main/40 text-xs font-bold">
              {finalAnimeStats?.scoreDistribution[10] || 0}
            </span>
          </button>
        {:else}
          <!-- Manga Status Pills -->
          <button
            type="button"
            onclick={() => { activeStatus = 'all'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'all' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>All</span>
            <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-gray-300 text-xs font-bold">
              {mangaStats?.total || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'reading'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'reading' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Reading</span>
            <span class="px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-600/40 text-xs font-bold">
              {mangaStats?.reading || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'completed'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'completed' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Completed</span>
            <span class="px-1.5 py-0.2 rounded-md bg-blue-950 text-blue-300 border border-blue-600/40 text-xs font-bold">
              {mangaStats?.completed || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'plan_to_read'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'plan_to_read' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Plan to Read</span>
            <span class="px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-600/40 text-xs font-bold">
              {mangaStats?.planToRead || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'dropped'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'dropped' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Dropped</span>
            <span class="px-1.5 py-0.2 rounded-md bg-rose-950 text-rose-300 border border-rose-600/40 text-xs font-bold">
              {mangaStats?.dropped || 0}
            </span>
          </button>

          <button
            type="button"
            onclick={() => { activeStatus = 'top_rated'; displayLimit = batchSize; }}
            class={`filter-btn text-xs sm:text-sm ${activeStatus === 'top_rated' ? 'filter-btn-active' : 'filter-btn-inactive'}`}
          >
            <span>Top Rated (10★)</span>
            <span class="px-1.5 py-0.2 rounded-md bg-[#2d050e] text-main border border-main/40 text-xs font-bold">
              {mangaStats?.scoreDistribution[10] || 0}
            </span>
          </button>
        {/if}
      </div>

      <!-- Row 2: Search, Filters & View Toggle -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        <!-- Search Input -->
        <div class="lg:col-span-5 relative">
          <span class="i-ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-text w-4 h-4 pointer-events-none"></span>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder={mediaType === 'anime' ? 'Search by title, Japanese, studio...' : 'Search by title, Japanese, author...'}
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
        <div class="lg:col-span-3">
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

        <!-- Sort By -->
        <div class="lg:col-span-3">
          <select
            bind:value={sortBy}
            class="w-full py-2 px-3 rounded-xl bg-[rgba(18,14,24,0.9)] border border-white/10 hover:border-main/50 focus:border-main focus:outline-none text-xs sm:text-sm font-mono text-white cursor-pointer"
          >
            <option value="score_desc">Score: Highest First</option>
            <option value="score_asc">Score: Lowest First</option>
            <option value="mal_score_desc">Global MAL Rating</option>
            <option value="title_asc">Title: A to Z</option>
            <option value="units_desc">
              {mediaType === 'anime' ? 'Episodes Watched' : 'Chapters Read'}
            </option>
            <option value="updated_desc">Recently Updated</option>
          </select>
        </div>

        <!-- View Mode Buttons -->
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
          Showing <span class="text-main font-bold">{activeFilteredItems.length}</span> of {mediaType === 'anime' ? finalAnimeItems.length : mangaItems.length} {mediaType}
          {#if searchQuery || activeStatus !== 'all' || selectedGenre !== 'all'}
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
    {#if activeFilteredItems.length === 0}
      <!-- Empty State -->
      <div class="glass-panel p-12 text-center border border-white/10 my-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-text">
          <span class="i-ri-search-eye-line w-8 h-8"></span>
        </div>
        <h3 class="text-lg font-bold text-white">No {mediaType} found</h3>
        <p class="text-xs sm:text-sm font-mono text-gray-text mt-1 max-w-sm mx-auto">
          No titles match your current search query or filter combination.
        </p>
        <button
          type="button"
          onclick={resetFilters}
          class="mt-4 btn-secondary text-xs sm:text-sm font-mono py-2 px-4 hover:border-main text-main"
        >
          Clear Filters
        </button>
      </div>
    {:else if viewMode === 'grid'}
      <!-- Grid View (Desktop 24 per section, Mobile 12) -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {#if mediaType === 'anime'}
          {#each displayedAnimeItems as item (item.node.id)}
            <MALAnimeCard {item} onSelect={(selected) => (selectedAnime = selected)} />
          {/each}
        {:else}
          {#each displayedMangaItems as item (item.node.id)}
            <MALMangaCard {item} onSelect={(selected) => (selectedManga = selected)} />
          {/each}
        {/if}
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
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-center">My Score</th>
                <th class="py-3 px-4 text-center">MAL Score</th>
                <th class="py-3 px-4">
                  {mediaType === 'anime' ? 'Episodes' : 'Chapters / Vols'}
                </th>
                <th class="py-3 px-4">
                  {mediaType === 'anime' ? 'Studio' : 'Author / Serialization'}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              {#if mediaType === 'anime'}
                {#each displayedAnimeItems as item, idx (item.node.id)}
                  <tr
                    onclick={() => (selectedAnime = item)}
                    class="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td class="py-3 px-4 text-gray-text/70">{idx + 1}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={item.node.main_picture?.medium}
                          alt={item.node.title}
                          class="w-8 h-11 object-cover rounded-md border border-white/10 shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <div class="font-bold text-white group-hover:text-main transition-colors line-clamp-1 text-sm">
                            {item.node.title}
                          </div>
                          <div class="text-xs text-gray-text/70 line-clamp-1 mt-0.5">
                            {item.node.genres?.map((g) => g.name).slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span class="capitalize text-gray-text">
                        {item.list_status.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      {#if item.list_status.score > 0}
                        <span class="inline-flex items-center gap-1 font-bold text-main">
                          <span class="i-ri-star-fill w-3.5 h-3.5"></span>
                          {item.list_status.score}
                        </span>
                      {:else}
                        <span class="text-gray-text/50">-</span>
                      {/if}
                    </td>
                    <td class="py-3 px-4 text-center text-white/90">
                      {item.node.mean ? `${item.node.mean} ★` : '-'}
                    </td>
                    <td class="py-3 px-4 text-gray-text">
                      {item.list_status.num_episodes_watched} / {item.node.num_episodes || '?'}
                    </td>
                    <td class="py-3 px-4 text-gray-text truncate max-w-[140px]">
                      {item.node.studios?.[0]?.name || '-'}
                    </td>
                  </tr>
                {/each}
              {:else}
                {#each displayedMangaItems as item, idx (item.node.id)}
                  <tr
                    onclick={() => (selectedManga = item)}
                    class="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td class="py-3 px-4 text-gray-text/70">{idx + 1}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={item.node.main_picture?.medium}
                          alt={item.node.title}
                          class="w-8 h-11 object-cover rounded-md border border-white/10 shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <div class="font-bold text-white group-hover:text-main transition-colors line-clamp-1 text-sm">
                            {item.node.title}
                          </div>
                          <div class="text-xs text-gray-text/70 line-clamp-1 mt-0.5">
                            {item.node.genres?.map((g) => g.name).slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <span class="capitalize text-gray-text">
                        {item.list_status.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-center">
                      {#if item.list_status.score > 0}
                        <span class="inline-flex items-center gap-1 font-bold text-main">
                          <span class="i-ri-star-fill w-3.5 h-3.5"></span>
                          {item.list_status.score}
                        </span>
                      {:else}
                        <span class="text-gray-text/50">-</span>
                      {/if}
                    </td>
                    <td class="py-3 px-4 text-center text-white/90">
                      {item.node.mean ? `${item.node.mean} ★` : '-'}
                    </td>
                    <td class="py-3 px-4 text-gray-text">
                      {item.list_status.num_chapters_read} / {item.node.num_chapters || '?'} chs
                    </td>
                    <td class="py-3 px-4 text-gray-text truncate max-w-[140px]">
                      {item.node.authors?.[0]?.node
                        ? `${item.node.authors[0].node.first_name} ${item.node.authors[0].node.last_name}`
                        : item.node.serialization?.[0]?.node?.name || '-'}
                    </td>
                  </tr>
                {/each}
              {/if}
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
          onclick={() => (displayLimit = activeFilteredItems.length)}
          class="text-xs sm:text-sm font-mono text-gray-text hover:text-main py-2 px-4 transition-colors cursor-pointer"
        >
          Show All ({activeFilteredItems.length - displayLimit} remaining)
        </button>
      </div>
    {/if}

    <!-- Detail Modals -->
    <MALAnimeModal anime={selectedAnime} onClose={() => (selectedAnime = null)} />
    <MALMangaModal manga={selectedManga} onClose={() => (selectedManga = null)} />
  </div>
{/if}
