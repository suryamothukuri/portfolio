  /* ======================================================================
     The projects section.

     VIZ holds the two diagrams. They draw each project's actual mechanism, not
     invented results: the retrieval funnel and the materiality function.
     The filter builds its buttons from the data-cat values in the markup.
     ====================================================================== */
  /* ======================================================================
     12 — WORK
     ====================================================================== */
  function work() {
    $$('.prj__t').forEach(function (t) {
      var chars = splitChars(t);
      if (!chars.length || REDUCED) return;
      gsap.set(chars, { yPercent: 150 });
      gsap.to(chars, {
        yPercent: 0, duration: 0.9, stagger: 0.022, ease: 'expo.out',
        scrollTrigger: { trigger: t, start: 'top 84%', once: true }
      });
    });

    if (REDUCED) return;
    gsap.matchMedia().add('(min-width: 1025px)', function () {
      $$('.prj__n').forEach(function (n) {
        gsap.fromTo(n, { yPercent: -30 }, {
          yPercent: -70, ease: 'none',
          scrollTrigger: { trigger: n.closest('.prj'), start: 'top bottom', end: 'bottom top', scrub: 0.5 }
        });
      });
    });
  }


  /* ======================================================================
     12 — PROJECT PANELS
     Both graphics are the project's own mechanism, not invented results:
     DriftLens plots its actual materiality function, and the clinical agent
     draws the LangGraph state machine described in its README.
     ====================================================================== */
  var VIZ = {
    trial: {
      graph: 'funnel',
      graphTitle: 'Two-stage retrieval',
      graphNote: 'narrowing',
      flow: [
        [{ t: 'Groq', s: 'tier 1' }, { t: 'Gemini', s: 'tier 2' }, { t: 'Ollama', s: 'local' }],
        [{ t: 'Qdrant', s: 'vector search' }, { t: 'Cross-encoder', s: 'rerank' }],
        [{ t: 'PostgreSQL 16', s: 'studies · eligibility · locations' }],
        [{ t: 'Airflow DAG', s: 'nightly sync + live v2 fallback, 2 to 3s' }]
      ]
    },
    drift: {
      graph: 'materiality',
      graphTitle: 'Materiality scoring',
      graphNote: '|Δi| · log(1+n)',
      flow: [
        [{ t: 'SEC EDGAR', s: '10-K Item 1A · rate-limited 8 req/s' }],
        [{ t: 'bge-small-en-v1.5', s: '512-token window · 50-token overlap', acc: true }],
        [{ t: 'UMAP', s: 'reduce' }, { t: 'HDBSCAN', s: 'themes · 5 to 15% noise' }],
        [{ t: 'Ollama qwen2.5', s: 'grounded, excerpt-only explanations' }],
        [{ t: 'DuckDB-Wasm + Streamlit', s: 'static Parquet · $0 at request time' }]
      ]
    }
  };

  /* materiality = |intensity_delta| × log(1 + chunk_count), the function
     DriftLens actually ranks by — drawn for three deltas so the log damping
     that stops a 1-paragraph theme outranking a 15-paragraph one is visible */
  function svgMateriality() {
    var W = 300, H = 132, L = 30, B = 22, T = 10, R = 8;
    var NMAX = 24, deltas = [0.30, 0.20, 0.10];
    var ymax = 0.30 * Math.log(1 + NMAX);
    var px = function (n) { return L + (n / NMAX) * (W - L - R); };
    var py = function (v) { return H - B - (v / ymax) * (H - B - T); };
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Materiality against chunk count">';
    [0.25, 0.5, 0.75, 1].forEach(function (f) {
      out += '<line class="ax" x1="' + L + '" y1="' + py(ymax * f).toFixed(1) + '" x2="' + (W - R) + '" y2="' + py(ymax * f).toFixed(1) + '"/>';
    });
    out += '<line class="ax" x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - R) + '" y2="' + (H - B) + '"/>';
    deltas.forEach(function (d, i) {
      var pts = [];
      for (var n = 0; n <= NMAX; n += 0.5) pts.push(px(n).toFixed(1) + ',' + py(d * Math.log(1 + n)).toFixed(1));
      out += '<polyline class="ln' + (i ? ' dim' : '') + '" points="' + pts.join(' ') + '" stroke-dasharray="900" stroke-dashoffset="900"/>';
      out += '<text x="' + (W - R) + '" y="' + (py(d * Math.log(1 + NMAX)) - 3).toFixed(1) + '" font-size="7" text-anchor="end" letter-spacing="0.6">Δ' + d.toFixed(2) + '</text>';
    });
    [1, 8, 16, 24].forEach(function (n) {
      out += '<text x="' + px(n).toFixed(1) + '" y="' + (H - 8) + '" font-size="7" text-anchor="middle" letter-spacing="0.8">' + n + '</text>';
    });
    out += '<text x="0" y="' + (T + 6) + '" font-size="7" letter-spacing="0.8">SCORE</text>';
    out += '<text x="' + (W / 2) + '" y="' + H + '" font-size="7" text-anchor="middle" letter-spacing="0.8">PARAGRAPHS IN THEME</text>';
    return out + '</svg>';
  }

  /* Two-stage retrieval, which is the distinctive thing the engine does: a
     wide vector candidate pool narrowed by a cross-encoder, then by structured
     eligibility. Widths are proportional to stage, not to measured counts. */
  function svgFunnel() {
    var W = 300, H = 158, top = 16, rowH = 30, gap = 6;
    var rows = [
      { t: 'QDRANT VECTOR SEARCH', s: 'bi-encoder, pre-indexed', w: 1.00 },
      { t: 'CROSS-ENCODER RERANK', s: 'query and trial read together', w: 0.72 },
      { t: 'ELIGIBILITY FILTER', s: 'age, sex, location, phase', w: 0.46 },
      { t: 'MATCHED TRIALS', s: 'returned to the patient', w: 0.38, hi: true }
    ];
    var out = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Two-stage retrieval funnel">';
    rows.forEach(function (r, i) {
      var w = r.w * W, x = (W - w) / 2, y = top + i * (rowH + gap);
      out += '<g class="fun' + (r.hi ? ' hi' : '') + '">';
      out += '<rect class="funbar" x="' + x.toFixed(1) + '" y="' + y + '" width="' + w.toFixed(1) + '" height="' + rowH + '" rx="2" data-x="' + x.toFixed(1) + '" data-w="' + w.toFixed(1) + '"/>';
      out += '<text x="' + (W / 2) + '" y="' + (y + 12) + '" font-size="7.5" text-anchor="middle" letter-spacing="1">' + r.t + '</text>';
      out += '<text class="sub" x="' + (W / 2) + '" y="' + (y + 23) + '" font-size="6.5" text-anchor="middle" letter-spacing="0.5">' + r.s + '</text>';
      out += '</g>';
      if (i < rows.length - 1) {
        var ny = y + rowH, my = ny + gap / 2;
        out += '<path class="funarrow" d="M' + (W / 2) + ' ' + ny + ' L' + (W / 2) + ' ' + my + '"/>';
      }
    });
    return out + '</svg>';
  }

  function projectViz() {
    $$('.prj__viz').forEach(function (host) {
      var spec = VIZ[host.getAttribute('data-viz')];
      if (!spec) return;

      var g = document.createElement('div');
      g.className = 'viz';
      g.innerHTML = '<div class="viz__head"><span class="viz__t">' + spec.graphTitle +
                    '</span><span class="viz__note">' + spec.graphNote + '</span></div>' +
                    (spec.graph === 'funnel' ? svgFunnel() : svgMateriality());
      host.appendChild(g);

      var flow = document.createElement('div');
      flow.className = 'viz';
      var fh = '<div class="viz__head"><span class="viz__t">Stack</span></div>';
      spec.flow.forEach(function (row, i) {
        if (i) fh += '<div class="flow__c"></div>';
        fh += '<div class="flow__row">' + row.map(function (n) {
          return '<div class="flow__n' + (n.acc ? ' acc' : '') + '"><b>' + n.t + '</b>' + n.s + '</div>';
        }).join('') + '</div>';
      });
      flow.innerHTML = fh;
      host.appendChild(flow);

      if (REDUCED) {
        $$('polyline.ln', g).forEach(function (l) { l.style.strokeDashoffset = 0; });
        return;
      }
      ScrollTrigger.create({
        trigger: host, start: 'top 78%', once: true,
        onEnter: function () {
          var lines = $$('polyline.ln', g);
          if (lines.length) gsap.to(lines, { strokeDashoffset: 0, duration: 1.5, stagger: 0.14, ease: 'power2.out' });
          var bars = $$('rect.funbar', g);
          if (bars.length) {
            gsap.from(bars, { scaleX: 0, transformOrigin: '50% 50%', duration: 0.7, stagger: 0.1, ease: 'expo.out' });
            gsap.from($$('.fun text', g), { opacity: 0, duration: 0.4, stagger: 0.1, delay: 0.2 });
          }
          gsap.from($$('.flow__row', flow), { opacity: 0, y: 14, duration: 0.55, stagger: 0.07, ease: 'power2.out' });
        }
      });
    });
  }

  /* ======================================================================
     12b — PROJECT FILTER
     Buttons are derived from the cards present, so adding a project with a
     new data-cat adds its button with no further wiring.
     ====================================================================== */
  function projectFilter() {
    var bar = $('#pfilter'), grid = $('#pgrid');
    if (!bar || !grid) return;
    var cards = $$('.pcard', grid);
    if (!cards.length) return;

    var cats = [];
    cards.forEach(function (c) {
      var k = c.getAttribute('data-cat');
      if (k && cats.indexOf(k) === -1) cats.push(k);
    });

    function build(label, value) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pfilter__b';
      b.textContent = label;
      b.setAttribute('aria-pressed', value === 'all' ? 'true' : 'false');
      if (value === 'all') b.classList.add('is-on');
      b.addEventListener('click', function () {
        $$('.pfilter__b', bar).forEach(function (o) {
          o.classList.remove('is-on'); o.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('is-on'); b.setAttribute('aria-pressed', 'true');
        cards.forEach(function (c) {
          var show = value === 'all' || c.getAttribute('data-cat') === value;
          c.hidden = !show;
        });
        /* the grid just changed height under a pinned/scrubbed page */
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      });
      bar.appendChild(b);
    }

    build('All', 'all');
    cats.forEach(function (c) { build(c, c); });
  }
