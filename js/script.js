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