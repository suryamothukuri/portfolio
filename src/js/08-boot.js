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
