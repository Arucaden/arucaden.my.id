<script lang="ts">
  export let name: string;
  export let highlight: boolean = false;
  export let customClass: string = "";

  const iconMap: Record<string, string> = {
    JavaScript: 'i-grommet-icons-js',
    Python: 'i-grommet-icons-python',
    Unity: 'i-grommet-icons-gamepad',
    'C#': 'i-grommet-icons-code',
    Photoshop: 'i-grommet-icons-brush',
    Astro: 'i-grommet-icons-catalog',
    Tailwind: 'i-grommet-icons-css3',
    Svelte: 'i-grommet-icons-svelte',
    Blender: 'i-grommet-icons-blender',
    Figma: 'i-grommet-icons-figma',
    MySQL: 'i-grommet-icons-database',
    Flutter: 'i-grommet-icons-flutter',
    Java: 'i-grommet-icons-java',
    'Clip Studio': 'i-grommet-icons-clipstudio',
  };

  const isIconAvailable = name in iconMap;
  const iconClass = iconMap[name] || '';
</script>

<div
  class={`inline-flex items-center gap-2 border-2 rounded-xl px-4 py-2 text-sm
    transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-[0_0_12px_rgba(255,77,109,0.5)]
    ${highlight 
      ? 'bg-main text-black-text border border-main hover:bg-secondary' 
      : 'bg-white/5 text-white border-secondary hover:border-main hover:bg-black/50'} ${customClass}
  `}
>
  {#if isIconAvailable}
    <div class={`${iconClass} w-5 h-5 transition-transform duration-200`}></div>
  {/if}
  <span class="text-sm font-semibold">{name}</span>
</div>
