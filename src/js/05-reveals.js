  /* ======================================================================
     Scroll reveals: skills, the generic ones, and the experience bands.

     The skill separators measure line ends before writing any class, because
     hiding one changes the width of the line it is on and therefore where the
     next line wraps.
     ====================================================================== */
  /* ======================================================================
     08b — SKILL SEPARATORS
     The rules between skills are drawn with ::after, so the last chip on a
     wrapped line leaves one dangling at the line end. Flag those after layout.
     ====================================================================== */
  function skillRules() {
    var groups = $$('.ars__g ul');
    if (!groups.length) return;
    function mark() {
      groups.forEach(function (ul) {
        var items = $$('li', ul);
        items.forEach(function (li) { li.classList.remove('is-eol'); });
        /* read every offset before writing any class, so the measurement can't
           be perturbed by a change made earlier in the same pass */
        var tops = items.map(function (li) { return li.offsetTop; });
        items.forEach(function (li, i) {
          if (i < items.length - 1 && tops[i + 1] > tops[i] + 2) li.classList.add('is-eol');
        });
      });
    }
    mark();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(mark);
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t); t = setTimeout(mark, 150);
    }, { passive: true });
  }

  /* ======================================================================
     09 — GENERIC REVEALS
     ====================================================================== */
  function reveals() {
    $$('[data-reveal="line"]').forEach(function (el) {
      var lines = splitLines(el);
      if (!lines.length) return;
      if (REDUCED) { gsap.set(lines, { yPercent: 0 }); return; }
      gsap.set(lines, { yPercent: 150 });
      gsap.to(lines, {
        yPercent: 0, duration: 0.95, stagger: 0.09, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 82%', once: true }
      });
    });

    /* kinetic word-spacing on the mission lead */
    var k = $('[data-kinetic]');
    if (k && !REDUCED) {
      gsap.fromTo(k, { wordSpacing: '0em' }, {
        wordSpacing: '0.08em', y: -60, ease: 'none',
        scrollTrigger: { trigger: '.mission', start: 'top bottom', end: 'bottom top', scrub: 0.5 }
      });
    }

    /* arsenal token stagger */
    $$('.ars__g').forEach(function (g) {
      var items = $$('li', g);
      if (REDUCED) return;
      gsap.from(items, {
        opacity: 0, y: 14, duration: 0.5, stagger: 0.025, ease: 'power2.out',
        scrollTrigger: { trigger: g, start: 'top 88%', once: true }
      });
    });

    /* section headings + generic cards */
    if (!REDUCED) {
      $$('.prj__tags li').forEach(function (t) {
        gsap.from(t, {
          opacity: 0, y: 12, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: t, start: 'top 94%', once: true }
        });
      });
    }
  }

  /* ======================================================================
     11 — STORY TIMELINE
     ====================================================================== */
  function timeline() {
    var track = $('#tlTrack');
    if (!track) return;
    var cards = $$('.tl__card', track);
    if (!cards.length) return;
    var fill = $('#tlSpine') ? $('#tlSpine').firstElementChild : null;

    if (REDUCED) {
      cards.forEach(function (c) { c.classList.add('is-live', 'is-in'); });
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }

    if (fill) {
      ScrollTrigger.create({
        trigger: track, start: 'top 62%', end: 'bottom 62%', scrub: 0.5,
        onUpdate: function (self) { fill.style.transform = 'scaleY(' + self.progress.toFixed(4) + ')'; }
      });
    }

    /* Exactly one role is live at a time: whichever card's midpoint is nearest
       the reading line. A start/end pair per card leaves gaps when a card is
       shorter than the viewport, and lets a card go inactive while still fully
       on screen. Only the spine marker reacts; nothing is dimmed. */
    var live = -1;
    function pickLive() {
      var line = window.innerHeight * 0.42, best = 0, bestD = Infinity;
      for (var i = 0; i < cards.length; i++) {
        var r = cards[i].getBoundingClientRect();
        var d = Math.abs((r.top + r.bottom) / 2 - line);
        if (d < bestD) { bestD = d; best = i; }
      }
      if (best === live) return;
      if (live > -1) cards[live].classList.remove('is-live');
      cards[best].classList.add('is-live');
      live = best;
    }
    ScrollTrigger.create({ trigger: track, start: 'top bottom', end: 'bottom top', onUpdate: pickLive });
    pickLive();

    cards.forEach(function (c) {
      var rail  = c.querySelector('.tl__inner');
      var logo  = c.querySelector('.tl__logo');
      var paras = $$('.tl__b p', c);
      var tags  = c.querySelector('.tl__tags');

      /* each paragraph is wrapped so it can be masked upward on entry, the
         same reveal the hero and mission already use */
      paras.forEach(function (pEl) {
        if (pEl.dataset.masked) return;
        var inner = document.createElement('span');
        inner.className = 'tl__line';
        while (pEl.firstChild) inner.appendChild(pEl.firstChild);
        pEl.appendChild(inner);
        pEl.dataset.masked = '1';
      });
      var lines = $$('.tl__line', c);

      var tl = gsap.timeline({
        scrollTrigger: { trigger: c, start: 'top 84%', once: true }
      });
      if (rail)  tl.from(rail,  { opacity: 0, x: -26, duration: 0.7, ease: 'expo.out' }, 0);
      if (logo)  tl.from(logo,  { opacity: 0, scale: 0.8, transformOrigin: 'left center', duration: 0.6, ease: 'back.out(2)' }, 0.18);
      if (lines.length) tl.from(lines, { yPercent: 108, duration: 0.8, stagger: 0.09, ease: 'expo.out' }, 0.1);
      if (tags)  tl.from(tags,  { opacity: 0, y: 14, duration: 0.55, ease: 'expo.out' }, '-=0.3');

      /* the rail drifts slower than the text, which reads as depth */
      if (rail && DESKTOP()) {
        gsap.fromTo(rail, { y: 22 }, {
          y: -22, ease: 'none',
          scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
        });
      }
    });
  }
