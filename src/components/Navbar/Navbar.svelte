<script lang="ts">
  import { onMount } from 'svelte';
  import NavIsland from './NavIsland.svelte';

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'PROFILE', href: '/#profile' },
    { name: 'Artworks', href: '/#artworks' },
    { name: 'Projects', href: '/#projects' },
  ];
  
  let currentSection = '';
  let currentPath = window.location.pathname;
  
  function isActive(href: string) {
    if (href === '/') {
      return currentPath === '/' && currentSection === '';
    }
    if (href.includes('#')) {
      return href.endsWith(currentSection);
    }
    return href === currentPath;
  }
  
  onMount(() => {
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveSection = () => {
      let foundSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.getBoundingClientRect().height;
        
        // Check if the section is in the viewport
        if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
          foundSection = '#' + section.id;
        }
      });
      
      currentSection = foundSection;
    };
    
    updateActiveSection(); // Initial check
    window.addEventListener('scroll', updateActiveSection);
    
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  });
</script>

<nav class="md:sticky md:top-0 flex justify-between items-center mb-0 md:mb-8 bg-black/70 z-50">
  <div class="absolute bottom-0 h-2px w-full bg-tertiary"></div>
  
  <!-- Mobile view navigation - bottom floating -->
  <div class="fixed md:hidden inset-x-0 bottom-0 z-50">
    <div class="flex justify-evenly py-3 bg-black/90 border-t border-secondary shadow-[0_0_10px_2px_rgba(255,0,102,0.3)]">
      {#each navLinks as link}
        <a
          href={link.href}
          class={`px-3 py-1 text-sm transition-all duration-200 ${
            isActive(link.href)
              ? 'text-secondary-second'
              : 'text-main hover:text-main'
          }`}
        >
          {link.name}
        </a>
      {/each}
    </div>
  </div>

  <!-- Desktop view navigation - top bar -->
  <div class="hidden md:flex text-md text-main w-full">
    {#each navLinks as link}
      <a
        href={link.href}
        class={`px-8 py-2 transition-all duration-200 ${
          isActive(link.href)
            ? 'bg-pink-900/30 text-white border-b-4 border-main font-bold'
            : 'hover:bg-pink-800/10 text-secondary'
        }`}
      >
        {link.name}
      </a>
    {/each}
  </div>
  <div class="hidden md:block md:mr-4">
    <NavIsland />
  </div>
</nav>