// ============================================================
// Reveal-on-scroll animation
// ============================================================
try {
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    // No IntersectionObserver support — just show everything.
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Safety net: whatever happens (slow load, blocked script,
  // a merge conflict elsewhere in this file), content must never
  // stay permanently invisible. Force it visible after a short delay.
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in-view)').forEach(el => {
        el.classList.add('in-view');
      });
    }, 2000);
  });
} catch (err) {
  console.error('Reveal animation error:', err);
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
}

// ============================================================
// Animated skill bar fill
// ============================================================
try {
  const bars = document.querySelectorAll('.skill-bar-fill');
  bars.forEach(el => {
    el.dataset.target = el.style.width;
    el.style.width = '0';
  });

  if ('IntersectionObserver' in window) {
    const barIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const el = entry.target;
          setTimeout(() => { el.style.width = el.dataset.target; }, 50);
          barIo.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(el => barIo.observe(el));
  } else {
    bars.forEach(el => { el.style.width = el.dataset.target; });
  }
} catch (err) {
  console.error('Skill bar animation error:', err);
  document.querySelectorAll('.skill-bar-fill').forEach(el => {
    if (el.dataset.target) el.style.width = el.dataset.target;
  });
}

// ============================================================
// Language switcher (EN / RU)
// ============================================================
try {
  const langSpans = document.querySelectorAll('.lang span[data-lang]');
  const translatable = document.querySelectorAll('[data-en]');
  const placeholders = document.querySelectorAll('[data-en-placeholder]');

  function setLanguage(lang){
    translatable.forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text !== null) el.textContent = text;
    });
    placeholders.forEach(el => {
      const text = el.getAttribute('data-' + lang + '-placeholder');
      if (text !== null) el.setAttribute('placeholder', text);
    });
    langSpans.forEach(span => {
      span.classList.toggle('lang-active', span.dataset.lang === lang);
    });
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('site-lang', lang); } catch (e) {}
  }

  langSpans.forEach(span => {
    span.addEventListener('click', () => setLanguage(span.dataset.lang));
  });

  let savedLang = null;
  try { savedLang = localStorage.getItem('site-lang'); } catch (e) {}
  if (savedLang === 'en' || savedLang === 'ru'){
    setLanguage(savedLang);
  }
} catch (err) {
  console.error('Language switcher error:', err);
}

// ============================================================
// Video modal (click a portfolio item to watch its video)
// ============================================================
try {
  const modal = document.getElementById('videoModal');
  const modalContent = document.getElementById('videoModalContent');
  const modalClose = document.getElementById('videoModalClose');
  const portfolioItems = document.querySelectorAll('.p-item[data-video]');

  if (modal && modalContent && modalClose) {
    const modalBackdrop = modal.querySelector('.video-modal-backdrop');

    function openVideoModal(src, type){
      if (!src) return;
      if (type === 'embed'){
        modalContent.innerHTML = '<iframe src="' + src + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      } else {
        modalContent.innerHTML = '<video src="' + src + '" controls autoplay playsinline></video>';
      }
      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
    }

    function closeVideoModal(){
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
      modalContent.innerHTML = '';
    }

    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.video;
        const type = item.dataset.videoType || 'file';
        openVideoModal(src, type);
      });
    });

    modalClose.addEventListener('click', closeVideoModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeVideoModal();
    });
  }
} catch (err) {
  console.error('Video modal error:', err);
}
