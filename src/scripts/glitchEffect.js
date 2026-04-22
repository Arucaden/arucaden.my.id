export function initGlitchEffects() {
  const titleElement = document.getElementById('title-text');
  const titleContainer = document.getElementById('title-container');
  const nameElement = document.getElementById('name-text');
  const nameContainer = document.getElementById('name-container');
  
  if (!titleElement || !nameElement) return;

  const titles = JSON.parse(titleElement.dataset.titles || '[]');
  let currentIndex = 0;
  
  const originalName = nameElement.textContent;
  const japaneseText = "ダファ・マウラナ・サトリア";
  
  // Initial title
  updateText(titleElement, titles[currentIndex]);
  
  // Timers
  let titleTimer = null;
  let nameTimer = null;
  let isAnimating = false;
  
  function updateText(element, text, isJapanese = false) {
    element.textContent = text;
    element.setAttribute('data-text', text);
    
    if (isJapanese) {
      element.classList.add('text-japanese');
    } else {
      element.classList.remove('text-japanese');
    }
  }
  
  // Title-specific glitch (transitions to new text)
  function applyTitleGlitch(currentTitle, nextTitle) {
    if (isAnimating) return;
    
    isAnimating = true;
    titleContainer.classList.add('glitching');
    
    updateText(titleElement, currentTitle);
    
    setTimeout(() => {
      updateText(titleElement, nextTitle);
    }, 540);
    
    setTimeout(() => {
      titleContainer.classList.remove('glitching');
      
      setTimeout(() => {
        isAnimating = false;
      }, 100);
    }, 900);
  }
  
  // Name glitch (Japanese one)
  function applyNameGlitch() {
    if (isAnimating || titleContainer.classList.contains('glitching')) return false;
    
    isAnimating = true;
    nameContainer.classList.add('glitching');
    
    updateText(nameElement, japaneseText, true);
    
    setTimeout(() => {
      nameContainer.classList.remove('glitching');
      
      setTimeout(() => {
        updateText(nameElement, originalName, false);
        isAnimating = false;
      }, 100);
    }, 1200);
    
    return true; // Successfully started animation
  }
  
  // Title rotation function
  function rotateTitle() {
    if (isAnimating) {
      setTimeout(rotateTitle, 500);
      return;
    }
    
    const currentTitle = titles[currentIndex];
    const nextIndex = (currentIndex + 1) % titles.length;
    const nextTitle = titles[nextIndex];
    
    applyTitleGlitch(currentTitle, nextTitle);
    
    currentIndex = nextIndex;
    
    titleTimer = setTimeout(rotateTitle, 3000);
  }
  
  // Title rotation
  setTimeout(rotateTitle, 1500);

  let firstGlitchTimer = setTimeout(() => {
    if (!applyNameGlitch()) {
      let retryCount = 0;
      const retryTimer = setInterval(() => {
        if (applyNameGlitch() || retryCount > 10) {
          clearInterval(retryTimer);
          
          setTimeout(() => {
            nameTimer = setInterval(() => {
              applyNameGlitch();
            }, 5000);
          }, 1300);
        }
        retryCount++;
      }, 300);
    } else {

      setTimeout(() => {
        nameTimer = setInterval(() => {
          applyNameGlitch();
        }, 5000);
      }, 1300);
    }
  }, 1200);
  
  return function cleanup() {
    clearTimeout(titleTimer);
    clearTimeout(firstGlitchTimer);
    clearInterval(nameTimer);
  };
}