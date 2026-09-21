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
