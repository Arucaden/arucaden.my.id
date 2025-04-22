
export function initProfileEffects() {
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

  // Return cleanup function
  return function cleanup() {
    if (techToggle) {
      techToggle.removeEventListener('click', () => {});
    }
    if (showPortrait) {
      showPortrait.removeEventListener('click', () => {});
    }
    if (closePortrait) {
      closePortrait.removeEventListener('click', () => {});
    }
  };
}