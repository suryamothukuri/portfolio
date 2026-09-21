/* The fixed header and the phone menu. Both number themselves from the
   order of site.nav and site.menu, so adding a link needs no other change.

   The three icons are inline SVG rather than an icon font: three paths is
   less weight than any font file, and they inherit currentColor so the
   theme toggle needs no second copy. */

var u = require('./util');
var e = u.e, a = u.a, pad = u.pad;

var ICON = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3.2 9h3.6v12H3.2zM10 9h3.45v1.64h.05c.48-.9 1.66-1.85 3.42-1.85 3.66 0 4.33 2.28 4.33 5.25V21h-3.6v-5.5c0-1.31-.02-3-1.9-3-1.9 0-2.19 1.42-2.19 2.9V21H10z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.9 3.17 9.06 7.57 10.53.55.1.75-.24.75-.53v-1.9c-3.08.67-3.73-1.48-3.73-1.48-.5-1.28-1.23-1.62-1.23-1.62-1-.69.08-.67.08-.67 1.11.08 1.7 1.14 1.7 1.14.99 1.7 2.6 1.21 3.23.92.1-.72.39-1.21.7-1.49-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.98-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.14a10.5 10.5 0 0 1 5.56 0c2.12-1.44 3.05-1.14 3.05-1.14.6 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.6 5.2-5.07 5.47.4.35.76 1.03.76 2.08v3.08c0 .29.2.64.76.53 4.4-1.47 7.56-5.63 7.56-10.53C23.1 5.33 18.27.5 12 .5z"/></svg>',
  sun: '<svg class="toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><g><path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M19.4 4.6l-2.1 2.1M6.7 17.3l-2.1 2.1"/></g></svg>',
  moon: '<svg class="toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>'
};

function link(item, i) {
  return '    <a href="' + a(item.href) + '"><i>' + pad(i + 1) + '</i>' + e(item.label) + '</a>';
}

module.exports = function header(site) {
  return [
    '<header class="hdr" id="hdr">',
    '  <a class="hdr__mark" href="#top">' + e(site.name) + '</a>',
    '  <nav class="hdr__nav" aria-label="Primary">',
    site.nav.map(link).join('\n'),
    '  </nav>',
    '  <div class="hdr__right">',
    '    <a class="hdr__ico" href="' + a(site.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn">',
    '      ' + ICON.linkedin,
    '    </a>',
    '    <a class="hdr__ico" href="' + a(site.github) + '" target="_blank" rel="noopener" aria-label="GitHub">',
    '      ' + ICON.github,
    '    </a>',
    '    <button class="toggle" id="themeToggle" type="button" aria-label="Switch to light theme" aria-pressed="false">',
    '      ' + ICON.sun,
    '      ' + ICON.moon,
    '    </button>',
    '    <button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>',
    '  </div>',
    '</header>',
    '',
    '<div class="menu" id="menu" aria-hidden="true">',
    '  <nav aria-label="Mobile">',
    site.menu.map(link).join('\n'),
    '  </nav>',
    '  <div class="menu__foot">',
    '    <a href="mailto:' + a(site.email) + '">' + e(site.email) + '</a>',
    '    <span>' + e(site.locationLine.toUpperCase()) + '</span>',
    '  </div>',
    '</div>'
  ].join('\n');
};
