<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let container: HTMLDivElement | null = $state(null);
  let isHovered = $state(false);
  let isDragging = $state(false);

  onMount(() => {
    if (!container) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    // WebGL Renderer with antialiasing & transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Root Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Icosahedron Wireframe
    const icoGeometry = new THREE.IcosahedronGeometry(1.7, 1);
    const wireframeGeometry = new THREE.WireframeGeometry(icoGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff3b69,
      transparent: true,
      opacity: 0.65,
      linewidth: 1.5,
    });
    const wireframe = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    coreGroup.add(wireframe);

    // 2. Vertex Node Spheres
    const nodeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    const positionAttribute = icoGeometry.attributes.position;
    const vertexPositions: THREE.Vector3[] = [];
    for (let i = 0; i < positionAttribute.count; i++) {
      const v = new THREE.Vector3(
        positionAttribute.getX(i),
        positionAttribute.getY(i),
        positionAttribute.getZ(i)
      );
      if (!vertexPositions.some((existing) => existing.distanceTo(v) < 0.01)) {
        vertexPositions.push(v);
        const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
        nodeMesh.position.copy(v);
        coreGroup.add(nodeMesh);
      }
    }

    // 3. Inner Pulsing Crystal Core (Octahedron)
    const innerGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0xa8324e,
      emissive: 0xff3b69,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerCore);

    // 4. Orbital Gimbal Rings
    const ring1Geometry = new THREE.TorusGeometry(2.3, 0.015, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0xff5c83,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geometry = new THREE.TorusGeometry(2.6, 0.012, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x934355,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // 5. Constellation Particles Field
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.8 + Math.random() * 2.2;

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff3b69,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff3b69, 3, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7928ca, 2, 10);
    pointLight2.position.set(-3, -2, -2);
    scene.add(pointLight2);

    // Interaction & Animation Loop State
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let pulseScale = 1;
    let targetPulseScale = 1;
    let isVisible = true;
    let animationFrameId: number;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
      } else {
        mouseX = x;
        mouseY = y;
        targetRotationY = mouseX * 0.7;
        targetRotationX = -mouseY * 0.7;
      }

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      targetPulseScale = 1.08;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      targetPulseScale = isHovered ? 1.04 : 1.0;
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    if (container) {
      container.addEventListener('mousedown', onPointerDown);
      container.addEventListener('touchstart', onPointerDown, { passive: true });
      container.addEventListener('touchmove', onPointerMove, { passive: true });
    }

    // Auto-pause when not visible in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Dynamic resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth Lerp Rotations
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;

      const autoRot = prefersReducedMotion ? 0 : elapsedTime * 0.35;

      coreGroup.rotation.x =
        currentRotationX +
        (prefersReducedMotion ? 0 : Math.sin(elapsedTime * 0.5) * 0.15);
      coreGroup.rotation.y = currentRotationY + autoRot;

      // Inner core pulse
      pulseScale += (targetPulseScale - pulseScale) * 0.1;
      const innerBreath = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      innerCore.scale.setScalar(pulseScale * innerBreath);
      innerCore.rotation.y = -autoRot * 1.5;
      innerCore.rotation.z = Math.sin(elapsedTime) * 0.2;

      // Ring rotations
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.15;

      // Particle float
      particles.rotation.y = elapsedTime * 0.08;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // Memory cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      icoGeometry.dispose();
      wireframeGeometry.dispose();
      lineMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  });
</script>

<div
  class="relative w-full h-[320px] sm:h-[400px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  role="region"
  aria-label="Interactive 3D Holographic Cyber Core"
>
  <!-- 3D WebGL Canvas Container -->
  <div bind:this={container} class="w-full h-full"></div>

  <!-- Ambient Glow Behind 3D Core -->
  <div
    class="absolute w-56 h-56 md:w-80 md:h-80 rounded-full bg-accent/20 blur-[90px] pointer-events-none -z-10 transition-opacity duration-500"
    style="opacity: {isHovered ? 0.9 : 0.6};"
  ></div>

  <!-- Interactive Hint Pill -->
  <div
    class="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center gap-2 pointer-events-none transition-all duration-300"
    style="opacity: {isHovered ? 1 : 0.75}; transform: translate(-50%, {isHovered ? '-2px' : '0'});"
  >
    <div class="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></div>
    <span class="text-[10px] md:text-xs font-mono text-gray-text tracking-wide uppercase">
      {isDragging ? 'Dragging Core' : 'Interactive 3D WebGL // Drag to rotate'}
    </span>
  </div>
</div>
