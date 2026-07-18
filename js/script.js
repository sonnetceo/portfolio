// Reveal-on-scroll animation
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // Animated skill bar fill (reads the width already set inline in the HTML)
  const bars = document.querySelectorAll('.skill-bar-fill');
  bars.forEach(el => {
    el.dataset.target = el.style.width;
    el.style.width = '0';
  });
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

  // Language switcher (EN / RU)
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
    localStorage.setItem('site-lang', lang);
  }

  langSpans.forEach(span => {
    span.addEventListener('click', () => setLanguage(span.dataset.lang));
  });

  const savedLang = localStorage.getItem('site-lang');
  if (savedLang === 'en' || savedLang === 'ru'){
    setLanguage(savedLang);
  }

  // Video modal (click a portfolio item to watch its video)
  const modal = document.getElementById('videoModal');
  const modalContent = document.getElementById('videoModalContent');
  const modalClose = document.getElementById('videoModalClose');
  const modalBackdrop = modal.querySelector('.video-modal-backdrop');
  const portfolioItems = document.querySelectorAll('.p-item[data-video]');

  function openVideoModal(src, type){
    if (!src) return;
    if (type === 'embed'){
      modalContent.innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    } else {
      modalContent.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
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
  modalBackdrop.addEventListener('click', closeVideoModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeVideoModal();
  });
