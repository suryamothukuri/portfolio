/* <head>: title, the link-preview card, the no-flash theme script, fonts,
   and the structured data that lets a search engine read the page as a
   person rather than as a document. */

var u = require('./util');
var e = u.e, a = u.a;

module.exports = function head(site) {
  var m = site.meta;

  /* This has to run before the first paint or the page flashes one theme and
     then the other. It is inline for that reason and must stay inline.

     Dark is the site, not a preference: the film, the ember accent and the
     whole grade were built for it, so every visitor starts there whatever
     their operating system is set to.

     Light is deliberately NOT remembered between visits. sessionStorage, not
     localStorage: it survives a reload in the same tab, so someone who
     switches does not get thrown back on every page load, but it is gone
     when the tab closes. Somebody who tries light once and returns a week
     later sees the site as it is meant to look, not as they left it. */
  var noFlash =
    "(function(){\n" +
    "  var t = 'dark';\n" +
    "  try {\n" +
    "    var s = sessionStorage.getItem('stm-theme');\n" +
    "    if (s === 'light' || s === 'dark') t = s;\n" +
    "    localStorage.removeItem('stm-theme');   /* clear the old persistent key */\n" +
    "  } catch(e){}\n" +
    "  document.documentElement.setAttribute('data-theme', t);\n" +
    "})();";

  var schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    email: 'mailto:' + site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.location,
      addressRegion: site.locationLine.split(', ').pop(),
      addressCountry: 'US'
    },
    sameAs: [site.linkedin, site.github],
    alumniOf: site.schema.alumniOf.map(function (n) {
      return { '@type': 'CollegeOrUniversity', name: n };
    }),
    knowsAbout: site.schema.knowsAbout
  };

  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    '<title>' + e(m.title) + '</title>',
    '<meta name="description" content="' + a(m.description) + '">',
    '<link rel="canonical" href="' + a(site.url) + '">',
    /* No media query on this one. It tints the phone browser's address bar,
       and keying it to the operating system would put a cream bar above a
       black page for anyone whose phone is in light mode. It starts dark
       like the page, and the toggle repaints it. */
    '<meta name="theme-color" content="' + a(m.themeColorDark) + '">',
    '',
    '<meta property="og:type" content="website">',
    '<meta property="og:title" content="' + a(m.ogTitle) + '">',
    '<meta property="og:description" content="' + a(m.ogDescription) + '">',
    /* absolute, because LinkedIn and Slack will not resolve a relative path */
    '<meta property="og:url" content="' + a(site.url) + '">',
    '<meta property="og:image" content="' + a(abs(site.url, m.ogImage)) + '">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta property="og:image:alt" content="' + a(m.ogImageAlt) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + a(m.twitterTitle) + '">',
    '<meta name="twitter:description" content="' + a(m.twitterDescription) + '">',
    '<meta name="twitter:image" content="' + a(abs(site.url, m.ogImage)) + '">',
    '',
    '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">',
    '',
    '<script>',
    '/* no-flash theme: must run before first paint */',
    noFlash,
    '</script>',
    '',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">',
    '<link rel="stylesheet" href="style.css">',
    '',
    '<script type="application/ld+json">',
    JSON.stringify(schema, null, 2),
    '</script>',
    analytics(site.analytics || {})
  ].filter(function (l) { return l !== null; }).join('\n');
};

/* Both tags are written only when their id is filled in, so an empty
   analytics block ships a page with no third-party tracking at all.

   Clarity sits in the head rather than at the end of the body: the intro
   gate is the first thing a visitor meets and the most likely place to lose
   them, so the recording has to be running before it appears. */
function analytics(a) {
  var out = [];
  if (a.clarityId) {
    out.push('',
      '<script>',
      '/* Microsoft Clarity: heatmaps, session recordings, custom events */',
      '(function(c,l,a,r,i,t,y){',
      '  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};',
      '  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;',
      '  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);',
      '})(window, document, "clarity", "script", ' + JSON.stringify(a.clarityId) + ');',
      '</script>');
  }
  if (a.cloudflareToken) {
    out.push('',
      '<!-- Cloudflare Web Analytics: no cookies, deferred, counts only -->',
      '<script defer src="https://static.cloudflareinsights.com/beacon.min.js" ' +
      "data-cf-beacon='" + JSON.stringify({ token: a.cloudflareToken }) + "'></script>");
  }
  return out.length ? out.join('\n') : null;
}

function abs(base, path) {
  if (/^https?:\/\//.test(path)) return path;
  return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
