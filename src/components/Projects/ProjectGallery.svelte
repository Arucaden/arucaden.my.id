<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface GalleryItem {
    src: string;
    alt?: string;
    caption?: string;
  }

  let { items = [] }: { items?: GalleryItem[] } = $props();

  let activeIndex = $state<number | null>(null);

  const activeItem = $derived(
    activeIndex !== null && items[activeIndex] ? items[activeIndex] : null
  );

  function portal(node: HTMLElement) {
    if (typeof document !== 'undefined') {
      document.body.appendChild(node);
    }
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      },
    };
  }

  function openLightbox(index: number) {
    activeIndex = index;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    if (typeof window !== 'undefined') {
      window.history.pushState({ lightboxOpen: true }, '');
    }
  }

  function closeLightbox(fromPopState = false) {
    if (activeIndex === null) return;
    activeIndex = null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    if (
      !fromPopState &&
      typeof window !== 'undefined' &&
      window.history.state?.lightboxOpen
    ) {
      window.history.back();
    }
  }

  function nextImage(e?: MouseEvent) {
    if (e) e.stopPropagation();
    if (activeIndex === null || items.length <= 1) return;
    activeIndex = (activeIndex + 1) % items.length;
  }

  function prevImage(e?: MouseEvent) {
    if (e) e.stopPropagation();
    if (activeIndex === null || items.length <= 1) return;
    activeIndex = (activeIndex - 1 + items.length) % items.length;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (activeIndex === null) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  }

  function handlePopState() {
    if (activeIndex !== null) {
      closeLightbox(true);
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('popstate', handlePopState);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  });
</script>

{#if items.length > 0}
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {#each items as item, index}
      <figure class="group m-0 flex flex-col">
        <button
          type="button"
          class="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 p-1 text-left cursor-pointer transition-all duration-300 hover:border-main hover:shadow-[0_0_20px_var(--color-accent-glow)] focus:outline-none focus:ring-2 focus:ring-main"
          onclick={() => openLightbox(index)}
          aria-label={`View full screenshot ${index + 1}: ${item.caption || item.alt || 'App snapshot'}`}
        >
          <img
            src={item.src}
            alt={item.alt || item.caption || `Snapshot ${index + 1}`}
            loading="lazy"
            decoding="async"
            class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none rounded-xl"
          >
            <span
              class="px-3 py-1.5 rounded-lg bg-black/80 border border-main/40 text-main text-xs font-mono font-medium flex items-center gap-1.5 shadow-lg transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200"
            >
              <span class="i-ri-zoom-in-line w-4 h-4"></span>
              <span>Zoom</span>
            </span>
          </div>
        </button>

        {#if item.caption}
          <figcaption class="mt-2 text-xs font-mono text-gray-text px-1 flex items-start gap-1.5">
            <span class="leading-relaxed">{item.caption}</span>
          </figcaption>
        {/if}
      </figure>
    {/each}
  </div>
{/if}

<!-- Full-screen Lightbox Modal teleported to document.body -->
{#if activeItem && activeIndex !== null}
  <div
    use:portal
    class="fixed inset-0 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
    style="position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 99999; margin: 0; padding: 1rem;"
    transition:fade={{ duration: 150 }}
    role="dialog"
    aria-modal="true"
    aria-label="App Snapshot Lightbox"
    tabindex="-1"
    onclick={() => closeLightbox()}
    onkeydown={(e) => {
      if (e.key === 'Escape') closeLightbox();
    }}
  >
    <!-- Lightbox Card -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center justify-center mx-auto my-auto"
      transition:scale={{ start: 0.96, duration: 200 }}
      role="document"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <!-- Top Action Bar with Back button -->
      <div class="w-full flex items-center justify-between py-2 px-1 mb-2 text-xs font-mono">
          <span class="bg-white/10 px-3 py-1 rounded-full border border-white/10 font-mono text-white text-xs">
            Snapshot {activeIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            class="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 hover:border-main hover:text-main"
            onclick={() => closeLightbox()}
            aria-label="Close lightbox"
          >
            <span>Close</span>
            <span class="i-ri-close-line w-4 h-4"></span>
          </button>
      </div>

      <!-- Main Image Container -->
      <div class="relative w-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/80 shadow-2xl p-2">
        <img
          src={activeItem.src}
          alt={activeItem.alt || activeItem.caption || `Snapshot ${activeIndex + 1}`}
          class="max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none"
        />

        <!-- Left Nav Arrow -->
        {#if items.length > 1}
          <button
            type="button"
            class="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 border border-white/20 text-white hover:border-main hover:text-main hover:bg-black/90 transition-all duration-150 shadow-lg cursor-pointer"
            onclick={prevImage}
            aria-label="Previous snapshot"
          >
            <span class="i-ri-arrow-left-s-line w-5 h-5 block"></span>
          </button>
        {/if}

        <!-- Right Nav Arrow -->
        {#if items.length > 1}
          <button
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/75 border border-white/20 text-white hover:border-main hover:text-main hover:bg-black/90 transition-all duration-150 shadow-lg cursor-pointer"
            onclick={nextImage}
            aria-label="Next snapshot"
          >
            <span class="i-ri-arrow-right-s-line w-5 h-5 block"></span>
          </button>
        {/if}
      </div>

      <!-- Caption Below Image -->
      {#if activeItem.caption || activeItem.alt}
        <div class="mt-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-center max-w-2xl w-full">
          <p class="text-xs sm:text-sm font-mono text-gray-text m-0">
            {activeItem.caption || activeItem.alt}
          </p>
        </div>
      {/if}
    </div>
  </div>
{/if}
