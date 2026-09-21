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
