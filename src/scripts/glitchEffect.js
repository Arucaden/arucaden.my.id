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
  
  // Set initial title
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
    
    // Start with current title
    updateText(titleElement, currentTitle);
    
    // Change to next title DURING the glitch (at 60% through)
    setTimeout(() => {
      updateText(titleElement, nextTitle);
    }, 540); // 60% of 900ms
    
    // End the glitch effect
    setTimeout(() => {
      titleContainer.classList.remove('glitching');
      
      setTimeout(() => {
        isAnimating = false;
      }, 100);
    }, 900);
  }
  
  // Name-specific glitch (temporarily shows Japanese, then reverts)
  function applyNameGlitch() {
    if (isAnimating || titleContainer.classList.contains('glitching')) return false;
    
    isAnimating = true;
    nameContainer.classList.add('glitching');
    
    // Change to Japanese
    updateText(nameElement, japaneseText, true);
    
    // End glitch and revert to original name
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
      // Try again later if currently animating
      setTimeout(rotateTitle, 500);
      return;
    }
    
    // Get current and next title
    const currentTitle = titles[currentIndex];
    const nextIndex = (currentIndex + 1) % titles.length;
    const nextTitle = titles[nextIndex];
    
    // Apply title transition glitch
    applyTitleGlitch(currentTitle, nextTitle);
    
    // Update current index after transition
    currentIndex = nextIndex;
    
    // Schedule next rotation after staying on this title for a while
    titleTimer = setTimeout(rotateTitle, 3000);
  }
  
  // Start the title rotation after a short delay
  setTimeout(rotateTitle, 1500);

  let firstGlitchTimer = setTimeout(() => {
    // first name glitch
    if (!applyNameGlitch()) {
      let retryCount = 0;
      const retryTimer = setInterval(() => {
        if (applyNameGlitch() || retryCount > 10) {
          clearInterval(retryTimer);
          
          // Set up recurring glitches
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