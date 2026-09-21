/* PROJECTS
   Two shapes. `featured` are the full-width panels at the top of the section,
   `grid` are the smaller cards under the filter.
   
   description   ACCEPTS HTML. <strong> for the technologies, <code> for a
                 formula. Everything else on a project is plain text.
   n             the printed number in the corner. Purely decorative.
   category      builds the filter buttons automatically. Adding a card with a
                 new category adds that button; no other change needed.
   metrics       count is the number it animates to, prefix and suffix are
                 optional strings printed around it.
   viz           which diagram to draw beside the panel: trial or drift.
                 Defined in src/js/13-project-panels.js.
   
   Fields that accept HTML are marked below; everywhere else < > & are
   printed literally, so write a plain ampersand and a plain apostrophe.

   Edit this file, then run `npm run build`. */

module.exports = {
  featured: [
    {
      n: '001',
      title: 'AI Clinical Trial Matching Assistant',
      thesis: 'An assistant that helps patients find live clinical trials, and refuses to answer the questions it should not.',
      description: 'A <strong>LangGraph</strong> state machine drives the conversation across nine components: an intake node that merges condition, demographics and prior treatments across turns, a clarify node that asks one question at a time, and retrieval that runs in two stages: <strong>Qdrant</strong> vector search followed by cross-encoder reranking, joined against structured eligibility in <strong>PostgreSQL 16</strong>. An <strong>Airflow</strong> DAG syncs ClinicalTrials.gov nightly, and when a condition is not yet indexed the engine queries the v2 API live, scrubs PII and upserts to Qdrant within two to three seconds. LLM calls route <strong>Groq to Gemini</strong> with local <strong>Ollama</strong> as fallback.',
      callout: 'Medication questions are intercepted before search routing: the system refuses unsupervised instructions and returns physician-contact and red-flag guidance instead.',
      metrics: [
        {
          count: '9',
          label: 'system components'
        },
        {
          count: '2',
          suffix: '-stage',
          label: 'hybrid retrieval'
        },
        {
          count: '3',
          prefix: '<',
          suffix: 's',
          label: 'live trial ingestion'
        }
      ],
      tags: [
        'LangGraph', 'FastAPI', 'Qdrant', 'PostgreSQL', 'Apache Airflow', 'Groq', 'Gemini',
        'Ollama', 'React', 'Docker'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/ai-clinical-trial-matching-agent'
        }
      ],
      viz: 'trial'
    },
    {
      n: '002',
      title: 'DriftLens',
      sub: 'Document Semantic Drift Engine',
      thesis: 'Ten years of SEC filings, measured for meaning rather than words.',
      description: 'Standard diffing tells you which words changed. DriftLens embeds every paragraph of <strong>Item 1A, Risk Factors</strong> with <strong>bge-small-en-v1.5</strong>, reduces with <strong>UMAP</strong>, clusters themes with <strong>HDBSCAN</strong>, then measures the cosine distance between a theme’s mean embedding in year N and year N−1, so it catches a company saying something genuinely different even when the vocabulary barely moves. Materiality is weighted by <code>abs(intensity_delta) × log(1 + chunk_count)</code>, so a one-paragraph theme cannot outrank a fifteen-paragraph one.',
      callout: 'Every LLM explanation is built only from verbatim excerpts, with source chunk IDs stored alongside it, so each claim links back to the exact filing paragraph it came from.',
      metrics: [
        {
          count: '85',
          prefix: '≥',
          suffix: '%',
          label: 'section extraction rate'
        },
        {
          count: '5',
          suffix: '-phase',
          label: 'medallion pipeline'
        },
        {
          count: '0',
          prefix: '$',
          suffix: '/mo',
          label: 'inference cost at rest'
        }
      ],
      tags: [
        'bge-small', 'UMAP', 'HDBSCAN', 'Apache Parquet', 'DuckDB-Wasm', 'Ollama',
        'Streamlit', 'GitHub Actions'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/driftlens'
        },
        {
          label: 'Live engine',
          href: 'https://suryamothukuri.github.io/driftlens/'
        },
        {
          label: 'Dashboard',
          href: 'https://driftlens-dashboard.streamlit.app/'
        }
      ],
      viz: 'drift'
    }
  ],
  grid: [
    {
      n: '003',
      category: 'Engineering',
      title: 'True Size Atlas & Map Distortion Labs',
      thesis: 'Greenland looks bigger than Africa. Africa is fourteen times larger.',
      description: 'An interactive 3D cartography lab in <strong>React 19</strong> and <strong>D3</strong>. Drag a split curtain between Mercator and Equal Earth, pick up any country and move it across latitude bands using unit-quaternion shortest-arc rotation that holds area error under 0.1% while Mercator inflates by sec²(φ), or scale nations as Dorling cartograms by population, GDP, carbon, forest and true land area.',
      tags: [
        'React 19', 'TypeScript', 'D3.js', 'Vite', 'TopoJSON', 'FastAPI', 'Web Audio API',
        'Vitest'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/map-distortion-project'
        },
        {
          label: 'Live demo',
          href: 'https://map-distortion-explorer.vercel.app'
        }
      ]
    },
    {
      n: '004',
      category: 'Machine Learning',
      title: 'Home Credit Default Risk',
      thesis: 'Predicting repayment for applicants with little or no credit history.',
      description: 'A leakage-free modelling workflow over <strong>307,511 applications</strong> and 122 columns, extended with engineered features from bureau records and installment history. Ten pipelines were benchmarked end to end: histogram-based gradient boosting reached <strong>0.772 test AUC</strong>, against 0.606 for the logistic baseline, and the engineered feature set gave no meaningful lift over the base set, which is itself the finding.',
      tags: [
        'Python', 'Scikit-learn', 'Gradient Boosting', 'Random Forest',
        'Feature Engineering', 'Kaggle'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/Loan-Repayment-Risk-Modeling-using-Multi-Source-Data'
        }
      ]
    },
    {
      n: '005',
      category: 'Machine Learning',
      title: 'The Rise of Generative AI in Online Discourse',
      thesis: 'How nine communities talk about the tools they are still deciding how to feel about.',
      description: 'Posts and recursively flattened comment trees collected from <strong>nine subreddits</strong>: r/ChatGPT, r/Midjourney, r/StableDiffusion, r/OpenAI, r/MachineLearning and others, all through Reddit’s public JSON endpoints rather than the authenticated API. <strong>VADER</strong> scores tone, <strong>BERTopic</strong> surfaces the themes, and the two are compared across post versus comment context and across technical, creative and general-interest communities.',
      tags: [
        'Python', 'BERTopic', 'VADER', 'Sentence-Transformers', 'NLP', 'Pandas'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/Reddit-Based-Social-Media-Analysis-of-Generative-AI'
        }
      ]
    },
    {
      n: '006',
      category: 'Analytics & Viz',
      title: 'Etsy Retail Marketing Analysis',
      thesis: 'Does cause-marketing language actually sell, once you control for price?',
      description: '<strong>10,406 Etsy listings</strong> modelled against log review count. Sentiment, emotion scoring, lexical diversity, personalisation language, readability and trust signals are engineered from the description text, then tested with OLS regression controlling for price, rating and product category, so the question becomes which linguistic features survive the controls.',
      tags: [
        'Python', 'OLS Regression', 'Sentiment Analysis', 'Statsmodels',
        'Feature Engineering'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/Etsy-Retail-Marketing-Analysis'
        }
      ]
    },
    {
      n: '007',
      category: 'Analytics & Viz',
      title: 'NYC Airbnb Market Dynamics',
      thesis: 'Pricing, availability and host behaviour across five boroughs.',
      description: 'A spatio-temporal exploration of <strong>48,895 listings</strong> across 16 columns, covering listing density, price distribution by room type, minimum-night policy, review velocity and availability, rendered as interactive <strong>Folium</strong> maps alongside Seaborn and Plotly views. Built for INFO-I 590 Data Visualization at Indiana University.',
      tags: [
        'Python', 'Folium', 'Plotly', 'Seaborn', 'Geospatial', 'EDA'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/Spatio-Temporal-Analysis-and-Visual-Exploration-of-NYC-Airbnb-Market-Dynamics'
        }
      ]
    },
    {
      n: '008',
      category: 'Engineering',
      title: 'Farmer Management System',
      thesis: 'Record-keeping for smallholder farms, with an audit trail the database enforces itself.',
      description: 'A <strong>Flask</strong> and <strong>MySQL</strong> application covering authentication with Werkzeug password hashing, farmer registration and CRUD, farming categories and agro-product listings. Insert, update and delete activity is tracked by <strong>SQL triggers</strong> at the database layer rather than in application code, so the log cannot be bypassed.',
      tags: [
        'Python', 'Flask', 'MySQL', 'Flask-SQLAlchemy', 'SQL Triggers', 'Bootstrap'
      ],
      links: [
        {
          label: 'GitHub',
          href: 'https://github.com/suryamothukuri/Farmer-Management-Database-System'
        }
      ]
    }
  ]
};
