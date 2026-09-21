/* script.js
   GENERATED FILE. Do not edit: the next build overwrites it.
   Change content/ or src/ instead, then run `npm run build`. */

/* ========================================================================
   Closure, shared helpers, theme toggle, grain.

   This file opens the closure that every other part lives inside, so it has
   to come first: REDUCED, DESKTOP, $, $$ and clamp are declared here and
   used everywhere.
   ======================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DESKTOP = function () { return window.innerWidth >= 1025; };
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  /* ======================================================================
     01 — THEME
     ====================================================================== */
  function theme() {
    var btn = $('#themeToggle');
    if (!btn) return;
    var root = document.documentElement;

    function sync() {
      var dark = root.getAttribute('data-theme') !== 'light';
      btn.setAttribute('aria-pressed', String(!dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
    }
    sync();

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('stm-theme', next); } catch (e) {}
      sync();
      window.dispatchEvent(new CustomEvent('stm:theme', { detail: next }));
    });
  }

  /* ======================================================================
     02 — GRAIN (generated, no binary asset)
     ====================================================================== */
  function grain() {
    var el = $('.grain');
    if (!el) return;
    var s = 180, c = document.createElement('canvas');
    c.width = c.height = s;
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(s, s), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    el.style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
  }

  /* ======================================================================
     The intro puzzle.

     Two clocks: a 45s failsafe before the step is placed so nobody can be
     trapped, then a 7s auto-enter once it is. The travelling pulse dies at the
     empty socket, which is the whole instruction.
     ====================================================================== */
  /* ======================================================================
     03 — GATE
     Close the agent loop, read a fact, click to enter.
     The film keeps preloading underneath; the bar along the bottom shows it.
     ====================================================================== */
  function gate(done) {
    var el = $('#gate');
    if (!el || REDUCED) { if (el) el.remove(); done(); return; }

    var chip = $('#gateChip'), slot = $('#gateSlot'), step = $('#gateStep');
    var factBox = $('#gateFact'), factText = $('#gateFactText');
    var skip = $('#gateSkip'), load = $('#gateLoad'), hint = $('#gateHint');
    var solved = false, entered = false;
    /* two separate clocks. Before the step is placed, the long failsafe only
       exists so nobody can be trapped here. Once it is placed, the fact is on
       screen and the gate releases itself after AUTO_MS whether or not anyone
       clicks; a click just gets there sooner. */
    var AUTO_MS = 7000, idleOut = null, autoOut = null;

    /* the film is still decoding behind the gate */
    var loadTimer = setInterval(function () {
      if (load) load.style.width = Math.round(film.ready() * 100) + '%';
    }, 120);

    function enter() {
      if (entered) return;
      entered = true;
      clearInterval(loadTimer);
      clearTimeout(idleOut); clearTimeout(autoOut);
      if (pulseTl) { pulseTl.kill(); pulseTl = null; }
      el.classList.add('is-done');
      setTimeout(function () { el.remove(); }, 750);
      done();
    }

    /* The pulse is the instruction. On an open loop it runs Observe to Reason,
       reaches the empty socket and dies there; once the step is back it runs
       all four segments without a break. Nothing else tells the visitor where
       the piece goes. */
    var pulseTl = null, loopEl = $('#gateLoop'), vbw = 360;
    function pulse(closed) {
      if (!loopEl || !window.gsap) return;
      if (pulseTl) { pulseTl.kill(); pulseTl = null; }
      var segs = (closed ? ['gseg1', 'gseg2', 'gseg3', 'gseg4'] : ['gseg1', 'gseg2'])
        .map(function (id) { return document.getElementById(id); })
        .filter(Boolean);
      if (!segs.length) return;
      var dot = loopEl.querySelector('.gate__spark');
      if (!dot) {
        dot = document.createElement('i');
        dot.className = 'gate__spark';
        loopEl.appendChild(dot);
      }
      /* the box only changes on resize, so measuring per frame would be waste */
      var sc = loopEl.getBoundingClientRect().width / vbw;
      window.addEventListener('resize', function () {
        if (loopEl.isConnected) sc = loopEl.getBoundingClientRect().width / vbw;
      });
      var tl = gsap.timeline({ repeat: -1, repeatDelay: closed ? 0.2 : 0.8 });
      tl.set(dot, { opacity: 0, scale: 1 });
      tl.to(dot, { opacity: 1, duration: 0.16 });
      segs.forEach(function (a) {
        var len = a.getTotalLength();
        tl.to({ t: 0 }, {
          t: 1, duration: 0.6, ease: 'none',
          onUpdate: function () {
            var pt = a.getPointAtLength(this.targets()[0].t * len);
            dot.style.left = (pt.x * sc) + 'px';
            dot.style.top  = (pt.y * sc) + 'px';
          }
        });
      });
      if (!closed) tl.to(dot, { opacity: 0, scale: 0.35, duration: 0.42, ease: 'power2.in' });
      pulseTl = tl;
    }
    pulse(false);

    function solve() {
      if (solved) return;
      solved = true;
      slot.classList.remove('is-over');
      slot.classList.add('is-filled');
      slot.innerHTML = '<b>03</b>Act';
      el.classList.add('is-solved');
      chip.classList.add('is-gone');
      chip.setAttribute('aria-hidden', 'true');
      chip.tabIndex = -1;
      if (hint) hint.setAttribute('aria-hidden', 'true');
      pulse(true);

      var list = (window.STM_FACTS && window.STM_FACTS.length) ? window.STM_FACTS : null;
      if (list) factText.textContent = list[Math.floor(Math.random() * list.length)];
      else factText.textContent = 'Most production machine learning is data engineering wearing a different job title.';

      if (step) step.style.opacity = '0';
      factBox.hidden = false;
      /* the fact used to take 1.15s to arrive, which is a sixth of the seven
         seconds it now has on screen; it comes in faster so the reading time
         is actually there */
      gsap.from(factBox, { opacity: 0, y: 16, duration: 0.6, ease: 'expo.out', delay: 0.55 });
      gsap.fromTo(slot, { scale: 0.88 }, { scale: 1, duration: 0.5, ease: 'back.out(2.4)' });

      /* anything at all gets you in from here */
      setTimeout(function () {
        el.addEventListener('click', enter);
        window.addEventListener('keydown', enter, { once: true });
      }, 1500);

      /* the long failsafe is done: from here the seven-second clock owns it */
      clearTimeout(idleOut);
      var bar = $('#gateCount');
      if (bar) gsap.fromTo(bar, { width: '0%' },
        { width: '100%', duration: AUTO_MS / 1000, ease: 'none' });
      autoOut = setTimeout(enter, AUTO_MS);
    }

    /* pointer drag — one handler covers mouse, pen and touch */
    var dx = 0, dy = 0, dragging = false;
    chip.addEventListener('pointerdown', function (e) {
      if (solved) return;
      dragging = true;
      chip.setPointerCapture(e.pointerId);
      chip.classList.add('is-dragging');
      var r = chip.getBoundingClientRect();
      dx = e.clientX - (r.left + r.width / 2);
      dy = e.clientY - (r.top + r.height / 2);
    });
    chip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var r = chip.getBoundingClientRect();
      var home = chip._home || (chip._home = { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      chip.style.transform = 'translate(' + (e.clientX - dx - home.x) + 'px,' + (e.clientY - dy - home.y) + 'px)';
      var s = slot.getBoundingClientRect();
      var near = e.clientX > s.left - 40 && e.clientX < s.right + 40 &&
                 e.clientY > s.top - 40 && e.clientY < s.bottom + 40;
      slot.classList.toggle('is-over', near);
    });
    function release(e) {
      if (!dragging) return;
      dragging = false;
      chip.classList.remove('is-dragging');
      var s = slot.getBoundingClientRect();
      var hit = e.clientX > s.left - 40 && e.clientX < s.right + 40 &&
                e.clientY > s.top - 40 && e.clientY < s.bottom + 40;
      if (hit) solve();
      else {
        slot.classList.remove('is-over');
        gsap.to(chip, { x: 0, y: 0, clearProps: 'transform', duration: 0.5, ease: 'expo.out' });
      }
    }
    chip.addEventListener('pointerup', release);
    chip.addEventListener('pointercancel', release);
    /* keyboard and assistive tech get the same outcome without a drag */
    chip.addEventListener('click', function () { if (!dragging) solve(); });

    if (skip) skip.addEventListener('click', function (e) { e.stopPropagation(); enter(); });

    /* never trap anyone: if the step is still unplaced after 45s, open it */
    idleOut = setTimeout(enter, 45000);
  }

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

  /* ======================================================================
     Text splitting, the hero intro, and the counting figures.

     The splitter wraps words, characters and lines in masked spans so they can
     be revealed from behind an edge. It runs before the reveals that use it.
     ====================================================================== */
  /* ======================================================================
     06 — TEXT SPLITTING
     ====================================================================== */
  function splitWords(el) {
    if (el.dataset.done) return [];
    var html = el.innerHTML;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var out = document.createDocumentFragment();
    var spans = [];
    var pending = false;

    function walk(node, tag) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            /* preserve original whitespace exactly — never invent a space */
            if (/^\s+$/.test(w)) { out.appendChild(document.createTextNode(' ')); pending = true; return; }
            var wrap = document.createElement('span');
            wrap.className = 'split-w';
            /* remember whether a space actually preceded this word, so a later
               line rebuild can restore it without inventing one before punctuation */
            if (pending) wrap.dataset.sp = '1';
            pending = false;
            var inner = document.createElement(tag || 'span');
            inner.textContent = w;
            wrap.appendChild(inner);
            out.appendChild(wrap);
            spans.push(inner);
          });
        } else if (n.nodeType === 1) {
          if (n.tagName === 'BR') { out.appendChild(document.createElement('br')); pending = true; return; }
          /* keep em / strong emphasis through the split */
          var t = n.tagName === 'EM' ? 'em' : (n.tagName === 'STRONG' ? 'strong' : tag);
          walk(n, t);
        }
      });
    }
    walk(tmp, null);
    el.innerHTML = '';
    el.appendChild(out);
    el.dataset.done = '1';
    return spans;
  }

  function splitChars(el) {
    if (el.dataset.done) return [];
    var text = el.textContent, frag = document.createDocumentFragment(), spans = [];
    /* each character becomes its own inline-block, and a line can break between
       any two of them — so keep each word in a nowrap group or titles split
       mid-word ("AI Clinical Trial M / atching Assistant") */
    var word = null;
    text.split('').forEach(function (ch) {
      if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); word = null; return; }
      if (!word) {
        word = document.createElement('span');
        word.className = 'split-cw';
        frag.appendChild(word);
      }
      var wrap = document.createElement('span');
      wrap.className = 'split-c';
      var inner = document.createElement('span');
      inner.textContent = ch;
      wrap.appendChild(inner);
      word.appendChild(wrap);
      spans.push(inner);
    });
    el.innerHTML = '';
    el.appendChild(frag);
    el.dataset.done = '1';
    return spans;
  }

  /* split a block into visual lines after layout, for masked line reveals */
  function splitLines(el) {
    if (el.dataset.done) return [];
    var words = splitWords(el);
    if (!words.length) return [];
    var lines = [], cur = null, lastTop = null;
    words.forEach(function (w) {
      var top = Math.round(w.parentNode.offsetTop);
      if (lastTop === null || Math.abs(top - lastTop) > 4) { cur = []; lines.push(cur); lastTop = top; }
      cur.push(w.parentNode);
    });
    /* rebuild as line wrappers */
    var frag = document.createDocumentFragment(), inners = [];
    lines.forEach(function (ws) {
      var line = document.createElement('span');
      line.className = 'rv-line';
      var inner = document.createElement('span');
      ws.forEach(function (w, i) {
        if (i > 0 && w.dataset.sp === '1') inner.appendChild(document.createTextNode(' '));
        while (w.firstChild) inner.appendChild(w.firstChild);
      });
      /* trailing space keeps words from fusing across the line break on copy */
      inner.appendChild(document.createTextNode(' '));
      line.appendChild(inner);
      frag.appendChild(line);
      inners.push(inner);
    });
    el.innerHTML = '';
    el.appendChild(frag);
    return inners;
  }

  /* ======================================================================
     07 — HERO
     ====================================================================== */
  function hero() {
    var title = $('.hero__name');
    if (!title) return;
    var words = splitWords(title);

    if (REDUCED) { gsap.set(words, { y: 0, opacity: 1 }); return; }

    gsap.set(words, { yPercent: 150, rotateX: -22 });
    gsap.set('[data-hero]', { opacity: 0, y: 22 });

    var tl = gsap.timeline({ delay: 0.05 });
    tl.to('[data-hero="1"]', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' });
    tl.to(words, { yPercent: 0, rotateX: 0, duration: 1.1, stagger: 0.055, ease: 'expo.out' }, '-=0.45');
    tl.to('[data-hero="2"]', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.75');
    tl.to('[data-hero="3"]', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.62');
    tl.to('[data-hero="4"]', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.6');

    /* velocity skew */
    if (DESKTOP()) {
      gsap.ticker.add(function () {
        var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--vel')) || 0;
        title.style.transform = 'skewY(' + (v * 0.5).toFixed(2) + 'deg)';
      });
    }

    /* hero parallax out */
    gsap.to('.hero__inner', {
      yPercent: -14, opacity: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.4 }
    });
  }

  /* ======================================================================
     08 — COUNT-UPS
     ====================================================================== */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.dataset.count || '0');
    var dec = parseInt(el.dataset.dec || '0', 10);
    var pre = el.dataset.prefix || '';
    var suf = el.dataset.suffix || '';

    var numNode = document.createElement('span');
    var supNode = null;
    el.textContent = '';
    if (pre) el.appendChild(document.createTextNode(pre));
    el.appendChild(numNode);
    if (suf) {
      supNode = document.createElement('sup');
      supNode.textContent = suf;
      supNode.style.opacity = '0';
      el.appendChild(supNode);
    }

    var o = { v: 0 };
    if (REDUCED) {
      numNode.textContent = target.toFixed(dec);
      if (supNode) supNode.style.opacity = '1';
      return;
    }
    gsap.to(o, {
      v: target, duration: 1.6, ease: 'expo.out',
      onUpdate: function () { numNode.textContent = o.v.toFixed(dec); },
      onComplete: function () {
        numNode.textContent = target.toFixed(dec);
        if (supNode) gsap.to(supNode, { opacity: 1, duration: 0.45, ease: 'power2.out' });
      }
    });
  }

  function stats() {
    var track = $('#statsTrack');
    if (!track) return;

    ScrollTrigger.create({
      trigger: '.stats', start: 'top 85%', once: true,
      onEnter: function () {
        $$('.stat__n', track).forEach(function (n, i) {
          gsap.delayedCall(i * 0.12, function () { countUp(n); });
        });
      }
    });

    /* metric counters elsewhere */
    $$('.prj__m span, .edu__gpa span').forEach(function (n) {
      ScrollTrigger.create({ trigger: n, start: 'top 90%', once: true,
        onEnter: function () { countUp(n); } });
    });

  }

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

  /* ======================================================================
     The projects section.

     VIZ holds the two diagrams. They draw each project's actual mechanism, not
     invented results: the retrieval funnel and the materiality function.
     The filter builds its buttons from the data-cat values in the markup.
     ====================================================================== */
  /* ======================================================================
     12 — WORK
     ====================================================================== */
  function work() {
    $$('.prj__t').forEach(function (t) {
      var chars = splitChars(t);
      if (!chars.length || REDUCED) return;
      gsap.set(chars, { yPercent: 150 });
      gsap.to(chars, {
        yPercent: 0, duration: 0.9, stagger: 0.022, ease: 'expo.out',
        scrollTrigger: { trigger: t, start: 'top 84%', once: true }
      });
    });

    if (REDUCED) return;
    gsap.matchMedia().add('(min-width: 1025px)', function () {
      $$('.prj__n').forEach(function (n) {
        gsap.fromTo(n, { yPercent: -30 }, {
          yPercent: -70, ease: 'none',
          scrollTrigger: { trigger: n.closest('.prj'), start: 'top bottom', end: 'bottom top', scrub: 0.5 }
        });
      });
    });
  }


  /* ======================================================================
     12 — PROJECT PANELS
     Both graphics are the project's own mechanism, not invented results:
     DriftLens plots its actual materiality function, and the clinical agent
     draws the LangGraph state machine described in its README.
     ====================================================================== */
  var VIZ = {
    trial: {
      graph: 'funnel',
      graphTitle: 'Two-stage retrieval',
      graphNote: 'narrowing',
      flow: [
        [{ t: 'Groq', s: 'tier 1' }, { t: 'Gemini', s: 'tier 2' }, { t: 'Ollama', s: 'local' }],
        [{ t: 'Qdrant', s: 'vector search' }, { t: 'Cross-encoder', s: 'rerank' }],
        [{ t: 'PostgreSQL 16', s: 'studies · eligibility · locations' }],
        [{ t: 'Airflow DAG', s: 'nightly sync + live v2 fallback, 2 to 3s' }]
      ]
    },
    drift: {
      graph: 'materiality',
      graphTitle: 'Materiality scoring',
      graphNote: '|Δi| · log(1+n)',
      flow: [
        [{ t: 'SEC EDGAR', s: '10-K Item 1A · rate-limited 8 req/s' }],
        [{ t: 'bge-small-en-v1.5', s: '512-token window · 50-token overlap', acc: true }],
        [{ t: 'UMAP', s: 'reduce' }, { t: 'HDBSCAN', s: 'themes · 5 to 15% noise' }],
        [{ t: 'Ollama qwen2.5', s: 'grounded, excerpt-only explanations' }],
        [{ t: 'DuckDB-Wasm + Streamlit', s: 'static Parquet · $0 at request time' }]
      ]
    }
  };

  /* materiality = |intensity_delta| × log(1 + chunk_count), the function
     DriftLens actually ranks by — drawn for three deltas so the log damping
     that stops a 1-paragraph theme outranking a 15-paragraph one is visible */
  function svgMateriality() {
    var W = 300, H = 132, L = 30, B = 22, T = 10, R = 8;
    var NMAX = 24, deltas = [0.30, 0.20, 0.10];
    var ymax = 0.30 * Math.log(1 + NMAX);
    var px = function (n) { return L + (n / NMAX) * (W - L - R); };
    var py = function (v) { return H - B - (v / ymax) * (H - B - T); };
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Materiality against chunk count">';
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      out += '<line class="ax" x1="' + L + '" y1="' + py(ymax * f).toFixed(1) + '" x2="' + (W - R) + '" y2="' + py(ymax * f).toFixed(1) + '"/>';
    });
    out += '<line class="ax" x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '"/>';
    deltas.forEach(function (d, i) {
      var pts = [];
      for (var n = 0; n <= NMAX; n += 0.5) pts.push(px(n).toFixed(1) + ',' + py(d * Math.log(1 + n)).toFixed(1));
      out += '<polyline class="ln' + (i ? ' dim' : '') + '" points="' + pts.join(' ') + '" stroke-dasharray="900" stroke-dashoffset="900"/>';
      out += '<text x="' + (W - R) + '" y="' + (py(d * Math.log(1 + NMAX)) - 3).toFixed(1) + '" font-size="7" text-anchor="end" letter-spacing="0.6">Δ' + d.toFixed(2) + '</text>';
    });
    [1, 8, 16, 24].forEach(function (n) {
      out += '<text x="' + px(n).toFixed(1) + '" y="' + (H - 8) + '" font-size="7" text-anchor="middle" letter-spacing="0.8">' + n + '</text>';
    });
    out += '<text x="0" y="' + (T + 6) + '" font-size="7" letter-spacing="0.8">SCORE</text>';
    out += '<text x="' + (W / 2) + '" y="' + H + '" font-size="7" text-anchor="middle" letter-spacing="0.8">PARAGRAPHS IN THEME</text>';
    return out + '</svg>';
  }

  /* Two-stage retrieval, which is the distinctive thing the engine does: a
     wide vector candidate pool narrowed by a cross-encoder, then by structured
     eligibility. Widths are proportional to stage, not to measured counts. */
  function svgFunnel() {
    var W = 300, H = 158, top = 16, rowH = 30, gap = 6;
    var rows = [
      { t: 'QDRANT VECTOR SEARCH', s: 'bi-encoder, pre-indexed', w: 1.00 },
      { t: 'CROSS-ENCODER RERANK', s: 'query and trial read together', w: 0.72 },
      { t: 'ELIGIBILITY FILTER', s: 'age, sex, location, phase', w: 0.46 },
      { t: 'MATCHED TRIALS', s: 'returned to the patient', w: 0.38, hi: true }
    ];
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Two-stage retrieval funnel">';
    rows.forEach(function (r, i) {
      var w = r.w * W, x = (W - w) / 2, y = top + i * (rowH + gap);
      out += '<g class="fun' + (r.hi ? ' hi' : '') + '">';
      out += '<rect class="funbar" x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + rowH + '" rx="2" data-x="' + x.toFixed(1) + '" data-w="' + w.toFixed(1) + '"/>';
      out += '<text x="' + (W / 2) + '" y="' + (y + 12) + '" font-size="7.5" text-anchor="middle" letter-spacing="1">' + r.t + '</text>';
      out += '<text class="sub" x="' + (W / 2) + '" y="' + (y + 23) + '" font-size="6.5" text-anchor="middle" letter-spacing="0.5">' + r.s + '</text>';
      out += '</g>';
      if (i < rows.length - 1) {
        var ny = y + rowH, my = ny + gap / 2;
        out += '<path class="funarrow" d="M' + (W / 2) + ' ' + ny + ' L' + (W / 2) + ' ' + my + '"/>';
      }
    });
    return out + '</svg>';
  }

  function projectViz() {
    $$('.prj__viz').forEach(function (host) {
      var spec = VIZ[host.getAttribute('data-viz')];
      if (!spec) return;

      var g = document.createElement('div');
      g.className = 'viz';
      g.innerHTML = '<div class="viz__head"><span class="viz__t">' + spec.graphTitle +
                    '</span><span class="viz__note">' + spec.graphNote + '</span></div>' +
                    (spec.graph === 'funnel' ? svgFunnel() : svgMateriality());
      host.appendChild(g);

      var flow = document.createElement('div');
      flow.className = 'viz';
      var fh = '<div class="viz__head"><span class="viz__t">Stack</span></div>';
      spec.flow.forEach(function (row, i) {
        if (i) fh += '<div class="flow__c"></div>';
        fh += '<div class="flow__row">' + row.map(function (n) {
          return '<div class="flow__n' + (n.acc ? ' acc' : '') + '"><b>' + n.t + '</b>' + n.s + '</div>';
        }).join('') + '</div>';
      });
      flow.innerHTML = fh;
      host.appendChild(flow);

      if (REDUCED) {
        $$('polyline.ln', g).forEach(function (l) { l.style.strokeDashoffset = 0; });
        return;
      }
      ScrollTrigger.create({
        trigger: host, start: 'top 78%', once: true,
        onEnter: function () {
          var lines = $$('polyline.ln', g);
          if (lines.length) gsap.to(lines, { strokeDashoffset: 0, duration: 1.5, stagger: 0.14, ease: 'power2.out' });
          var bars = $$('rect.funbar', g);
          if (bars.length) {
            gsap.from(bars, { scaleX: 0, transformOrigin: '50% 50%', duration: 0.7, stagger: 0.1, ease: 'expo.out' });
            gsap.from($$('.fun text', g), { opacity: 0, duration: 0.4, stagger: 0.1, delay: 0.2 });
          }
          gsap.from($$('.flow__row', flow), { opacity: 0, y: 14, duration: 0.55, stagger: 0.07, ease: 'power2.out' });
        }
      });
    });
  }

  /* ======================================================================
     12b — PROJECT FILTER
     Buttons are derived from the cards present, so adding a project with a
     new data-cat adds its button with no further wiring.
     ====================================================================== */
  function projectFilter() {
    var bar = $('#pfilter'), grid = $('#pgrid');
    if (!bar || !grid) return;
    var cards = $$('.pcard', grid);
    if (!cards.length) return;

    var cats = [];
    cards.forEach(function (c) {
      var k = c.getAttribute('data-cat');
      if (k && cats.indexOf(k) === -1) cats.push(k);
    });

    function build(label, value) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pfilter__b';
      b.textContent = label;
      b.setAttribute('aria-pressed', value === 'all' ? 'true' : 'false');
      if (value === 'all') b.classList.add('is-on');
      b.addEventListener('click', function () {
        $$('.pfilter__b', bar).forEach(function (o) {
          o.classList.remove('is-on'); o.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true');
        cards.forEach(function (c) {
          var show = value === 'all' || c.getAttribute('data-cat') === value;
          c.hidden = !show;
        });
        /* the grid just changed height under a pinned/scrubbed page */
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
      bar.appendChild(b);
    }

    build('All', 'all');
    cats.forEach(function (c) { build(c, c); });
  }

  /* ======================================================================
     Cursor, header, menu, contact form, footer clock.

     FORM_ENDPOINT is in here. It is the one piece of configuration that did
     not go into content/, because it is set once and never edited.
     ====================================================================== */
  /* ======================================================================
     13 — CURSOR
     ====================================================================== */
  function cursor() {
    if (REDUCED) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var cur = $('#cursor');
    if (!cur) return;

    /* The dot replaces the native pointer rather than chasing it, and is
       positioned straight from the event — no lerp, no ticker, so there is
       exactly one thing on screen and it never trails the mouse. */
    document.documentElement.classList.add('has-reticle');

    var shown = false;
    function move(e) {
      cur.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      if (!shown) { shown = true; cur.style.opacity = '1'; }
    }
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('dragover', move, { passive: true });

    /* leaving the window or dropping into an iframe must not strand it */
    document.addEventListener('mouseleave', function () { cur.style.opacity = '0'; shown = false; });
    document.addEventListener('mouseenter', function () { cur.style.opacity = '1'; shown = true; });
    window.addEventListener('mousedown', function () { cur.classList.add('is-down'); });
    window.addEventListener('mouseup', function () { cur.classList.remove('is-down'); });

    /* delegated, so it also covers anything rendered after load (viz panels,
       the split-text spans) */
    var HOT = 'a, button, input, textarea, select, summary, label, [data-cursor]';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(HOT)) cur.classList.add('is-hot');
    }, { passive: true });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(HOT) &&
          !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(HOT))) {
        cur.classList.remove('is-hot');
      }
    }, { passive: true });
  }

  /* ======================================================================
     14 — HEADER / MENU
     ====================================================================== */
  function closeMenu() {
    var menu = $('#menu'), burger = $('#burger');
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (burger) { burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  function header() {
    var hdr = $('#hdr'), burger = $('#burger'), menu = $('#menu');

    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: function (self) { hdr.classList.toggle('is-stuck', self.scroll() > 80); },
      onRefresh: function (self) { hdr.classList.toggle('is-stuck', self.scroll() > 80); }
    });

    if (burger && menu) {
      burger.addEventListener('click', function () {
        var open = !menu.classList.contains('is-open');
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-hidden', String(!open));
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (lenis) { open ? lenis.stop() : lenis.start(); }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    var progressBar = $('#progressBar');
    if (progressBar) {
      ScrollTrigger.create({
        trigger: document.body, start: 'top top', end: 'bottom bottom',
        onUpdate: function (self) { progressBar.style.transform = 'scaleX(' + self.progress + ')'; }
      });
    }

    var topBtn = $('#top-btn');
    if (topBtn) topBtn.addEventListener('click', scrollToTop);
  }

  /* ======================================================================
     15 — CONTACT FORM
     ====================================================================== */
  var FORM_ENDPOINT = 'https://formspree.io/f/mojkradr';

  function form() {
    var f = $('#form');
    if (!f) return;
    var status = $('#fStatus'), btn = $('#fSend');
    var fields = [
      { el: $('#fName'), err: $('#eName'), test: function (v) { return v.trim().length >= 2; }, msg: 'Enter your name' },
      { el: $('#fEmail'), err: $('#eEmail'), test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: 'Enter a valid email' },
      { el: $('#fMsg'), err: $('#eMsg'), test: function (v) { return v.trim().length >= 10; }, msg: 'A little more detail, please' }
    ];

    /* auto-grow textarea */
    var ta = $('#fMsg');
    if (ta) {
      var grow = function () { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 320) + 'px'; };
      ta.addEventListener('input', grow);
      grow();
    }

    function validate(fd, show) {
      var ok = fd.test(fd.el.value);
      if (show) {
        fd.el.parentNode.classList.toggle('has-error', !ok);
        fd.err.textContent = ok ? '' : fd.msg;
        fd.el.setAttribute('aria-invalid', String(!ok));
      }
      return ok;
    }

    fields.forEach(function (fd) {
      if (!fd.el) return;
      fd.el.addEventListener('blur', function () { validate(fd, true); });
      fd.el.addEventListener('input', function () {
        if (fd.el.parentNode.classList.contains('has-error')) validate(fd, true);
      });
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var allOk = fields.map(function (fd) { return validate(fd, true); }).every(Boolean);
      if (!allOk) { status.textContent = 'Check the fields above'; return; }

      btn.disabled = true;
      status.textContent = 'Sending...';
      status.classList.remove('is-sent');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(f)
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        /* clear the fields but keep the form usable, so a second message is
           possible without a reload */
        f.reset();
        fields.forEach(function (fd) {
          if (!fd.el) return;
          fd.el.parentNode.classList.remove('has-error');
          fd.el.removeAttribute('aria-invalid');
          if (fd.err) fd.err.textContent = '';
        });
        if (ta) { ta.style.height = 'auto'; }
        btn.disabled = false;
        status.classList.add('is-sent');
        status.textContent = 'Thank you. I will be in touch with you soon.';
        if (!REDUCED) gsap.fromTo(status, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
        setTimeout(function () {
          status.classList.remove('is-sent');
          status.textContent = '';
        }, 9000);
      }).catch(function () {
        btn.disabled = false;
        status.classList.remove('is-sent');
        status.innerHTML = 'Something broke. Email me directly: <a href="mailto:suryamothuk23@gmail.com" style="color:var(--ember)">suryamothuk23@gmail.com</a>';
      });
    });

    /* copy-to-clipboard on the email channel row */
    var copyRow = $('.chan__r[data-copy]');
    if (copyRow && navigator.clipboard) {
      copyRow.addEventListener('click', function () {
        navigator.clipboard.writeText(copyRow.dataset.copy).then(function () { toast('Copied'); });
      });
    }
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-on'); }, 1800);
  }

  /* ======================================================================
     16 — FOOTER
     ====================================================================== */
  function footer() {
    var clock = $('#clock');
    if (clock) {
      var tick = function () {
        try {
          clock.textContent = new Date().toLocaleTimeString('en-US', {
            timeZone: 'America/New_York', hour12: false,
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }) + ' EST';
        } catch (e) { clock.textContent = new Date().toLocaleTimeString(); }
      };
      tick();
      setInterval(tick, 1000);
    }
  }

  /* ======================================================================
     The portrait, then start everything.

     boot() is the only place any of the above is called, and this file closes
     the closure that 01-core opened, so it has to come last.
     ====================================================================== */
  /* ======================================================================
     17 — HERO PORTRAIT
     Only revealed once the file actually decodes, so the hero looks finished
     rather than broken while assets/photo.jpg has not been added yet.
     ====================================================================== */
  function portrait() {
    var fig = $('#portrait');
    if (!fig) return;
    var img = fig.querySelector('img');
    if (!img) return;
    function show() {
      if (!img.naturalWidth) return;
      /* deliberately not a [data-hero] element: that hook zeroes opacity on
         everything it matches and only animates the four it knows about, which
         left the portrait stranded at opacity 0 */
      fig.classList.add('is-ready');
      fig.removeAttribute('aria-hidden');
      img.alt = 'Surya Teja Mothukuri';
    }
    function drop() { fig.remove(); }
    if (img.complete) { img.naturalWidth ? show() : drop(); }
    else { img.addEventListener('load', show); img.addEventListener('error', drop); }
  }

  /* ======================================================================
     BOOT
     ====================================================================== */
  function boot() {
    if (typeof gsap === 'undefined') { document.documentElement.classList.add('no-js'); return; }
    gsap.registerPlugin(ScrollTrigger);

    grain();
    theme();
    film.init();

    gate(function () {
      smoothScroll();
      header();
      hero();
      reveals();
      stats();
      skillRules();
      timeline();
      work();
      projectViz();
      projectFilter();
      cursor();
      form();
      footer();
      portrait();
      film.bindScroll();

      ScrollTrigger.refresh();
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });

    var rt = null;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { ScrollTrigger.refresh(); }, 250);
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
