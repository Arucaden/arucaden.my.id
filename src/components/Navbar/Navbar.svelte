<script lang="ts">
  let date = new Date().toLocaleDateString('en-ID');

  const navLinks = [
    { name: 'HOME', href: '/#', id: '', isIcon: true, icon: '/icons/mdi--home.svg' },
    { name: 'PROFILE', href: '/#profile', id: 'profile' },
    { name: 'ARTWORKS', href: '/#artworks', id: 'artworks' },
    { name: 'PROJECTS', href: '/#projects', id: 'projects' },
    { name: 'BLOG', href: '/#blogs', id: 'blogs' },
  ];

  let activeSection = $state('');
  let scrolledPastTop = $state(false);
  
  function isActive(link) {
    if (link.id === '') {
      return !scrolledPastTop && activeSection === '';
    }
    return link.id === activeSection;
  }

  function handleNavClick(e: Event, link: any) {
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
    
    // Use an IntersectionObserver to cleanly detect active section in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { rootMargin: '-20% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(sec => observer.observe(sec));

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

<nav class="md:sticky md:top-0 flex justify-between items-center mb-0 md:mb-8 bg-black/80 z-50">
  <div class="hidden md:block absolute bottom-0 h-2px w-full bg-tertiary"></div>
  
  <!-- Mobile -->
  <div class="fixed md:hidden inset-x-0 bottom-0 z-50">
    <div class="flex justify-evenly py-3 bg-black/90 border-t-2 border-tertiary shadow-[0_0_10px_2px_rgba(255,0,102,0.3)]">
      {#each navLinks as link}
        <a
          href={link.href}
          onclick={(e) => handleNavClick(e, link)}
          class={`${link.isIcon ? 'px-2' : 'px-3'} py-1 text-sm transition-all duration-200 ${
            isActive(link)
              ? 'text-white font-bold'
              : 'text-tertiary hover:text-main'
          }`}
        >
          {#if link.isIcon}
            <img src={link.icon} alt="Home" class="w-5 h-5 inline-block" />
          {:else}
            {link.name}
          {/if}
        </a>
      {/each}
    </div>
  </div>

  <!-- Desktop -->
  <div class="hidden md:flex text-md text-main w-full">
    {#each navLinks as link}
      <a
        href={link.href}
        onclick={(e) => handleNavClick(e, link)}
        class={`${link.isIcon ? 'px-5' : 'px-10'} py-3 transition-all duration-200 text-sm ${
          isActive(link)
            ? 'bg-main/20 text-white border-b-4 border-main font-bold'
            : 'hover:bg-main/12 text-secondary'
        }`}
      >
        {#if link.isIcon}
          <img src={link.icon} alt="Home" class="w-5 h-5 inline-block" />
        {:else}
          {link.name}
        {/if}
      </a>
    {/each}
  </div>
  <div class="hidden md:block md:mr-4">
    <span class="font-semibold text-white-text">{date}</span>
  </div>
</nav>