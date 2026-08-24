<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    class: customClass = '',
    tiltMaxAngle = 10,
    perspective = 1000,
    glare = true,
  }: {
    children: Snippet;
    class?: string;
    tiltMaxAngle?: number;
    perspective?: number;
    glare?: boolean;
  } = $props();

  let cardEl: HTMLElement | null = $state(null);
  let rotateX = $state(0);
  let rotateY = $state(0);
  let glareX = $state(50);
  let glareY = $state(50);
  let glareOpacity = $state(0);
  let isHovered = $state(false);

  function handleMouseMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    rotateX = -percentY * tiltMaxAngle;
    rotateY = percentX * tiltMaxAngle;

    glareX = (x / rect.width) * 100;
    glareY = (y / rect.height) * 100;
    glareOpacity = 0.35;
  }

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
    rotateX = 0;
    rotateY = 0;
    glareOpacity = 0;
  }
</script>

<div
  bind:this={cardEl}
  onmousemove={handleMouseMove}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  class={`relative transition-transform duration-200 ease-out will-change-transform ${customClass}`}
  style="
    perspective: {perspective}px;
    transform: {isHovered ? `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)` : `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`};
    transform-style: preserve-3d;
  "
>
  {@render children()}

  {#if glare}
    <!-- Dynamic 3D Specular Sheen -->
    <div
      class="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 -z-0"
      style="
        opacity: {glareOpacity};
        background: radial-gradient(circle at {glareX}% {glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 59, 105, 0.15) 35%, transparent 70%);
      "
    ></div>
  {/if}
</div>
