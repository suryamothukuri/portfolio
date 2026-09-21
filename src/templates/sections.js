/* The eight page sections.

   Each one is a function of its content file and returns markup. Two
   attributes carry meaning beyond styling and are worth knowing before
   editing any of this:

     data-film="hero|feature|margin"
       how much of the scroll-driven film reads through behind the section.
       See VEIL in src/js/05-film.js.

     data-reveal / data-split / data-hero
       hooks the motion layer reads. Removing one removes that animation
       but never the content. */

var u = require('./util');
var e = u.e, a = u.a;

/* ---------------------------------------------------------------- hero -- */
function hero(h) {
  return [
    '<section class="hero" id="top" data-film="hero" aria-labelledby="heroTitle">',
    '  <div class="hero__inner">',
    '    <figure class="portrait" id="portrait" aria-hidden="true">',
    '      <img src="' + a(h.portrait.src) + '" alt="" decoding="async">',
    '    </figure>',
    '    <p class="eyebrow" data-hero="1">' + e(h.eyebrow) + '</p>',
    '    <h1 class="hero__name" id="heroTitle" data-split="word">' + e(h.name) + '</h1>',
    '    <p class="hero__tag" data-reveal="line">' + h.tagline + '</p>',
    '    <p class="hero__sub" data-hero="2">' + h.sub + '</p>',
    '    <div class="hero__act" data-hero="3">',
    h.actions.map(function (b) {
      return '      <a class="btn" href="' + a(b.href) + '">' + e(b.label) + '</a>';
    }).join('\n'),
    '    </div>',
    '  </div>',
    '  <div class="hero__meta" data-hero="4">',
    '    <span id="filmLabel">Latent Space / 01 · Compute</span>',
    '    <span>' + e(h.scrollHint) + '</span>',
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ------------------------------------------------------------- mission -- */
function mission(m, s) {
  return [
    '<section class="mission" id="mission" data-film="feature" aria-labelledby="missionTitle">',
    '  <span class="idx">' + e(s.mission.index) + '</span>',
    '  <div class="mission__grid">',
    '    <div class="mission__inner">',
    '      <h2 class="mission__lead" id="missionTitle" data-reveal="line" data-kinetic>' + e(m.lead) + '</h2>',
    '      <p class="mission__body" data-reveal="line">' + e(m.body) + '</p>',
    '      <p class="mission__kick" data-reveal="line">' + m.kicker + '</p>',
    '    </div>',
    '    <aside class="stats" aria-label="Key figures">',
    '      <div class="stats__track" id="statsTrack">',
    m.stats.map(function (st) {
      /* decimals are derived from the count string, so 4.2 keeps its tenth
         while 200 stays a whole number */
      var dec = (String(st.count).split('.')[1] || '').length;
      return '        <div class="stat"><span class="stat__n" data-count="' + a(st.count) + '"' +
             (dec ? ' data-dec="' + dec + '"' : '') +
             (st.prefix ? ' data-prefix="' + a(st.prefix) + '"' : '') +
             (st.suffix ? ' data-suffix="' + a(st.suffix) + '"' : '') +
             '>0</span><span class="stat__l">' + e(st.label) + '</span></div>';
    }).join('\n'),
    '      </div>',
    '    </aside>',
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ---------------------------------------------------------- experience -- */
function experience(roles, s) {
  var cards = roles.map(function (r) {
    return [
      '      <article class="tl__card">',
      '        <div class="tl__meta">',
      '          <div class="tl__inner">',
      '            <span class="tl__period">' + e(r.period) + '</span>',
      '            <h3 class="tl__role">' + e(r.role) + '</h3>',
      '            <p class="tl__org">' + e(r.org) + '</p>',
      '            <img class="tl__logo' + (r.logoClass ? ' ' + r.logoClass : '') +
        '" src="assets/logos/' + a(r.logo) + '" alt="' + a(r.logoAlt) + '" loading="lazy">',
      '          </div>',
      '        </div>',
      '        <div class="tl__main">',
      '          <div class="tl__b">',
      r.paragraphs.map(function (p) { return '            <p>' + e(p) + '</p>'; }).join('\n'),
      '          </div>',
      '          <ul class="tl__tags">' + r.tags.map(function (t) {
        return '<li>' + e(t) + '</li>';
      }).join('') + '</ul>',
      '        </div>',
      '      </article>'
    ].join('\n');
  });

  return [
    '<section class="story" id="experience" data-film="margin" aria-labelledby="storyHeading">',
    '  <span class="idx">' + e(s.experience.index) + '</span>',
    '  <h2 class="sec__t" id="storyHeading" data-reveal="line">' + e(s.experience.heading) + '</h2>',
    '  <div class="tl" id="tl">',
    '    <div class="tl__track" id="tlTrack">',
    '      <div class="tl__spine" id="tlSpine" aria-hidden="true"><span></span></div>',
    '',
    cards.join('\n\n'),
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');
}

/* -------------------------------------------------------------- skills -- */
function skills(groups, s) {
  return [
    '<section class="arsenal" id="skills" data-film="margin" aria-labelledby="skillsTitle">',
    '  <span class="idx">' + e(s.skills.index) + '</span>',
    '  <h2 class="sec__t" id="skillsTitle" data-reveal="line">' + e(s.skills.heading) + '</h2>',
    '  <div class="ars">',
    groups.map(function (g) {
      return [
        '    <div class="ars__g">',
        '      <h3>' + e(g.title) + '</h3>',
        '      <ul>' + g.items.map(function (i) { return '<li>' + e(i) + '</li>'; }).join('') + '</ul>',
        '    </div>'
      ].join('\n');
    }).join('\n'),
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ------------------------------------------------------------ projects -- */
function metric(m) {
  return '<div><span data-count="' + a(m.count) + '"' +
    (m.prefix ? ' data-prefix="' + a(m.prefix) + '"' : '') +
    (m.suffix ? ' data-suffix="' + a(m.suffix) + '"' : '') +
    '>0</span><i>' + e(m.label) + '</i></div>';
}

function btn(cls) {
  return function (l) {
    return '<a class="' + cls + '" href="' + a(l.href) + '" target="_blank" rel="noopener">' +
           e(l.label) + ' →</a>';
  };
}

function projects(p, s) {
  var featured = p.featured.map(function (f) {
    return [
      '  <article class="prj" data-cursor="view">',
      '    <span class="prj__n" aria-hidden="true">' + e(f.n) + '</span>',
      '    <div class="prj__body">',
      '      <h3 class="prj__t" data-split="char">' + e(f.title) + '</h3>',
      f.sub ? '      <p class="prj__sub">' + e(f.sub) + '</p>' : null,
      '      <p class="prj__thesis" data-reveal="line">' + e(f.thesis) + '</p>',
      '      <p class="prj__d" data-reveal="line">' + f.description + '</p>',
      '      <p class="prj__callout">' + e(f.callout) + '</p>',
      '      <div class="prj__m">' + f.metrics.map(metric).join('') + '</div>',
      '      <ul class="prj__tags">' + f.tags.map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ul>',
      '      <div class="prj__links">' + f.links.map(btn('btn')).join('') + '</div>',
      '    </div>',
      '    <div class="prj__viz" data-viz="' + a(f.viz) + '" aria-hidden="true"></div>',
      '  </article>'
    ].filter(Boolean).join('\n');
  });

  var grid = p.grid.map(function (c) {
    return [
      '    <article class="pcard" data-cursor="view" data-cat="' + a(c.category) + '">',
      '      <span class="pcard__n" aria-hidden="true">' + e(c.n) + '</span>',
      '      <h3 class="pcard__t">' + e(c.title) + '</h3>',
      '      <p class="pcard__thesis">' + e(c.thesis) + '</p>',
      '      <p class="pcard__d">' + c.description + '</p>',
      '      <ul class="pcard__tags">' + c.tags.map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ul>',
      '      <div class="pcard__links">' + c.links.map(btn('btn btn--sm')).join('') + '</div>',
      '    </article>'
    ].join('\n');
  });

  return [
    '<section class="work" id="work" data-film="margin" aria-labelledby="workTitle">',
    '  <span class="idx">' + e(s.projects.index) + '</span>',
    '  <h2 class="sec__t" id="workTitle" data-reveal="line">' + e(s.projects.heading) + '</h2>',
    '',
    featured.join('\n\n'),
    '',
    /* the filter buttons are built at runtime from the data-cat values above */
    '  <div class="pfilter" id="pfilter" role="group" aria-label="Filter projects by discipline"></div>',
    '  <div class="pgrid" id="pgrid">',
    grid.join('\n'),
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ------------------------------------------------------------ research -- */
function research(items, s) {
  return [
    '<section class="research" id="research" data-film="margin" aria-labelledby="resTitle">',
    '  <span class="idx">' + e(s.research.index) + '</span>',
    '  <h2 class="sec__t" id="resTitle" data-reveal="line">' + e(s.research.heading) + '</h2>',
    '',
    '  <div class="rlist">',
    items.map(function (r) {
      return [
        '    <article class="rcard">',
        '      <span class="rcard__when">' + e(r.when) + '</span>',
        r.logo ? '      <img class="rcard__logo' + (r.logoClass ? ' ' + r.logoClass : '') +
          '" src="assets/logos/' + a(r.logo) + '" alt="' + a(r.logoAlt) + '" loading="lazy">' : null,
        '      <h3 class="rcard__role">' + e(r.role) + '</h3>',
        '      <p class="rcard__org">' + e(r.org) + '</p>',
        '      <ul class="rcard__b">',
        r.bullets.map(function (b) { return '        <li>' + e(b) + '</li>'; }).join('\n'),
        '      </ul>',
        '      <ul class="rcard__tags">' + r.tags.map(function (t) { return '<li>' + e(t) + '</li>'; }).join('') + '</ul>',
        '    </article>'
      ].filter(Boolean).join('\n');
    }).join('\n\n'),
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ----------------------------------------------------------- education -- */
function education(items, s) {
  return [
    '<section class="edu" id="credentials" data-film="margin" aria-labelledby="eduTitle">',
    '  <span class="idx">' + e(s.education.index) + '</span>',
    '  <h2 class="sec__t" id="eduTitle" data-reveal="line">' + e(s.education.heading) + '</h2>',
    '',
    '  <div class="edu__list">',
    items.map(function (d) {
      /* data-dec keeps the trailing zero on a GPA like 3.70 */
      var dec = (String(d.gpa).split('.')[1] || '').length;
      return [
        '    <article class="edu__item">',
        '      <div class="edu__logo"><img' + (d.logoClass ? ' class="' + a(d.logoClass) + '"' : '') +
          ' src="assets/logos/' + a(d.logo) + '" alt="' + a(d.logoAlt) + '" loading="lazy"></div>',
        '      <div class="edu__body">',
        '        <div class="edu__top">',
        '          <h3>' + e(d.school) + '</h3>',
        '          <span class="edu__when">' + e(d.when) + '</span>',
        '        </div>',
        '        <p class="edu__deg">' + e(d.degree) + '</p>',
        '        <p class="edu__meta">' + e(d.meta) + '</p>',
        '        <p class="edu__gpa">CGPA <span data-count="' + a(d.gpa) + '" data-dec="' + dec +
          '">0</span> / ' + e(d.gpaOutOf) + '</p>',
        '        <div class="edu__cw">',
        '          <span class="edu__cwl">Relevant coursework</span>',
        '          <ul>' + d.coursework.map(function (c) { return '<li>' + e(c) + '</li>'; }).join('') + '</ul>',
        '        </div>',
        '      </div>',
        '    </article>'
      ].join('\n');
    }).join('\n\n'),
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ------------------------------------------------------------- contact -- */
function contact(site) {
  var c = site.contact, f = c.form, s = site.sections;
  return [
    '<section class="cta" id="contact" data-film="feature" aria-labelledby="ctaTitle">',
    '  <span class="idx">' + e(s.contact.index) + '</span>',
    '',
    '  <div class="cta__grid">',
    '    <div class="cta__lede">',
    '      <h2 class="cta__t" id="ctaTitle" data-split="word">' + c.title + '</h2>',
    '      <p class="cta__sub" data-reveal="line">' + c.sub + '</p>',
    '    </div>',
    '',
    '    <div class="chan">',
    c.channels.map(function (ch) {
      var ext = /^https?:/.test(ch.href) ? ' target="_blank" rel="noopener"' : '';
      var cp  = ch.copy ? ' data-copy="' + a(ch.value) + '"' : '';
      return '      <a class="chan__r" href="' + a(ch.href) + '"' + ext + cp +
             '><i>' + e(ch.label) + '</i><b>' + e(ch.value) + '</b><s>→</s></a>';
    }).join('\n'),
    '    </div>',
    '  </div>',
    '',
    '  <form class="form" id="form" novalidate>',
    '    <div class="form__f">',
    '      <label for="fName">' + e(f.name) + '</label>',
    '      <input id="fName" name="name" type="text" autocomplete="name" required aria-describedby="eName">',
    '      <p class="form__e" id="eName" role="alert"></p>',
    '    </div>',
    '    <div class="form__f">',
    '      <label for="fEmail">' + e(f.email) + '</label>',
    '      <input id="fEmail" name="email" type="email" autocomplete="email" required aria-describedby="eEmail">',
    '      <p class="form__e" id="eEmail" role="alert"></p>',
    '    </div>',
    '    <div class="form__f form__f--w">',
    '      <label for="fMsg">' + e(f.message) + '</label>',
    '      <textarea id="fMsg" name="message" rows="1" required aria-describedby="eMsg"></textarea>',
    '      <p class="form__e" id="eMsg" role="alert"></p>',
    '    </div>',
    '    <div class="form__act">',
    '      <button class="btn btn--solid" type="submit" id="fSend">' + e(f.send) + ' →</button>',
    '      <p class="form__status" id="fStatus" role="status" aria-live="polite"></p>',
    '    </div>',
    '  </form>',
    '</section>'
  ].join('\n');
}

/* -------------------------------------------------------------- footer -- */
function footer(site) {
  return [
    '<footer class="ftr">',
    '  <div class="ftr__meta">',
    '    <span>© ' + site.year + ' ' + e(site.name) + '</span>',
    '    <span>' + e(site.locationLine) + '</span>',
    '    <span id="clock">--:--:--</span>',
    '  </div>',
    '  <button class="top" id="top-btn" type="button" aria-label="Back to top">↑</button>',
    '</footer>'
  ].join('\n');
}

module.exports = {
  hero: hero, mission: mission, experience: experience, skills: skills,
  projects: projects, research: research, education: education,
  contact: contact, footer: footer
};
