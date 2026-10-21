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
  const resizeHandler = () => {
    setPortraitHeight();
    updateTechContainerHeight?.();
  };
  window.addEventListener('resize', resizeHandler);
  requestAnimationFrame(setPortraitHeight);

  const techToggle = document.getElementById('tech-toggle');
  const techContainer = document.getElementById('tech-container');
  let techToggleHandler;
  let updateTechContainerHeight;
  let transitionEndHandler;

  if (techToggle && techContainer) {
    let expanded = false;
    let twoRowHeight = 96;

    function getTwoRowHeight() {
      const cards = techContainer.querySelectorAll('.tech-card-wrapper');
      if (cards.length === 0) return 96;

      const containerRect = techContainer.getBoundingClientRect();
      let firstRowTop = null;
      let secondRowTop = null;
      let thirdRowTop = null;

      for (let i = 0; i < cards.length; i++) {
        const cardRect = cards[i].getBoundingClientRect();
        const top = Math.round(cardRect.top - containerRect.top);

        if (firstRowTop === null) {
          firstRowTop = top;
        } else if (secondRowTop === null && top > firstRowTop + 5) {
          secondRowTop = top;
        } else if (secondRowTop !== null && top > secondRowTop + 5) {
          thirdRowTop = top;
          break;
        }
      }

      if (thirdRowTop !== null && thirdRowTop > 0) {
        return Math.max(80, thirdRowTop);
      }

      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        const lastCardRect = lastCard.getBoundingClientRect();
        return Math.max(80, Math.round(lastCardRect.bottom - containerRect.top + 4));
      }

      return 96;
    }

    updateTechContainerHeight = () => {
      const measuredH = getTwoRowHeight();
      if (measuredH > 0) {
        twoRowHeight = measuredH;
      }
      const needsToggle = techContainer.scrollHeight > twoRowHeight + 10;
      techToggle.style.display = needsToggle ? '' : 'none';

      if (expanded) {
        techContainer.style.maxHeight = techContainer.scrollHeight + 'px';
      } else {
        techContainer.style.maxHeight = twoRowHeight + 'px';
      }
    };

    requestAnimationFrame(updateTechContainerHeight);

    techToggleHandler = () => {
      expanded = !expanded;

      if (expanded) {
        techContainer.style.maxHeight = techContainer.scrollHeight + 'px';
        techToggle.textContent = 'Show Less';
        techContainer.classList.add('expanded');
      } else {
        const targetH = twoRowHeight > 0 ? twoRowHeight : (getTwoRowHeight() || 96);
        techContainer.style.maxHeight = targetH + 'px';
        techToggle.textContent = 'Show More';
        techContainer.classList.remove('expanded');
      }
    };

    techToggle.addEventListener('click', techToggleHandler);

    transitionEndHandler = (e) => {
      if (e.propertyName === 'max-height') {
        setPortraitHeight();
      }
    };
    techContainer.addEventListener('transitionend', transitionEndHandler);
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
    if (techContainer && transitionEndHandler) {
      techContainer.removeEventListener('transitionend', transitionEndHandler);
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
