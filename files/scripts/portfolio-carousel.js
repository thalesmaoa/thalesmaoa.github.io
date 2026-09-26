(function() {
  const listing = document.getElementById('listing-recent-portfolio');
  if (!listing) return;

  const init = () => {
    const items = Array.from(listing.querySelectorAll('.g-col-1'));
    if (items.length === 0) return setTimeout(init, 100);
    if (items.length <= 1) return;

    const getItemsPerPage = () => window.innerWidth < 768 ? 1 : 3;
    let itemsPerPage = getItemsPerPage();
    let currentStep = 0;       // which card is at the left edge
    let isTransitioning = false;
    let itemWidth, gapPx;

    // ---- DOM setup ----
    const gridContainer = items[0].parentElement;
    gridContainer.style.overflow = 'hidden';

    const track = document.createElement('div');
    track.className = 'carousel-track';
    items.forEach(item => track.appendChild(item));
    gridContainer.appendChild(track);

    const origCount = items.length;
    const rebuildClones = () => {
      // Remove old clones
      track.querySelectorAll('[aria-hidden="true"]').forEach(c => c.remove());
      // Append fresh clones of the first itemsPerPage items
      const base = Array.from(track.querySelectorAll('.g-col-1:not([aria-hidden="true"])'));
      for (let i = 0; i < itemsPerPage && i < base.length; i++) {
        const clone = base[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
    };
    rebuildClones();

    // maxSteps = origCount: step origCount shows only clones (visually equal to step 0)
    const maxSteps = origCount;

    // ---- Sizing ----
    const updateSizing = () => {
      const containerWidth = gridContainer.clientWidth;
      gapPx = parseFloat(getComputedStyle(track).gap) || 0;
      const totalGap = (itemsPerPage - 1) * gapPx;
      itemWidth = (containerWidth - totalGap) / itemsPerPage;
      track.querySelectorAll('.g-col-1').forEach(item => {
        item.style.width = itemWidth + 'px';
      });
    };

    // ---- Navigation ----
    const setTransform = (step) => {
      const offset = -(step * (itemWidth + gapPx));
      track.style.transform = 'translateX(' + offset + 'px)';
    };

    const jumpTo = (step) => {
      // Instantly jump to a step with no animation (force reflow trick)
      track.style.transition = 'none';
      setTransform(step);
      track.offsetHeight; // force reflow — commits the "none" transition + new transform
      track.style.transition = 'transform 0.5s ease-in-out';
    };

    const animateTo = (step) => {
      track.style.transition = 'transform 0.5s ease-in-out';
      setTransform(step);
    };

    const goNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentStep++;

      if (currentStep === maxSteps) {
        // Reached clone page — animate into it, then silently jump to real step 0
        animateTo(currentStep);
        setTimeout(() => {
          currentStep = 0;
          jumpTo(0);
          isTransitioning = false;
        }, 500);
      } else {
        animateTo(currentStep);
        setTimeout(() => { isTransitioning = false; }, 500);
      }
    };

    const goPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentStep--;

      if (currentStep < 0) {
        // Jump to clone page, then transition back one step
        currentStep = maxSteps;
        jumpTo(maxSteps);
        setTimeout(() => {
          currentStep = maxSteps - 1;
          animateTo(currentStep);
          setTimeout(() => { isTransitioning = false; }, 500);
        }, 50);
      } else {
        animateTo(currentStep);
        setTimeout(() => { isTransitioning = false; }, 500);
      }
    };

    // ---- Arrows ----
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-arrow carousel-arrow-left';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.addEventListener('click', () => goPrev());

    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-arrow carousel-arrow-right';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.addEventListener('click', () => goNext());

    listing.appendChild(prevBtn);
    listing.appendChild(nextBtn);

    // ---- Touch / swipe ----
    let touchStartX = 0;
    listing.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    listing.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goNext() : goPrev();
      }
    }, { passive: true });

    // ---- Initial render ----
    updateSizing();
    jumpTo(0);

    // ---- Auto-advance ----
    let interval = setInterval(goNext, 5000);

    listing.addEventListener('mouseenter', () => clearInterval(interval));
    listing.addEventListener('mouseleave', () => {
      interval = setInterval(goNext, 5000);
    });

    // ---- Resize ----
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newItemsPerPage = getItemsPerPage();
        if (newItemsPerPage !== itemsPerPage) {
          itemsPerPage = newItemsPerPage;
          rebuildClones();
          currentStep = 0;
        }
        updateSizing();
        jumpTo(0);
      }, 250);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
