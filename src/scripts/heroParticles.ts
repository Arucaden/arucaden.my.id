/**
 * Hero Ambient Particles System
 * Customizable floating luminous particles that drift upwards in 3D parallax space.
 */

export interface ParticleConfig {
  /** Maximum number of particles (defaults to screen-density adaptive max 50) */
  maxCount?: number;
  /** Minimum particle radius in pixels (default: 0.8) */
  minRadius?: number;
  /** Maximum particle radius in pixels (default: 2.4) */
  maxRadius?: number;
  /** Minimum upward float speed (default: 0.35) */
  minSpeedY?: number;
  /** Maximum upward float speed (default: 0.85) */
  maxSpeedY?: number;
  /** Particle base opacity range [min, max] (default: [0.3, 0.75]) */
  opacityRange?: [number, number];
  /** Glow blur radius in px (default: 8) */
  glowBlur?: number;
  /** Particle color in rgba format (default: '255, 255, 255') */
  colorRgb?: string;
  /** Horizontal flutter sway wave strength (default: 0.45) */
  flutterStrength?: number;
}

interface Particle {
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
}

export function initHeroParticles(
  canvas: HTMLCanvasElement,
  userConfig: ParticleConfig = {}
) {
  const config: Required<ParticleConfig> = {
    maxCount: userConfig.maxCount ?? 50,
    minRadius: userConfig.minRadius ?? 0.8,
    maxRadius: userConfig.maxRadius ?? 2.4,
    minSpeedY: userConfig.minSpeedY ?? 0.35,
    maxSpeedY: userConfig.maxSpeedY ?? 0.85,
    opacityRange: userConfig.opacityRange ?? [0.3, 0.75],
    glowBlur: userConfig.glowBlur ?? 8,
    colorRgb: userConfig.colorRgb ?? '255, 255, 255',
    flutterStrength: userConfig.flutterStrength ?? 0.45,
  };

  const ctx = canvas.getContext('2d');
  if (!ctx) return { destroy: () => {} };

  let particles: Particle[] = [];
  let animId: number;
  let isDestroyed = false;

  const createParticle = (width: number, height: number, randomizeY = true): Particle => {
    const [minOp, maxOp] = config.opacityRange;
    return {
      x: Math.random() * width,
      y: randomizeY ? Math.random() * height : height + 10,
      radius: Math.random() * (config.maxRadius - config.minRadius) + config.minRadius,
      speedY: Math.random() * (config.maxSpeedY - config.minSpeedY) + config.minSpeedY,
      baseOpacity: Math.random() * (maxOp - minOp) + minOp,
      opacity: minOp,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
      flutterPhase: Math.random() * Math.PI * 2,
      flutterSpeed: Math.random() * 0.02 + 0.01,
    };
  };

  const resize = () => {
    if (!canvas) return;
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);

    particles = [];
    const count = Math.min(config.maxCount, Math.floor((width * height) / 24000));
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(width, height, true));
    }
  };

  resize();
  window.addEventListener('resize', resize);

  const render = () => {
    if (isDestroyed) return;
    animId = requestAnimationFrame(render);

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.speedY;
      p.flutterPhase += p.flutterSpeed;
      p.pulsePhase += p.pulseSpeed;

      p.x += Math.sin(p.flutterPhase) * config.flutterStrength;
      p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.25;

      // Wrap around boundary
      if (p.y < -15) {
        particles[i] = createParticle(w, h, false);
      }
      if (p.x < -15) p.x = w + 15;
      if (p.x > w + 15) p.x = -15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.shadowBlur = config.glowBlur;
      ctx.shadowColor = `rgba(${config.colorRgb}, 0.9)`;
      ctx.fillStyle = `rgba(${config.colorRgb}, ${Math.max(0.08, Math.min(1, p.opacity))})`;
      ctx.fill();
    }
  };

  render();

  return {
    destroy: () => {
      isDestroyed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    },
  };
}
