<script lang="ts">
  import { onMount } from 'svelte';
  import '@/styles/glitch.css';

  let { name = 'DAFFA MAULANA SATRIA' }: { name?: string } = $props();

  const japaneseName = 'ダファ・マウラナ・サトリア';
  const roles = [
    'UI/UX Designer & Creative Technologist',
    'Game Developer & Systems Programmer',
    '2D Illustrator & Visual Artist',
    'Frontend & Interactive UI Engineer',
  ];

  let currentName = $state(name);
  let isJapanese = $state(false);
  let isNameGlitching = $state(false);

  let currentRoleIndex = $state(0);
  let isRoleGlitching = $state(false);

  let heroContainer: HTMLElement | null = $state(null);
  let particleCanvas: HTMLCanvasElement | null = $state(null);

  // Mouse / gyro normalized coordinates (-1 to 1)
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  // Layer offsets
  let bgX = $state(0);
  let bgY = $state(0);
  let moonX = $state(0);
  let moonY = $state(0);
  let midX = $state(0);
  let midY = $state(0);
  let particleX = $state(0);
  let particleY = $state(0);
  let frontX = $state(0);
  let frontY = $state(0);

  function triggerNameGlitch() {
    if (isNameGlitching) return;
    isNameGlitching = true;

    setTimeout(() => {
      isJapanese = !isJapanese;
      currentName = isJapanese ? japaneseName : name;
    }, 450);

    setTimeout(() => {
      isNameGlitching = false;
    }, 900);
  }

  function rotateRole() {
    if (isRoleGlitching) return;
    isRoleGlitching = true;

    setTimeout(() => {
      currentRoleIndex = (currentRoleIndex + 1) % roles.length;
    }, 400);

    setTimeout(() => {
      isRoleGlitching = false;
    }, 850);
  }

  onMount(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Glitch intervals
    let nameInterval: any;
    let roleInterval: any;

    if (!prefersReducedMotion) {
      nameInterval = setInterval(() => {
        triggerNameGlitch();
      }, 5000);

      roleInterval = setInterval(() => {
        rotateRole();
      }, 3500);
    }

    // Canvas particle system setup
    let ctx: CanvasRenderingContext2D | null = null;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      baseOpacity: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;
      flutterPhase: number;
      flutterSpeed: number;
    }> = [];

    const initParticles = () => {
      if (!particleCanvas) return;
      ctx = particleCanvas.getContext('2d');
      const width = (particleCanvas.width = particleCanvas.clientWidth);
      const height = (particleCanvas.height = particleCanvas.clientHeight);

      particles = [];
      const count = Math.min(50, Math.floor((width * height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.8,
          speedY: Math.random() * 0.6 + 0.3,
          baseOpacity: Math.random() * 0.5 + 0.35,
          opacity: 0.5,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2,
          flutterPhase: Math.random() * Math.PI * 2,
          flutterSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    };

    initParticles();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth) * 2 - 1;
      targetY = (e.clientY / innerHeight) * 2 - 1;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        targetX = Math.max(-1, Math.min(1, e.gamma / 25));
        targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth lerping
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Background has highest responsiveness
      bgX = currentX * 28;
      bgY = currentY * 18;

      // Moon moves at medium responsive pace
      moonX = currentX * 16;
      moonY = currentY * 11;

      // Middle character is more anchored
      midX = currentX * 8;
      midY = currentY * 5;

      // Particles have gentle mid-depth float
      particleX = currentX * 12;
      particleY = currentY * 8;

      // Foreground flowers have subtle counter-parallax
      frontX = -currentX * 6;
      frontY = -currentY * 4;

      // Render floating particles
      if (ctx && particleCanvas) {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        const w = particleCanvas.width;
        const h = particleCanvas.height;

        for (const p of particles) {
          p.y -= p.speedY;
          p.flutterPhase += p.flutterSpeed;
          p.pulsePhase += p.pulseSpeed;

          p.x += Math.sin(p.flutterPhase) * 0.4;
          p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.25;

          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, p.opacity))})`;
          ctx.fill();
        }
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(nameInterval);
      clearInterval(roleInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  });
</script>

<div
  bind:this={heroContainer}
  class="relative w-full min-h-screen flex items-center justify-center overflow-hidden select-none"
>
  <!-- =========================================================================
       PARALLAX ARTWORK STAGE (Background to Foreground)
       ========================================================================= -->
  <div class="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
    <!-- LAYER 1: Background (Deepest, most responsive, 124% bleed) -->
    <div
      class="absolute inset-[-12%] w-[124%] h-[124%] z-0 will-change-transform"
      style="transform: translate3d({bgX}px, {bgY}px, 0px) scale(1.08);"
    >
      <img
        src="/HeroArt/Background.webp"
        alt="Background landscape"
        class="w-full h-full object-cover object-center"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <!-- LAYER 2: Moon (116% bleed) -->
    <div
      class="absolute inset-[-8%] w-[116%] h-[116%] z-[1] will-change-transform"
      style="transform: translate3d({moonX}px, {moonY}px, 0px) scale(1.06);"
    >
      <img
        src="/HeroArt/Moon.webp"
        alt="Moon"
        class="w-full h-full object-cover object-center"
        decoding="async"
      />
    </div>

    <!-- LAYER 3: Middlelayer (Character Artwork, 110% bleed) -->
    <div
      class="absolute inset-[-5%] w-[110%] h-[110%] z-[2] will-change-transform"
      style="transform: translate3d({midX}px, {midY}px, 0px) scale(1.04);"
    >
      <img
        src="/HeroArt/Middlelayer.webp"
        alt="Character artwork"
        class="w-full h-full object-cover object-bottom"
        decoding="async"
      />
    </div>

    <!-- LAYER 4: Ambient Floating White Particles (In front of character, behind flowers) -->
    <div
      class="absolute inset-0 w-full h-full z-[3] will-change-transform pointer-events-none"
      style="transform: translate3d({particleX}px, {particleY}px, 0px);"
    >
      <canvas bind:this={particleCanvas} class="w-full h-full block"></canvas>
    </div>

    <!-- LAYER 5: FrontLayer (Foreground Flowers - in front of character, particles & moon) -->
    <div
      class="absolute inset-[-6%] w-[112%] h-[112%] z-[4] will-change-transform"
      style="transform: translate3d({frontX}px, {frontY}px, 0px) scale(1.05);"
    >
      <img
        src="/HeroArt/FrontLayer.webp"
        alt="Foreground flowers"
        class="w-full h-full object-cover object-bottom"
        decoding="async"
      />
    </div>

    <!-- Bottom smooth gradient blend into page obsidian background -->
    <div
      class="absolute inset-x-0 bottom-0 h-36 z-[5]"
      style="background: linear-gradient(to bottom, rgba(8,6,11,0) 0%, rgba(8,6,11,0.6) 50%, #08060B 100%);"
    ></div>
  </div>

  <!-- =========================================================================
       STATIC EDITORIAL CONTENT WITH GLITCH & JAPANESE TRANSLATION
       ========================================================================= -->
  <div
    class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6"
  >
    <!-- Main Editorial Headline with Cyber Glitch & Japanese Toggle -->
    <div class="space-y-3 w-full flex flex-col items-center">
      <!-- Name Container with Glitch Effect -->
      <div
        id="name-container"
        class={`relative cursor-pointer transition-all max-w-full overflow-visible flex justify-center ${isNameGlitching ? 'glitching' : ''}`}
        onclick={triggerNameGlitch}
        onmouseenter={triggerNameGlitch}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === 'Enter' && triggerNameGlitch()}
        title="Click or hover to glitch / switch language"
      >
        <h1
          id="name-text"
          class={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight uppercase select-none transition-colors whitespace-nowrap inline-block ${
            isJapanese ? 'text-japanese tracking-normal md:tracking-wide text-xl sm:text-3xl md:text-5xl lg:text-6xl' : 'text-white'
          }`}
          data-text={currentName}
          style="text-shadow: 0 4px 20px rgba(0, 0, 0, 0.95), 0 0 32px rgba(255, 59, 105, 0.4);"
        >
          {currentName}
        </h1>
      </div>

      <!-- Rotating Role Container with Cyber Glitch -->
      <div class="h-8 sm:h-10 overflow-hidden flex items-center justify-center max-w-full">
        <div
          id="title-container"
          class={`relative transition-all ${isRoleGlitching ? 'glitching' : ''}`}
        >
          <span
            id="title-text"
            class="text-sm sm:text-lg md:text-xl lg:text-2xl font-mono text-main font-bold tracking-wide whitespace-nowrap block"
            data-text={roles[currentRoleIndex]}
            style="text-shadow: 0 2px 14px rgba(0, 0, 0, 0.95), 0 0 20px rgba(255, 59, 105, 0.35);"
          >
            {roles[currentRoleIndex]}
          </span>
        </div>
      </div>
    </div>

    <!-- Subtitle Statement -->
    <div class="max-w-2xl px-2 py-1">
      <p
        class="text-xs sm:text-sm md:text-base text-white/90 font-medium leading-relaxed"
        style="text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.8);"
      >
        Designing tactile digital interfaces, procedural game architectures, and interactive WebGL experiences with systematic craftsmanship.
      </p>
    </div>
  </div>

  <!-- Scroll Down Trigger Indicator -->
  <div class="absolute bottom-6 md:bottom-8 z-10 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
    <a href="#projects" class="flex flex-col items-center gap-1 text-white/80 hover:text-white" aria-label="Scroll to projects">
      <span class="text-[10px] font-mono tracking-widest uppercase" style="text-shadow: 0 1px 4px rgba(0,0,0,0.9);">Scroll</span>
      <div class="i-ri-arrow-down-s-line w-5 h-5 text-main animate-bounce"></div>
    </a>
  </div>
</div>
