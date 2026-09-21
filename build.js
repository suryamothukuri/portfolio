#!/usr/bin/env node
/* ==========================================================================
   BUILD

   Reads  content/*.js   the words and numbers
          src/templates/ how they become markup
          src/styles/    the stylesheet, in parts
          src/js/        the behaviour, in parts

   Writes index.html
          style.css
          script.js
          assets/facts.js

   Those four are generated. Editing them by hand works until the next
   build, and then the edit is gone, which is why each one is written with
   a banner saying so.

   Run:  npm run build      once
         npm run watch      rebuild whenever a source file changes
         npm start          watch and serve on http://localhost:8000
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const p = (...xs) => path.join(ROOT, ...xs);

/* --------------------------------------------------------------------------
   Order is the contract.

   CSS: two rules of equal specificity are decided by whichever comes last,
   and this project has already been bitten by that once, when a separator
   rule lost to an earlier one written with the same weight. 08-responsive
   must stay last: every rule in it is an override of something above it.
   Renaming a file is fine. Reordering one is a design change.

   JS: every part lives inside one shared closure that 01-core opens and
   08-boot closes, which is how the parts call each other. 01-core must come
   first and 08-boot must come last. The six in between can move.

   A file sitting in src/styles or src/js that is not named here never
   reaches the page. checkOrphans below prints a warning when it finds one.
   -------------------------------------------------------------------------- */

const CSS_PARTS = [
  '01-tokens', '02-base', '03-layers', '04-gate', '05-nav', '06-sections',
  '07-projects', '08-responsive'
];

const JS_PARTS = [
  '01-core', '02-gate', '03-film', '04-text', '05-reveals', '06-projects',
  '07-chrome', '08-boot'
];

const GENERATED = which =>
  `/* ${which}\n` +
  `   GENERATED FILE. Do not edit: the next build overwrites it.\n` +
  `   Change content/ or src/ instead, then run \`npm run build\`. */\n`;

/* -------------------------------------------------------------------- read */

function read(dir, names, ext) {
  return names.map(n => {
    const f = p('src', dir, n + ext);
    if (!fs.existsSync(f)) {
      throw new Error(`missing part: src/${dir}/${n}${ext}\n` +
                      `It is listed in ${ext === '.css' ? 'CSS_PARTS' : 'JS_PARTS'} in build.js.`);
    }
    return fs.readFileSync(f, 'utf8');
  });
}

/* Warn about a part that exists on disk but is not in the list, because it
   would silently never reach the page. */
function checkOrphans(dir, names, ext) {
  const onDisk = fs.readdirSync(p('src', dir)).filter(f => f.endsWith(ext));
  const listed = new Set(names.map(n => n + ext));
  const orphans = onDisk.filter(f => !listed.has(f));
  if (orphans.length) {
    console.warn(`  ! src/${dir}/ has ${orphans.length} file(s) not in the build order, ` +
                 `so they are not on the page: ${orphans.join(', ')}`);
  }
}

/* ------------------------------------------------------------------- build */

