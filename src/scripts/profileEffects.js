export function initProfileEffects() {
  const leftCol = document.getElementById('profile-left');
  const portraitWrapper = document.getElementById('portrait-wrapper');
  const portraitTitle = document.getElementById('portrait-title');

  function setPortraitHeight() {
    if (!leftCol || !portraitWrapper) return;
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (isDesktop) {
      const colH = leftCol.offsetHeight;
      const titleH = portraitTitle ? portraitTitle.offsetHeight + 8 : 0;
      const targetH = Math.max(0, colH - titleH);
      portraitWrapper.style.height = targetH > 0 ? targetH + 'px' : '';
    } else {
      portraitWrapper.style.height = '';
    }
  }

  let ro;
  if (window.ResizeObserver && leftCol && portraitWrapper) {
    ro = new ResizeObserver(() => setPortraitHeight());
    ro.observe(leftCol);
  }
  const resizeHandler = () => setPortraitHeight();
  window.addEventListener('resize', resizeHandler);
  requestAnimationFrame(setPortraitHeight);

  const techToggle = document.getElementById('tech-toggle');
  const techContainer = document.getElementById('tech-container');
  let techToggleHandler;

  if (techToggle && techContainer) {
    let expanded = false;

    techToggleHandler = () => {
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
    };

    techToggle.addEventListener('click', techToggleHandler);
  }

  const showPortrait = document.getElementById('show-portrait');
  const closePortrait = document.getElementById('close-portrait');
  const portraitOverlay = document.getElementById('portrait-overlay');

  function openPortrait() {
    if (!portraitOverlay) return;
    portraitOverlay.classList.remove('hidden');
    portraitOverlay.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    closePortrait?.focus();
  }

  function closePortraitOverlay() {
    if (!portraitOverlay) return;
    portraitOverlay.classList.add('hidden');
    portraitOverlay.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    showPortrait?.focus();
  }

  if (showPortrait && closePortrait && portraitOverlay) {
    showPortrait.addEventListener('click', openPortrait);
    closePortrait.addEventListener('click', closePortraitOverlay);
  }

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

  const delegatedClickHandler = (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    if (target.closest('#show-all-experiences')) {
      showExperiencesOverlay();
    }
    if (target.closest('#hide-all-experiences')) {
      hideExperiencesOverlay();
    }
  };
  document.addEventListener('click', delegatedClickHandler);

  const keydownHandler = (e) => {
    if (e.key !== 'Escape') return;
    if (portraitOverlay && !portraitOverlay.classList.contains('hidden')) {
      closePortraitOverlay();
    }
    if (experiencesOverlay?.classList.contains('overlay-visible')) {
      hideExperiencesOverlay();
    }
  };
  document.addEventListener('keydown', keydownHandler);

  return function cleanup() {
    if (ro) ro.disconnect();
    window.removeEventListener('resize', resizeHandler);
    if (techToggle && techToggleHandler) {
      techToggle.removeEventListener('click', techToggleHandler);
    }
    if (showPortrait) {
      showPortrait.removeEventListener('click', openPortrait);
    }
    if (closePortrait) {
      closePortrait.removeEventListener('click', closePortraitOverlay);
    }
    document.removeEventListener('click', delegatedClickHandler);
    document.removeEventListener('keydown', keydownHandler);
  };
}
