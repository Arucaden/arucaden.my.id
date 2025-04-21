/**
 * GlitchEffect - Handles text glitching animations
 * @param {Object} options - Configuration options
 */
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
  
  // initial title
  updateText(titleElement, titles[currentIndex]);
  
  // timers
  let titleTimer = null;
  let nameTimer = null;
  let isAnimating = false;
  
  function updateText(element, text, isJapanese = false) {
    element.textContent = text;
    element.setAttribute('data-text', text);
    
    // Add or remove Japanese text styling
    if (isJapanese) {
      element.classList.add('text-japanese');
    } else {
      element.classList.remove('text-japanese');
    }
  }
  
  function applyGlitch(container, element, originalText, alternateText, duration = 1000, isJapanese = false) {
    if (isAnimating) return;
    
    isAnimating = true;
    container.classList.add('glitching');
    
    // Randomly change text to alternate text
    updateText(element, alternateText, isJapanese);
    
    // Reset
    setTimeout(() => {
      container.classList.remove('glitching');
      
      setTimeout(() => {
        updateText(element, originalText, false); // Back to normal text, no Japanese styling
        isAnimating = false;
      }, 100);
    }, duration);
  }
  
  // Start title rotation
  titleTimer = setInterval(() => {
    if (isAnimating) return;
    
    applyGlitch(titleContainer, titleElement, titles[currentIndex], titles[currentIndex], 900);
    
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % titles.length;
      updateText(titleElement, titles[currentIndex]);
    }, 300);
  }, 3000);
  
  // Start name glitching
  nameTimer = setInterval(() => {
    if (isAnimating || titleContainer.classList.contains('glitching')) return;
    
    applyGlitch(nameContainer, nameElement, originalName, japaneseText, 1200, true);
  }, 8000);
  
  return function cleanup() {
    clearInterval(titleTimer);
    clearInterval(nameTimer);
  };
}