/**
 * Hero Ambient Celestial Starfield System
 * Particles spawn, breathe slowly like twinkling stars, and gently shift with mouse motion.
 */

export interface StarfieldConfig {
  /** Maximum number of stars (default: 65) */
  count?: number;
  /** Minimum star radius in px (default: 0.7) */
  minRadius?: number;
  /** Maximum star radius in px (default: 2.2) */
  maxRadius?: number;
  /** Star color in RGB (default: '255, 255, 255') */
  colorRgb?: string;
  /** Minimum breathing speed (default: 0.008) */
  minBreatheSpeed?: number;
  /** Maximum breathing speed (default: 0.022) */
  maxBreatheSpeed?: number;
  /** Glow blur radius in px (default: 10) */
  glowBlur?: number;
  /** Mouse parallax responsiveness (default: 28) */
  mouseParallaxFactor?: number;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  currentRadius: number;
  maxOpacity: number;
  opacity: number;
  breathePhase: number;
  breatheSpeed: number;
  life: number;
  maxLife: number;
  fadeSpeed: number;
  state: 'fadeIn' | 'breathing' | 'fadeOut';
  depth: number; // 0.2 (distant) to 1.0 (close) for 3D parallax deflection
  hasFlare: boolean; // 4-point subtle star twinkle flare
}

export function initHeroParticles(
  canvas: HTMLCanvasElement,
  userConfig: StarfieldConfig = {}
) {
  const config: Required<StarfieldConfig> = {
    count: userConfig.count ?? 65,
    minRadius: userConfig.minRadius ?? 0.7,
    maxRadius: userConfig.maxRadius ?? 2.2,
    colorRgb: userConfig.colorRgb ?? '255, 255, 255',
    minBreatheSpeed: userConfig.minBreatheSpeed ?? 0.008,
    maxBreatheSpeed: userConfig.maxBreatheSpeed ?? 0.022,
    glowBlur: userConfig.glowBlur ?? 10,
    mouseParallaxFactor: userConfig.mouseParallaxFactor ?? 28,
  };

  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy: () => {} };

  let stars: Star[] = [];
  let animId: number;
  let isDestroyed = false;

  // Mouse tracking for directional space deflection
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  const createStar = (width: number, height: number, initial = false): Star => {
    const depth = Math.random() * 0.8 + 0.2; // 0.2 - 1.0
    const maxLife = Math.floor(Math.random() * 400 + 350); // Lifespan in frames
    const radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;
    const maxOpacity = Math.random() * 0.55 + 0.4;
    const x = Math.random() * width;
    const y = Math.random() * height;

    return {
      x,
      y,
      baseX: x,
      baseY: y,
      radius,
      currentRadius: radius,
      maxOpacity,
      opacity: initial ? Math.random() * maxOpacity : 0,
      breathePhase: Math.random() * Math.PI * 2,
      breatheSpeed:
        Math.random() * (config.maxBreatheSpeed - config.minBreatheSpeed) +
        config.minBreatheSpeed,
      life: initial ? Math.floor(Math.random() * maxLife) : 0,
      maxLife,
      fadeSpeed: Math.random() * 0.015 + 0.008,
      state: initial ? 'breathing' : 'fadeIn',
      depth,
      hasFlare: radius > 1.7 && Math.random() > 0.6,
    };
  };

  const resize = () => {
    if (!canvas) return;
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);

    stars = [];
    const count = Math.min(config.count, Math.floor((width * height) / 20000));
    for (let i = 0; i < count; i++) {
      stars.push(createStar(width, height, true));
    }
  };

  resize();
  window.addEventListener('resize', resize);

  const onMouseMove = (e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    targetMouseX = (e.clientX / innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / innerHeight) * 2 - 1;
  };

  window.addEventListener('mousemove', onMouseMove);

  const render = () => {
    if (isDestroyed) return;
    animId = requestAnimationFrame(render);

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Smooth inertia lerp towards mouse direction
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.life++;
      s.breathePhase += s.breatheSpeed;

      // Lifecycle management (fadeIn -> breathing -> fadeOut -> respawn)
      if (s.state === 'fadeIn') {
        s.opacity += s.fadeSpeed;
        if (s.opacity >= s.maxOpacity) {
          s.opacity = s.maxOpacity;
          s.state = 'breathing';
        }
      } else if (s.state === 'breathing') {
        // Slow sinusoidal breathing / twinkling
        const breath = Math.sin(s.breathePhase);
        s.opacity = s.maxOpacity * (0.6 + 0.4 * breath);
        s.currentRadius = s.radius * (0.85 + 0.15 * breath);

        if (s.life >= s.maxLife) {
          s.state = 'fadeOut';
        }
      } else if (s.state === 'fadeOut') {
        s.opacity -= s.fadeSpeed;
        if (s.opacity <= 0.01) {
          stars[i] = createStar(w, h, false);
          continue;
        }
      }

      // Parallax shift based on depth and mouse direction
      const posX = s.baseX + currentMouseX * config.mouseParallaxFactor * s.depth;
      const posY = s.baseY + currentMouseY * config.mouseParallaxFactor * s.depth;

      // Draw Glowing Star
      const op = Math.max(0, Math.min(1, s.opacity));
      ctx.beginPath();
      ctx.arc(posX, posY, s.currentRadius, 0, Math.PI * 2);
      ctx.shadowBlur = config.glowBlur * s.depth;
      ctx.shadowColor = `rgba(${config.colorRgb}, ${op * 0.9})`;
      ctx.fillStyle = `rgba(${config.colorRgb}, ${op})`;
      ctx.fill();

      // Subtle 4-point celestial cross flare for brighter larger stars
      if (s.hasFlare && op > 0.45) {
        const flareSize = s.currentRadius * 2.8;
        ctx.beginPath();
        ctx.moveTo(posX - flareSize, posY);
        ctx.lineTo(posX + flareSize, posY);
        ctx.moveTo(posX, posY - flareSize);
        ctx.lineTo(posX, posY + flareSize);
        ctx.strokeStyle = `rgba(${config.colorRgb}, ${op * 0.35})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
    }
  };

  render();

  return {
    destroy: () => {
      isDestroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    },
  };
}
