
export function initProfileEffects() {
  // Sync portrait height with the entire left column on desktop
  const leftCol = document.getElementById('profile-left');
  const portraitWrapper = document.getElementById('portrait-wrapper');
  const portraitTitle = document.getElementById('portrait-title');

  function setPortraitHeight() {
    if (!leftCol || !portraitWrapper) return;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      const colH = leftCol.offsetHeight;
      const titleH = portraitTitle ? portraitTitle.offsetHeight + 8 : 0; // small gap
      const targetH = Math.max(0, colH - titleH);
      portraitWrapper.style.height = targetH > 0 ? targetH + 'px' : '';
    } else {
      portraitWrapper.style.height = '';
    }
  }

  // Observe left column resize and window resize
  let ro;
  if (window.ResizeObserver && leftCol && portraitWrapper) {
    ro = new ResizeObserver(() => setPortraitHeight());
    ro.observe(leftCol);
  }
  const resizeHandler = () => setPortraitHeight();
  window.addEventListener('resize', resizeHandler);
  // initial sync after layout
  requestAnimationFrame(setPortraitHeight);

  // Tech stack expand/collapse
  const techToggle = document.getElementById('tech-toggle');
  const techContainer = document.getElementById('tech-container');
  
  if (techToggle && techContainer) {
    let expanded = false;

    techToggle.addEventListener('click', () => {
      expanded = !expanded;
      
      if (expanded) {
        techContainer.style.maxHeight = techContainer.scrollHeight + 'px';
        techToggle.textContent = 'Show Less';
        techContainer.classList.add('expanded');
      } else {
        techContainer.style.maxHeight = '120px';
        techToggle.textContent = 'Show All';
        techContainer.classList.remove('expanded');
      }
    });
  }
  
  // Portrait overlay functionality
  const showPortrait = document.getElementById('show-portrait');
  const closePortrait = document.getElementById('close-portrait');
  const portraitOverlay = document.getElementById('portrait-overlay');
  
  if (showPortrait && closePortrait && portraitOverlay) {
    showPortrait.addEventListener('click', () => {
      portraitOverlay.classList.remove('hidden');
      portraitOverlay.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    });
    
    closePortrait.addEventListener('click', () => {
      portraitOverlay.classList.add('hidden');
      portraitOverlay.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // Experiences overlay toggling (replace profile content visually without resizing)
  const profileContent = document.getElementById('profile-content');
  const experiencesOverlay = document.getElementById('experiences-overlay');
  function showExperiencesOverlay() {
    if (!profileContent || !experiencesOverlay) return;
    profileContent.classList.add('invisible', 'pointer-events-none');
    experiencesOverlay.classList.add('overlay-visible');
  }
  function hideExperiencesOverlay() {
    if (!profileContent || !experiencesOverlay) return;
    experiencesOverlay.classList.remove('overlay-visible');
    profileContent.classList.remove('invisible', 'pointer-events-none');
  }
  // Delegate clicks so it works regardless of island hydration timing
  const delegatedClickHandler = (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.id === 'show-all-experiences') {
      showExperiencesOverlay();
    }
    if (target.id === 'hide-all-experiences') {
      hideExperiencesOverlay();
    }
  };
  document.addEventListener('click', delegatedClickHandler);

  // Return cleanup function
  return function cleanup() {
    if (ro) ro.disconnect();
    window.removeEventListener('resize', resizeHandler);
    if (techToggle) {
      techToggle.removeEventListener('click', () => {});
    }
    if (showPortrait) {
      showPortrait.removeEventListener('click', () => {});
    }
    if (closePortrait) {
      closePortrait.removeEventListener('click', () => {});
    }
    document.removeEventListener('click', delegatedClickHandler);
  };
}
