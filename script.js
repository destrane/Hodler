/* Chill Hodler — minimal site scripting */

(function () {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    '.section__head, .pillar, .flow__node, .ticker-card, .path__step, .buy-card, .social, .zen-quote, .hero__stats, .hero__cta'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px 80px 0px' }
  );
  revealTargets.forEach((el) => io.observe(el));

  // Safety net: if anything's still hidden after a moment, reveal it.
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight + 200) el.classList.add('is-visible');
    });
  }, 1200);

  // Copy CA
  const copyBtn = document.getElementById('copyCA');
  const caText = document.getElementById('caText');
  if (copyBtn && caText) {
    const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };

    copyBtn.addEventListener('click', async () => {
      const ca = copyBtn.dataset.ca || caText.textContent.trim();
      const original = ca;
      let ok = false;
      try {
        await navigator.clipboard.writeText(ca);
        ok = true;
      } catch {
        ok = fallbackCopy(ca);
      }
      caText.textContent = ok ? 'Copied · breathe out' : 'Copy failed · select & copy';
      setTimeout(() => { caText.textContent = original; }, 1800);
    });
  }

  // Breathing animation — 4-7-8
  const circle = document.getElementById('breathCircle');
  const label = document.getElementById('breathLabel');
  const btn = document.getElementById('breathBtn');

  if (circle && label && btn) {
    let running = false;
    let timeouts = [];

    const clear = () => { timeouts.forEach(clearTimeout); timeouts = []; };

    const setPhase = (phaseClass, text) => {
      circle.classList.remove('is-in', 'is-hold', 'is-out');
      if (phaseClass) circle.classList.add(phaseClass);
      label.textContent = text;
    };

    const cycle = () => {
      if (!running) return;
      // Inhale 4s
      setPhase('is-in', 'Inhale · 4');
      timeouts.push(setTimeout(() => {
        if (!running) return;
        // Hold 7s
        setPhase('is-hold', 'Hold · 7');
        timeouts.push(setTimeout(() => {
          if (!running) return;
          // Exhale 8s
          setPhase('is-out', 'Exhale · 8');
          timeouts.push(setTimeout(cycle, 8000));
        }, 7000));
      }, 4000));
    };

    btn.addEventListener('click', () => {
      if (running) {
        running = false;
        clear();
        setPhase(null, 'Tap to begin');
        btn.textContent = 'Start breathing';
      } else {
        running = true;
        btn.textContent = 'Stop';
        cycle();
      }
    });

    // Also start by tapping the circle
    circle.addEventListener('click', () => btn.click());
  }
})();
