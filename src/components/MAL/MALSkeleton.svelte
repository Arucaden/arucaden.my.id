<script lang="ts">
  // Number of skeleton cards to render
  let { count = 12 }: { count?: number } = $props();
  const skeletonArray = Array.from({ length: count });
</script>

<div class="w-full space-y-6 animate-pulse">
  <!-- Top Stats Hero Skeleton -->
  <div class="glass-panel p-6 sm:p-8 md:p-10 mb-8 border border-white/10 relative overflow-hidden">
    <!-- Header Top Row -->
    <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
      <div class="space-y-2">
        <div class="h-9 sm:h-11 w-44 bg-white/15 rounded-2xl"></div>
        <div class="h-4 w-72 sm:w-96 bg-white/5 rounded-lg"></div>
      </div>

      <div class="flex items-center gap-3">
        <div class="h-9 w-28 bg-white/5 rounded-xl border border-white/10"></div>
        <div class="h-9 w-40 bg-white/5 rounded-xl border border-white/10"></div>
      </div>
    </div>

    <!-- 6 Key Statistics Grid Skeleton -->
    <div class="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-6">
      {#each [1, 2, 3, 4, 5, 6] as _}
        <div class="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border-2 border-white/10 flex flex-col justify-between h-24">
          <div class="h-3 w-20 bg-white/10 rounded"></div>
          <div class="h-7 w-16 bg-white/15 rounded-lg mt-2"></div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Filter & Controls Toolbar Skeleton -->
  <div class="glass-panel p-4 sm:p-5 border border-white/10 space-y-4">
    <!-- Status Pills Skeleton -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
      {#each [1, 2, 3, 4, 5, 6] as _}
        <div class="h-8 w-24 bg-white/5 rounded-xl border border-white/10 shrink-0"></div>
      {/each}
    </div>

    <!-- Search & Dropdowns Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
      <div class="lg:col-span-5 h-9 bg-white/5 rounded-xl border border-white/10"></div>
      <div class="lg:col-span-3 h-9 bg-white/5 rounded-xl border border-white/10"></div>
      <div class="lg:col-span-3 h-9 bg-white/5 rounded-xl border border-white/10"></div>
      <div class="lg:col-span-1 h-9 bg-white/5 rounded-xl border border-white/10"></div>
    </div>

    <!-- Result summary line -->
    <div class="h-4 w-36 bg-white/5 rounded"></div>
  </div>

  <!-- Anime Cards Grid Skeleton -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
    {#each skeletonArray as _, idx}
      <div class="flex flex-col rounded-2xl overflow-hidden bg-[rgba(18,14,24,0.7)] border border-white/10">
        <!-- Poster Placeholder -->
        <div class="relative w-full aspect-[2/3] bg-white/[0.04] overflow-hidden flex items-center justify-center">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <span class="i-ri-image-line w-8 h-8 text-white/10"></span>
          
          <!-- Top badge placeholder -->
          <div class="absolute top-2.5 left-2.5 h-4 w-14 rounded-lg bg-white/10"></div>
          <!-- Score placeholder -->
          <div class="absolute top-2.5 right-2.5 h-4 w-7 rounded-lg bg-white/10"></div>
          <!-- Progress bar placeholder -->
          <div class="absolute bottom-0 inset-x-0 h-1 bg-white/10"></div>
        </div>

        <!-- Info Area -->
        <div class="p-3.5 flex flex-col gap-2.5">
          <div class="space-y-1.5">
            <div class="h-4 w-full bg-white/10 rounded"></div>
            <div class="h-4 w-3/4 bg-white/10 rounded"></div>
          </div>
          <div class="pt-2 border-t border-white/10 flex items-center justify-between">
            <div class="h-3.5 w-14 bg-white/5 rounded"></div>
            <div class="h-3.5 w-12 bg-white/5 rounded"></div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
