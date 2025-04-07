<script lang="ts">
    export let name: string;
    export let highlight: boolean = false;
    export let customClass: string = "";
  
    const iconMap: Record<string, string> = {
      JavaScript: '/icons/javascript.svg',
      Python: '/icons/python.svg',
      Unity: '/icons/unity.svg',
      'C#': '/icons/csharp.svg',
      Photoshop: '/icons/photoshop.svg',
      Astro: '/favicon.svg',
    };
  
    const icon = iconMap[name] || '/icons/default.svg'; // fallback icon
  </script>
  
  <div
    class={`inline-flex items-center gap-2 border-2 rounded-xl px-4 py-2 text-sm
      ${highlight ? 'bg-main text-black-text border border-main' : 'bg-white/5 text-white border-secondary'} ${customClass}
    `}
  >
    <img src={icon} alt={name} class="w-6 h-6" />
    <span class="text-sm font-semibold">{name}</span>
  </div>
  