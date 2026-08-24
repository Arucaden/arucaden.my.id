<script lang="ts">
  import ColorPalettePicker from './ColorPalettePicker.svelte';

  let date = new Date().toLocaleDateString('en-ID');

  const navLinks = [
    { name: 'HOME', href: '/#', id: '', isIcon: true, iconClass: 'i-ri-home-4-fill' },
    { name: 'PROFILE', href: '/#profile', id: 'profile' },
    { name: 'PROJECTS', href: '/#projects', id: 'projects' },
    { name: 'ARTWORKS', href: '/#artworks', id: 'artworks' },
    { name: 'BLOG', href: '/#blogs', id: 'blogs' },
  ];

  let activeSection = $state('');
  let scrolledPastTop = $state(false);

  function isActive(link: { id: string }) {
    if (link.id === '') {
      return !scrolledPastTop && activeSection === '';
    }
    return link.id === activeSection;
  }

  function handleNavClick(e: Event, link: { href: string; id: string }) {
    if (link.href.includes('#')) {
      if (link.id === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
        activeSection = '';
      } else {
        const element = document.getElementById(link.id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', link.href);
          activeSection = link.id;
        }
      }
    }
  }

  $effect(() => {
    if (window.location.hash) {
      activeSection = window.location.hash.substring(1);
    }

    const sections = Array.from(document.querySelectorAll('section[id]'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { rootMargin: '-25% 0px -45% 0px', threshold: 0 }
    );
    sections.forEach((sec) => observer.observe(sec));

    const scrollHandler = () => {
      scrolledPastTop = window.scrollY > 100;
      if (window.scrollY < 100) activeSection = '';
    };

    window.addEventListener('scroll', scrollHandler);
    scrollHandler();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      observer.disconnect();
    };
  });
</script>

<header class="sticky top-4 z-50 w-full mb-8 hidden md:block">
  <nav class="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-[rgba(14,10,18,0.85)] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
    <div class="flex items-center gap-2">
      {#each navLinks as link}
        <a
          href={link.href}
          onclick={(e) => handleNavClick(e, link)}
          class={`px-4 py-2 rounded-xl text-xs font-mono tracking-wide transition-all duration-200 flex items-center justify-center ${
            isActive(link)
              ? 'bg-main/20 text-main font-bold shadow-[0_0_4px_var(--color-accent-glow)]'
              : 'text-gray-text hover:text-main hover:bg-white/5'
          }`}
        >
          {#if link.isIcon}
            <span class={`${link.iconClass} w-4 h-4`}></span>
          {:else}
            {link.name}
          {/if}
        </a>
      {/each}
    </div>

    <div class="flex items-center gap-3 pr-2">
      <span class="text-sm font-mono text-gray-text">{date}</span>
      <ColorPalettePicker />
    </div>
  </nav>
</header>

<div class="fixed md:hidden inset-x-0 bottom-4 z-50 flex justify-center px-3 pointer-events-none">
  <nav
    class="pointer-events-auto w-full max-w-md flex items-center justify-around py-2.5 px-3 rounded-2xl bg-[rgba(14,10,18,0.92)] backdrop-blur-2xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
  >
    {#each navLinks as link}
      <a
        href={link.href}
        onclick={(e) => handleNavClick(e, link)}
        class={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
          isActive(link)
            ? 'text-main font-bold scale-105'
            : 'text-gray-text hover:text-main'
        }`}
      >
        {#if link.isIcon}
          <span class={`${link.iconClass} w-4 h-4`}></span>
        {:else}
          <span class="text-[10px] font-mono">{link.name}</span>
        {/if}
      </a>
    {/each}

    <div class="border-l border-white/10 pl-2">
      <ColorPalettePicker />
    </div>
  </nav>
</div>