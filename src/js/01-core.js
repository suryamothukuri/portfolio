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

    /* the two --void values, kept here because the address-bar tint is the
       one colour that lives outside the stylesheet */
    var CHROME = { dark: '#07080B', light: '#DEDBD2' };

    function sync() {
      var dark = root.getAttribute('data-theme') !== 'light';
      btn.setAttribute('aria-pressed', String(!dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
      /* keep the phone browser's address bar on the same side as the page */
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', dark ? CHROME.dark : CHROME.light);
    }
    sync();

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      /* sessionStorage so the choice lasts the visit and no longer: see the
         no-flash script in src/templates/head.js */
      try { sessionStorage.setItem('stm-theme', next); } catch (e) {}
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
