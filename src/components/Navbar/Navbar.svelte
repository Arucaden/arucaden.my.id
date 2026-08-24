<script lang="ts">
  const navLinks = [
    { name: 'HOME', href: '/#', id: '', isIcon: true, icon: '/icons/mdi--home.svg' },
    { name: 'PROJECTS', href: '/#projects', id: 'projects' },
    { name: 'UI/UX LAB', href: '/#lab', id: 'lab' },
    { name: 'PROFILE', href: '/#profile', id: 'profile' },
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

<!-- Desktop Floating Pill Navbar -->
<header class="sticky top-5 z-50 w-full flex justify-center px-4 mb-8 pointer-events-none">
  <nav
    class="pointer-events-auto hidden md:flex items-center justify-between gap-6 px-4 py-2 rounded-full bg-[rgba(14,10,18,0.8)] backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300"
  >
    <!-- Logo / Brand Signature -->
    <a
      href="/#"
      onclick={(e) => handleNavClick(e, { href: '/#', id: '' })}
      class="flex items-center gap-2 pl-2 pr-1 group"
    >
      <div class="w-2 h-2 rounded-full bg-main group-hover:scale-125 transition-transform duration-200 shadow-[0_0_8px_rgba(255,59,105,0.8)]"></div>
      <span class="text-xs font-mono font-bold tracking-wider text-white group-hover:text-main transition-colors">
        ARUCADEN.UI
      </span>
    </a>

    <!-- Nav Item Links -->
    <div class="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/5">
      {#each navLinks as link}
        <a
          href={link.href}
          onclick={(e) => handleNavClick(e, link)}
          class={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all duration-200 ${
            isActive(link)
              ? 'bg-main text-black font-bold shadow-[0_0_12px_rgba(255,59,105,0.4)] scale-102'
              : 'text-gray-text hover:text-white hover:bg-white/5'
          }`}
        >
          {link.name}
        </a>
      {/each}
    </div>

    <!-- Status & Quick Contact -->
    <div class="flex items-center gap-3 pr-2">
      <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Open for roles</span>
      </div>

      <a
        href="mailto:daffamaulanasatria@gmail.com"
        class="text-xs font-mono px-3 py-1.5 rounded-full bg-main/15 text-main border border-main/30 hover:bg-main hover:text-black font-semibold transition-all duration-200"
      >
        Contact ➔
      </a>
    </div>
  </nav>
</header>

<!-- Mobile Floating Bottom Dock -->
<div class="fixed md:hidden inset-x-0 bottom-4 z-50 flex justify-center px-3 pointer-events-none">
  <nav
    class="pointer-events-auto w-full max-w-md flex items-center justify-around py-2.5 px-3 rounded-2xl bg-[rgba(14,10,18,0.92)] backdrop-blur-2xl border border-white/15 shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
  >
    {#each navLinks as link}
      <a
        href={link.href}
        onclick={(e) => handleNavClick(e, link)}
        class={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl transition-all ${
          isActive(link)
            ? 'text-main font-bold scale-105'
            : 'text-gray-text hover:text-white'
        }`}
      >
        {#if link.isIcon}
          <img src={link.icon} alt="Home" class="w-4 h-4" />
        {:else}
          <span class="text-[10px] font-mono">{link.name.replace('UI/UX ', '')}</span>
        {/if}
      </a>
    {/each}
  </nav>
</div>