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
      if (!allOk) { status.textContent = 'Check the fields above'; track('form_invalid'); return; }

      btn.disabled = true;
      status.textContent = 'Sending...';
      status.classList.remove('is-sent');
      track('form_submitted');

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
        track('form_delivered');
        tag('sent_a_message', 'yes');
        if (!REDUCED) gsap.fromTo(status, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' });
        setTimeout(function () {
          status.classList.remove('is-sent');
          status.textContent = '';
        }, 9000);
      }).catch(function () {
        track('form_failed');
        btn.disabled = false;
        status.classList.remove('is-sent');
        status.innerHTML = 'Something broke. Email me directly: <a href="mailto:suryamothuk23@gmail.com" style="color:var(--ember)">suryamothuk23@gmail.com</a>';
      });
    });

    /* copy-to-clipboard on the email channel row */
    var copyRow = $('.chan__r[data-copy]');
    if (copyRow && navigator.clipboard) {
      copyRow.addEventListener('click', function () {
        /* a denied or unavailable clipboard rejects, and with nothing
           attached that surfaces as an unhandled rejection in the console */
        navigator.clipboard.writeText(copyRow.dataset.copy)
          .then(function () { toast('Copied'); })
          .catch(function () { track('copy_blocked'); });
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
