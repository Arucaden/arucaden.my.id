<script lang="ts">
  let date = new Date().toLocaleDateString('en-ID');

  const navLinks = [
    { name: 'HOME', href: '/#', id: '', isIcon: true, icon: '/icons/mdi--home.svg' },
    { name: 'PROFILE', href: '/#profile', id: 'profile' },
    { name: 'ARTWORKS', href: '/#artworks', id: 'artworks' },
    { name: 'PROJECTS', href: '/#projects', id: 'projects' },
  ];

  let activeSection = $state('');
  let scrolledPastTop = $state(false);
  
  function isActive(link) {
    if (link.id === '') {
      // if top section is active, return Home highlight true
      return !scrolledPastTop && activeSection === '';
    }
    return link.id === activeSection;
  }

  $effect(() => {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    
    // Check if hash is present in URL on load
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      activeSection = hashId;
    }
    
    const scrollHandler = () => {
      scrolledPastTop = window.scrollY > 100;
      
      if (sections.length === 0) return;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const buffer = 100;
        
        if (rect.top <= buffer && rect.bottom >= buffer) {
          activeSection = section.id;
          return;
        }
      }
      
      // top = home
      if (window.scrollY < 100) {
        activeSection = '';
      }
    };
    
    scrollHandler();
    
    window.addEventListener('scroll', scrollHandler);
    
    navLinks.forEach(link => {
      if (link.href.includes('#')) {
        const element = document.querySelector(link.href.substring(link.href.indexOf('#')));
        if (element) {
          document.querySelectorAll(`a[href="${link.href}"]`).forEach(anchor => {
            anchor.addEventListener('click', (e) => {
              e.preventDefault();
              element.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', link.href);
              activeSection = link.id;
            });
          });
        }
      }
    });
    
    return () => {
      window.removeEventListener('scroll', scrollHandler);
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
          class={`${link.isIcon ? 'px-2' : 'px-3'} py-1 text-sm transition-all duration-200 ${
            isActive(link)
              ? 'text-main font-bold'
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