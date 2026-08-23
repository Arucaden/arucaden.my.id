export function initGlitchEffects() {
  const titleElement = document.getElementById('title-text');
  const titleContainer = document.getElementById('title-container');
  const nameElement = document.getElementById('name-text');
  const nameContainer = document.getElementById('name-container');

  if (!titleElement || !nameElement || !titleContainer || !nameContainer) {
    return () => {};
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const titles = JSON.parse(titleElement.dataset.titles || '[]');
  let currentIndex = 0;

  const originalName = nameElement.textContent;
  const japaneseText = 'ダファ・マウラナ・サトリア';

  function updateText(element, text, isJapanese = false) {
    element.textContent = text;
    element.setAttribute('data-text', text);

    if (isJapanese) {
      element.classList.add('text-japanese');
    } else {
      element.classList.remove('text-japanese');
    }
  }

  updateText(titleElement, titles[currentIndex] || titleElement.textContent);

  if (prefersReducedMotion) {
    return () => {};
  }

  let titleTimer = null;
  let nameTimer = null;
  let firstGlitchTimer = null;
  let retryTimer = null;
  let isAnimating = false;

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

  function applyNameGlitch() {
    if (isAnimating || titleContainer.classList.contains('glitching'))
      return false;

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

    return true;
  }

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

  setTimeout(rotateTitle, 1500);

  firstGlitchTimer = setTimeout(() => {
    if (!applyNameGlitch()) {
      let retryCount = 0;
      retryTimer = setInterval(() => {
        if (applyNameGlitch() || retryCount > 10) {
          clearInterval(retryTimer);
          retryTimer = null;

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
    if (retryTimer) clearInterval(retryTimer);
  };
}
