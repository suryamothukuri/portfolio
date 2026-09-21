  /* ======================================================================
     Lenis smooth scroll, and the scroll-driven film.

     Three photographic plates on one canvas, each with a from/to camera move
     interpolated by scroll position and cross-dissolved at the boundaries.
     VEIL here decides how much of the plate reads through behind the type.
     ====================================================================== */
  /* ======================================================================
     04 — SMOOTH SCROLL
     ====================================================================== */
  var lenis = null;
  function smoothScroll() {
    if (REDUCED || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 0.9,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      lerp: 0.12
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // expose velocity for kinetic skew
    var root = document.documentElement;
    gsap.ticker.add(function () {
      var v = clamp((lenis.velocity || 0) / 40, -1.5, 1.5);
      root.style.setProperty('--vel', v.toFixed(3));
    });

    // anchor links
    $$('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      a.addEventListener('click', function (e) {
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -40, duration: 1.4 });
        closeMenu();
      });
    });
  }

  function scrollToTop() {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ======================================================================
     05 — FILM LAYER
     Three real scientific images, one continuous camera move across each,
     cross-dissolving where the ranges overlap. Motion is 1:1 with scroll.
       01 compute   grid-computing cluster corridor, Fermilab (PD)
       02 axons     dense axon network, "Axons Al Dente"
       03 signal    scientific data wall read at human scale, DOE (PD)
     ====================================================================== */
  var film = (function () {
    var cv, ctx, veilEl, W = 0, H = 0, DPR = 1;
    var progress = 0, drawn = -1, raf = null, running = false;
    var labelEl = null, curBeat = -1, curPlace = 'hero';
    var FADE = 0.045;

    var SHOT = [
      /* corridor recedes to a vanishing point — push in along it, don't pan */
      { key: '01-compute',    a: 0.00, b: 0.37, label: 'Latent Space / 01 · Compute', dim: 0.06,
        from: { x: 0.62, y: 0.46, z: 1.06 }, to: { x: 0.40, y: 0.52, z: 1.58 } },
      { key: '02-axons',      a: 0.33, b: 0.71, label: 'Latent Space / 02 · The Network', dim: 0.00,
        from: { x: 0.70, y: 0.32, z: 1.05 }, to: { x: 0.34, y: 0.66, z: 1.72 } },
      /* track left-to-right across the data wall and settle on the figure */
      { key: '03-signal',     a: 0.67, b: 1.00, label: 'Latent Space / 03 · Signal', dim: 0.30,
        from: { x: 0.22, y: 0.52, z: 1.34 }, to: { x: 0.66, y: 0.46, z: 1.04 } }
    ];

    function theme() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    var started = {}, loaded = 0;
    function load(th) {
      if (started[th]) return;
      started[th] = true;
      SHOT.forEach(function (sh) {
        if (!sh.img) sh.img = {};
        var im = new Image();
        im.decoding = 'async';
        im.onload = im.onerror = function () { loaded++; drawn = -1; draw(); };
        im.src = 'assets/img/' + th + '/' + sh.key + '.jpg';
        sh.img[th] = im;
      });
    }
    function ready() { return Math.min(1, loaded / SHOT.length); }

    function pick(sh) {
      var th = theme();
      var a = sh.img && sh.img[th];
      if (a && a.complete && a.naturalWidth) return a;
      var o = sh.img && sh.img[th === 'dark' ? 'light' : 'dark'];
      return (o && o.complete && o.naturalWidth) ? o : null;
    }

    function resize() {
      if (!cv) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      if (!W || !H) return;
      cv.width = Math.round(W * DPR);
      cv.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      drawn = -1; draw();
    }

    /* opacity ramp so overlapping ranges cross-dissolve */
    function alphaOf(sh, t) {
      if (t < sh.a - FADE || t > sh.b + FADE) return 0;
      var v = 1;
      if (t < sh.a + FADE) v = Math.min(v, (t - (sh.a - FADE)) / (FADE * 2));
      if (t > sh.b - FADE) v = Math.min(v, ((sh.b + FADE) - t) / (FADE * 2));
      return clamp(v, 0, 1);
    }

    function paint(sh, t, alpha) {
      var img = pick(sh);
      if (!img || alpha <= 0.002) return;
      var p = clamp((t - sh.a) / (sh.b - sh.a), 0, 1);
      var e = p * p * (3 - 2 * p);                     /* ease the camera move */
      var cx = sh.from.x + (sh.to.x - sh.from.x) * e;
      var cy = sh.from.y + (sh.to.y - sh.from.y) * e;
      var cz = sh.from.z + (sh.to.z - sh.from.z) * e;

      var iw = img.naturalWidth, ih = img.naturalHeight;
      var sc = Math.max(W / iw, H / ih) * cz;
      var w = iw * sc, h = ih * sc;
      /* centre on the focal point, clamped so an edge never shows */
      var dx = Math.min(0, Math.max(W - w, W * 0.5 - cx * w));
      var dy = Math.min(0, Math.max(H - h, H * 0.5 - cy * h));

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, dx, dy, w, h);
      ctx.globalAlpha = 1;
    }

    function draw() {
      if (!W || !H || !ctx) return;
      var t = progress, i, act = [];
      for (i = 0; i < SHOT.length; i++) {
        var al = alphaOf(SHOT[i], t);
        if (al > 0) act.push([SHOT[i], al]);
      }
      ctx.clearRect(0, 0, W, H);
      /* earliest shot lays down opaque, later ones dissolve over it */
      for (i = 0; i < act.length; i++) paint(act[i][0], t, i === 0 ? 1 : act[i][1]);
    }

    function loop() {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (progress === drawn) return;
      drawn = progress;
      draw();
    }

    function setLabel(t) {
      var b = t < SHOT[1].a ? 0 : (t < SHOT[2].a ? 1 : 2);
      if (b === curBeat) return;
      curBeat = b;
      if (labelEl) labelEl.textContent = SHOT[b].label;
      place(curPlace);   /* the new plate may need a heavier veil than the last */
    }

    var VEIL = { hero: 0.40, feature: 0.48, margin: 0.76 };
    function place(name) {
      var v = VEIL[name];
      if (v === undefined) v = 0.6;
      /* the data-wall plate is far brighter than the other two and swallows the
         contact section outright without its own offset */
      v += (SHOT[curBeat] && SHOT[curBeat].dim) || 0;
      /* bone has far less contrast headroom than near-black, but the old +0.26
         clamped margin sections to 0.92 and effectively deleted the image.
         The landing plate is right where it is; everything from the mission
         down was washing out against the bone, so below the hero light mode
         gives the plate four points back. The veil is flat --void, so lifting
         it restores the plate's saturation and its contrast together. */
      if (theme() === 'light') v += (name === 'hero' ? 0.12 : 0.08);
      if (window.innerWidth <= 720) v += 0.12;
      /* the data-wall beat sits pinned at the ceiling in light mode, so the
         ceiling itself has to move for that beat to gain anything */
      if (veilEl) veilEl.style.opacity = String(Math.min(theme() === 'light' ? 0.86 : 0.90, v));
    }

    function init() {
      cv = $('#filmCanvas');
      veilEl = $('#filmVeil');
      labelEl = $('#filmLabel');
      if (!cv) return;
      ctx = cv.getContext('2d', { alpha: false });
      cv.classList.add('is-active');
      place('hero');
      setLabel(0);
      load(theme());
      window.addEventListener('stm:theme', function () {
        load(theme()); place(curPlace); drawn = -1; draw();
      });
      resize();
      window.addEventListener('resize', function () { resize(); place(curPlace); }, { passive: true });

      if (REDUCED) { progress = 0.15; setTimeout(function () { drawn = -1; draw(); }, 300); return; }
      running = true;
      raf = requestAnimationFrame(loop);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { cancelAnimationFrame(raf); running = false; }
        else if (!running) { running = true; raf = requestAnimationFrame(loop); }
      });
    }

    function bindScroll() {
      ScrollTrigger.create({
        trigger: document.body, start: 'top top', end: 'bottom bottom',
        onUpdate: function (self) {
          progress = self.progress;
          setLabel(self.progress);
          if (REDUCED) { drawn = -1; draw(); }
        }
      });
      $$('[data-film]').forEach(function (sec) {
        var name = sec.getAttribute('data-film');
        ScrollTrigger.create({
          trigger: sec, start: 'top 60%', end: 'bottom 40%',
          onToggle: function (self) { if (self.isActive) { curPlace = name; place(name); } }
        });
      });
    }

    return { init: init, bindScroll: bindScroll, ready: ready };
  })();
