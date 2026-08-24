<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  // State for Widget 1: 3D Spatial Geometry Controller
  let canvas3dEl: HTMLDivElement | null = $state(null);
  let geometryType = $state<'torus' | 'icosahedron' | 'cybercube' | 'dodecahedron'>('torus');
  let rotationSpeed = $state(1.0);
  let activeColorHex = $state('#FF3B69');

  const colorPalettes = [
    { name: 'Electric Crimson', hex: '#FF3B69', int: 0xff3b69 },
    { name: 'Cyber Cyan', hex: '#00F0FF', int: 0x00f0ff },
    { name: 'Neon Emerald', hex: '#00FF9D', int: 0x00ff9d },
    { name: 'Ultra Violet', hex: '#A855F7', int: 0xa855f7 },
  ];

  // State for Widget 2: Tactile Spring Switch
  let isSpringActive = $state(true);
  let switchClickCount = $state(0);

  // State for Widget 3: Live Design Token Inspector
  let selectedToken = $state({
    name: 'accent-primary',
    value: '#FF3B69',
    usage: 'High-intent CTA buttons, focus rings, key metric highlights',
    wcagScore: '4.8:1 (AA Normal Text)',
  });

  // Three.js internal references for Widget 1
  let update3DScene: (geom: string, color: number, speed: number) => void;

  onMount(() => {
    if (!canvas3dEl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas3dEl.clientWidth / canvas3dEl.clientHeight, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(canvas3dEl.clientWidth, canvas3dEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvas3dEl.appendChild(renderer.domElement);

    let meshGroup = new THREE.Group();
    scene.add(meshGroup);

    let currentMesh: THREE.LineSegments | null = null;
    let material = new THREE.LineBasicMaterial({
      color: 0xff3b69,
      transparent: true,
      opacity: 0.8,
      linewidth: 1.5,
    });

    const createGeometry = (type: string) => {
      if (currentMesh) {
        meshGroup.remove(currentMesh);
        currentMesh.geometry.dispose();
      }

      let geom: THREE.BufferGeometry;
      switch (type) {
        case 'icosahedron':
          geom = new THREE.IcosahedronGeometry(1.4, 1);
          break;
        case 'cybercube':
          geom = new THREE.BoxGeometry(1.6, 1.6, 1.6, 2, 2, 2);
          break;
        case 'dodecahedron':
          geom = new THREE.DodecahedronGeometry(1.4, 0);
          break;
        case 'torus':
        default:
          geom = new THREE.TorusKnotGeometry(1.0, 0.3, 64, 12);
          break;
      }

      const wireframe = new THREE.WireframeGeometry(geom);
      currentMesh = new THREE.LineSegments(wireframe, material);
      meshGroup.add(currentMesh);
    };

    createGeometry(geometryType);

    update3DScene = (geom: string, color: number, speed: number) => {
      material.color.setHex(color);
      createGeometry(geom);
    };

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (meshGroup) {
        meshGroup.rotation.x += delta * 0.4 * rotationSpeed;
        meshGroup.rotation.y += delta * 0.7 * rotationSpeed;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!canvas3dEl) return;
      camera.aspect = canvas3dEl.clientWidth / canvas3dEl.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas3dEl.clientWidth, canvas3dEl.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (canvas3dEl && renderer.domElement) {
        canvas3dEl.removeChild(renderer.domElement);
      }
      material.dispose();
      renderer.dispose();
    };
  });

  function changeGeometry(type: 'torus' | 'icosahedron' | 'cybercube' | 'dodecahedron') {
    geometryType = type;
    const selected = colorPalettes.find((c) => c.hex === activeColorHex);
    update3DScene?.(type, selected?.int ?? 0xff3b69, rotationSpeed);
  }

  function changeColor(palette: { name: string; hex: string; int: number }) {
    activeColorHex = palette.hex;
    update3DScene?.(geometryType, palette.int, rotationSpeed);
  }

  function toggleSpringSwitch() {
    isSpringActive = !isSpringActive;
    switchClickCount++;
  }
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Widget 1: 3D Spatial Geometry Lab -->
  <div class="glass-panel p-5 flex flex-col justify-between interactive-card">
    <div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span class="text-xs font-mono font-bold tracking-wider text-white uppercase">
            3D Spatial Shader Lab
          </span>
        </div>
        <span class="badge">Three.js WebGL</span>
      </div>

      <p class="text-xs text-gray-text leading-relaxed mb-4">
        Real-time parametric geometry synthesis with live shader wireframe tuning.
      </p>

      <!-- 3D Viewport -->
      <div class="relative w-full h-44 rounded-xl bg-black/60 border border-white/10 overflow-hidden mb-4 flex items-center justify-center">
        <div bind:this={canvas3dEl} class="w-full h-full"></div>
        <div class="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-gray-text">
          {geometryType.toUpperCase()}
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="space-y-3 pt-2 border-t border-white/10">
      <!-- Shape Selector -->
      <div>
        <label class="text-[11px] font-mono text-gray-text block mb-1.5">Geometry Primitive</label>
        <div class="grid grid-cols-4 gap-1.5">
          {#each ['torus', 'icosahedron', 'cybercube', 'dodecahedron'] as shape}
            <button
              type="button"
              onclick={() => changeGeometry(shape as any)}
              class={`text-[10px] font-mono py-1 px-1.5 rounded-lg border transition-all ${
                geometryType === shape
                  ? 'bg-accent/20 border-accent text-white font-bold'
                  : 'bg-white/5 border-white/10 text-gray-text hover:border-white/20'
              }`}
            >
              {shape.slice(0, 5)}
            </button>
          {/each}
        </div>
      </div>

      <!-- Color Palette Selector -->
      <div>
        <label class="text-[11px] font-mono text-gray-text block mb-1.5">Neon Specular Tone</label>
        <div class="flex gap-2">
          {#each colorPalettes as pal}
            <button
              type="button"
              onclick={() => changeColor(pal)}
              class="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
              style="background-color: {pal.hex}; border-color: {activeColorHex === pal.hex ? '#ffffff' : 'transparent'};"
              title={pal.name}
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Widget 2: Tactile Spring & Micro-Interactions -->
  <div class="glass-panel p-5 flex flex-col justify-between interactive-card">
    <div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span class="text-xs font-mono font-bold tracking-wider text-white uppercase">
            Tactile Micro-Interactions
          </span>
        </div>
        <span class="badge">Spring Physics</span>
      </div>

      <p class="text-xs text-gray-text leading-relaxed mb-4">
        Testing user haptic feedback, spring kinematics, and dynamic visual states.
      </p>

      <!-- Interactive Switch Stage -->
      <div class="w-full h-44 rounded-xl bg-black/60 border border-white/10 p-4 flex flex-col items-center justify-center gap-4 mb-4">
        <!-- The Tactile Spring Switch -->
        <button
          type="button"
          onclick={toggleSpringSwitch}
          class="relative w-20 h-10 rounded-full p-1 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
          style="
            background: {isSpringActive ? 'linear-gradient(135deg, #FF3B69 0%, #934355 100%)' : '#1e1926'};
            box-shadow: {isSpringActive ? '0 0 20px rgba(255, 59, 105, 0.45)' : 'inset 0 2px 4px rgba(0,0,0,0.6)'};
          "
          aria-label="Toggle Spring Switch"
        >
          <div
            class="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300"
            style="
              transform: translateX({isSpringActive ? '40px' : '0px'}) scale({isSpringActive ? 1.05 : 0.95});
            "
          >
            {#if isSpringActive}
              <div class="i-ri-flashlight-fill w-4 h-4 text-accent"></div>
            {:else}
              <div class="i-ri-moon-fill w-4 h-4 text-gray-600"></div>
            {/if}
          </div>
        </button>

        <div class="text-center">
          <span class="text-xs font-mono font-semibold {isSpringActive ? 'text-accent' : 'text-gray-text'}">
            {isSpringActive ? 'STATUS: OVERCLOCK ACTIVE' : 'STATUS: STANDBY IDLE'}
          </span>
          <p class="text-[10px] text-text-muted mt-0.5">Clicks: {switchClickCount} cycles logged</p>
        </div>
      </div>
    </div>

    <!-- Feedback Metrics -->
    <div class="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
      <div class="bg-white/5 p-2.5 rounded-xl border border-white/5">
        <span class="text-[10px] font-mono text-text-muted block">SPRING TENSION</span>
        <span class="text-xs font-mono font-bold text-white">180 N/m (Snappy)</span>
      </div>
      <div class="bg-white/5 p-2.5 rounded-xl border border-white/5">
        <span class="text-[10px] font-mono text-text-muted block">HAPTIC RESPONSE</span>
        <span class="text-xs font-mono font-bold text-emerald-400">12ms Latency</span>
      </div>
    </div>
  </div>

  <!-- Widget 3: Live Design Token Matrix -->
  <div class="glass-panel p-5 flex flex-col justify-between interactive-card">
    <div>
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-purple-400"></div>
          <span class="text-xs font-mono font-bold tracking-wider text-white uppercase">
            Design Token Inspector
          </span>
        </div>
        <span class="badge">Design Systems</span>
      </div>

      <p class="text-xs text-gray-text leading-relaxed mb-4">
        Systematic UI architecture tokens ensuring WCAG accessibility & consistency.
      </p>

      <!-- Token Explorer Card -->
      <div class="w-full h-44 rounded-xl bg-black/60 border border-white/10 p-3.5 flex flex-col justify-between mb-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-mono font-bold text-white">{selectedToken.name}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-accent/20 text-accent border border-accent/30">
              {selectedToken.value}
            </span>
          </div>
          <p class="text-xs text-gray-text leading-relaxed">
            {selectedToken.usage}
          </p>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono">
          <span class="text-text-muted">WCAG Ratio:</span>
          <span class="text-emerald-400 font-semibold">{selectedToken.wcagScore}</span>
        </div>
      </div>
    </div>

    <!-- Quick Token Picker -->
    <div class="space-y-1.5 pt-2 border-t border-white/10">
      <div class="flex gap-1">
        <button
          type="button"
          onclick={() =>
            (selectedToken = {
              name: 'accent-primary',
              value: '#FF3B69',
              usage: 'High-intent CTA buttons, focus rings, key metric highlights',
              wcagScore: '4.8:1 (AA Normal Text)',
            })}
          class="flex-1 text-[10px] font-mono py-1 rounded bg-white/5 hover:bg-white/10 text-white-text border border-white/10"
        >
          Accent
        </button>
        <button
          type="button"
          onclick={() =>
            (selectedToken = {
              name: 'surface-glass',
              value: 'rgba(18, 14, 24, 0.75)',
              usage: 'Translucent cards with blur-24px backdrop filtering',
              wcagScore: '14.2:1 (AAA High Contrast)',
            })}
          class="flex-1 text-[10px] font-mono py-1 rounded bg-white/5 hover:bg-white/10 text-white-text border border-white/10"
        >
          Surface
        </button>
        <button
          type="button"
          onclick={() =>
            (selectedToken = {
              name: 'typography-display',
              value: 'Figtree 800 (Tight Tracking)',
              usage: 'High-impact editorial titles with -0.03em letter-spacing',
              wcagScore: 'Readable at all scales',
            })}
          class="flex-1 text-[10px] font-mono py-1 rounded bg-white/5 hover:bg-white/10 text-white-text border border-white/10"
        >
          Type
        </button>
      </div>
    </div>
  </div>
</div>
