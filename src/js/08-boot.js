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
  /* ======================================================================
     ANALYTICS WIRING

     Everything here is observation from the outside: delegated clicks and
     a ScrollTrigger per section. The only events fired from inside other
     parts are the ones this cannot see, namely the gate outcome, the theme
     toggle and the form result.

     Nothing sends anything unless content/site.js carries a clarityId.
     ====================================================================== */
  function analytics() {
    /* --- who is here, as filterable session properties --- */
    tag('theme_at_load', document.documentElement.getAttribute('data-theme') || 'dark');
    tag('reduced_motion', REDUCED ? 'yes' : 'no');
    tag('width_band', window.innerWidth < 720 ? 'phone'
                    : window.innerWidth < 1025 ? 'tablet' : 'desktop');
    tag('touch', ('ontouchstart' in window) ? 'yes' : 'no');
    try { tag('referrer', document.referrer ? new URL(document.referrer).hostname : 'direct'); } catch (e) {}

    /* --- how far down the page they got ---
       On a one-page site this is the whole engagement story: there are no
       other pages to visit, so the section reached IS the depth metric. */
    var deepest = 0;
    $$('main > section[id]').forEach(function (sec, i) {
      ScrollTrigger.create({
        trigger: sec, start: 'top 70%', once: true,
        onEnter: function () {
          track('reached_' + sec.id);
          if (i > deepest) { deepest = i; tag('deepest_section', sec.id); }
        }
      });
    });

    /* --- one delegated listener for every click worth counting --- */
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a, button') : null;
      if (!a) return;

      /* where on the page the click happened, reported alongside the link
         itself so the header LinkedIn icon and the contact row are not the
         same number */
      /* on a contact row the <i> is the heading (Email, LinkedIn, GitHub)
         and the <b> is the value, so here the <i> is what we want */
      if (a.classList.contains('chan__r')) {
        var h = a.querySelector('i');
        track('contact_row_' + slug(h ? h.textContent : 'row'));
      }
      else if (a.closest('.hdr__right'))   track('header_icon');

      /* leaving the site: which destination, and which project sent them */
      if (a.tagName === 'A' && a.hostname && a.hostname !== location.hostname) {
        var where = /github\.com/.test(a.hostname) ? 'github'
                  : /linkedin\.com/.test(a.hostname) ? 'linkedin'
                  : 'demo';
        track('outbound_' + where);
        tag('clicked_outbound', 'yes');
        var card = a.closest('.prj, .pcard');
        var t = card && card.querySelector('.prj__t, .pcard__t');
        if (t) track('outbound_from_' + slug(t.textContent));
        return;
      }
      if (a.href && a.href.indexOf('mailto:') === 0) { track('clicked_email'); return; }

      if (a.classList.contains('pfilter__b')) { track('filter_' + slug(label(a))); return; }
      if (a.closest('.hero__act'))   { track('hero_cta_' + slug(label(a))); return; }
      if (a.closest('.hdr__nav'))    { track('nav_' + slug(label(a))); return; }
      if (a.closest('.menu nav'))    { track('menu_nav_' + slug(label(a))); return; }
      if (a.id === 'burger')         { track('opened_menu'); return; }
      if (a.id === 'top-btn')        { track('back_to_top'); return; }
    }, true);

    /* --- did they start typing, even if they never sent it --- */
    var started = false;
    var form = $('#form');
    if (form) {
      form.addEventListener('focusin', function () {
        if (started) return;
        started = true;
        track('form_started');
        tag('started_a_message', 'yes');
      });
    }

    /* --- did they stay, or bounce --- */
    var landed = Date.now();
    [15, 60, 180].forEach(function (sec) {
      setTimeout(function () { track('stayed_' + sec + 's'); }, sec * 1000);
    });
    window.addEventListener('pagehide', function () {
      tag('seconds_on_page', Math.round((Date.now() - landed) / 1000));
    });
  }

  /* the nav and menu links carry their number in an <i>, and the contact
     rows carry their heading in one, so the visible label is everything
     except that child */
  function label(el) {
    var out = '';
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) out += n.nodeValue;
      else if (n.nodeType === 1 && n.tagName !== 'I' && n.tagName !== 'SVG') out += n.textContent;
    }
    return out.trim() || el.textContent;
  }

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);
  }

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
      analytics();
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