function build() {
  const t0 = Date.now();

  /* content is required fresh every time so `npm run watch` picks up edits */
  for (const k of Object.keys(require.cache)) {
    if (k.startsWith(p('content')) || k.startsWith(p('src', 'templates'))) delete require.cache[k];
  }

  const site       = require('./content/site');
  const home       = require('./content/home');
  const experience = require('./content/experience');
  const projects   = require('./content/projects');
  const skills     = require('./content/skills');
  const research   = require('./content/research');
  const education  = require('./content/education');
  const facts      = require('./content/facts');

  const head = require('./src/templates/head');
  const gate = require('./src/templates/gate');
  const header = require('./src/templates/header');
  const S = require('./src/templates/sections');

  /* ---- index.html ---- */
  const html = [
    '<!doctype html>',
    '<html lang="en" data-theme="dark">',
    '<head>',
    head(site),
    '</head>',
    '<body>',
    '',
    '<a class="skip" href="#main">Skip to content</a>',
    '',
    '<!-- ============ FILM LAYER ============ -->',
    '<div class="film" id="film" aria-hidden="true">',
    '  <canvas id="filmCanvas" class="film__canvas"></canvas>',
    '  <div class="film__veil" id="filmVeil"></div>',
    '</div>',
    '<div class="grain" aria-hidden="true"></div>',
    '<div class="progress" aria-hidden="true"><span id="progressBar"></span></div>',
    '',
    '<!-- ============ CURSOR ============ -->',
    '<div class="cursor" id="cursor" aria-hidden="true"></div>',
    '',
    '<!-- ============ GATE (intro puzzle + fact) ============ -->',
    gate(site),
    '',
    '<!-- ============ HEADER ============ -->',
    header(site),
    '',
    '<main id="main">',
    '',
    '<!-- ============ 01 HERO ============ -->',
    S.hero(home.hero),
    '',
    '<!-- ============ 02 MISSION ============ -->',
    S.mission(home.mission, site.sections),
    '',
    '<!-- ============ 03 EXPERIENCE ============ -->',
    S.experience(experience, site.sections),
    '',
    '<!-- ============ 04 TECHNICAL SKILLS ============ -->',
    S.skills(skills, site.sections),
    '',
    '<!-- ============ 05 PROJECTS ============ -->',
    S.projects(projects, site.sections),
    '',
    '<!-- ============ 06 RESEARCH & MENTORSHIP ============ -->',
    S.research(research, site.sections),
    '',
    '<!-- ============ 07 EDUCATION ============ -->',
    S.education(education, site.sections),
    '',
    '<!-- ============ 08 CONTACT ============ -->',
    S.contact(site),
    '',
    '</main>',
    '',
    '<!-- ============ FOOTER ============ -->',
    S.footer(site),
    '',
    '<div class="toast" id="toast" role="status" aria-live="polite"></div>',
    '',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>',
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>',
    '<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js" defer></script>',
    '<script src="assets/facts.js" defer></script>',
    '<script src="script.js" defer></script>',
    '</body>',
    '</html>',
    ''
  ].join('\n');

  /* ---- style.css ---- */
  checkOrphans('styles', CSS_PARTS, '.css');
  const css = GENERATED('style.css') + '\n' + read('styles', CSS_PARTS, '.css').join('\n');

  /* ---- script.js ---- */
  checkOrphans('js', JS_PARTS, '.js');
  const js = GENERATED('script.js') + '\n' + read('js', JS_PARTS, '.js').join('\n');

  /* ---- assets/facts.js ----
     kept as its own file, loaded before script.js, because the gate needs
     the list the moment the page opens */
  const factsOut = GENERATED('assets/facts.js') +
    `/* ${facts.length} facts, one shown at random after the intro puzzle. */\n` +
    'window.STM_FACTS = [\n' +
    facts.map(f => JSON.stringify(f)).join(',\n') + '\n];\n';

  write('index.html', html);
  write('style.css', css);
  write('script.js', js);
  write(path.join('assets', 'facts.js'), factsOut);

  console.log(`  built in ${Date.now() - t0}ms  ` +
              `(${experience.length} roles, ${projects.featured.length + projects.grid.length} projects, ` +
              `${skills.reduce((n, g) => n + g.items.length, 0)} skills, ${facts.length} facts)`);
}

function write(rel, body) {
  const f = p(rel);
  const before = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
  if (before === body) { console.log(`  = ${rel}`); return; }
  fs.writeFileSync(f, body);
  console.log(`  ${before === null ? '+' : '~'} ${rel}  ${(body.length / 1024).toFixed(1)}kb`);
}

/* -------------------------------------------------------------------- run */

if (process.argv.includes('--watch')) {
  build();
  const dirs = ['content', 'src/templates', 'src/styles', 'src/js'];
  console.log('  watching ' + dirs.join(', ') + ' ... (ctrl-c to stop)');
  let queued = null;
  for (const d of dirs) {
    fs.watch(p(d), { persistent: true }, () => {
      clearTimeout(queued);                 /* editors write twice; debounce */
      queued = setTimeout(() => {
        try { build(); }
        catch (err) { console.error('  BUILD FAILED: ' + err.message); }
      }, 80);
    });
  }
} else {
  build();
}
