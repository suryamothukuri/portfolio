/* HOME
   The first screen and the statement directly under it. Two blocks, because
   they are read as one thing: the landing copy, then what it is all for.

   Fields that accept HTML are marked. Everywhere else < > & are printed
   literally, so write a plain ampersand and a plain apostrophe.

   Edit this file, then run `npm run build`. */

/* ------------------------------------------------------------------ hero -- */
exports.hero = {
  eyebrow: 'AI Engineer & Data Scientist, New York City',
  name:    'Surya Teja Mothukuri',
  /* ACCEPTS HTML: <em> sets the italic ember word */
  tagline: 'I build AI systems that <em>earn</em> their place in production.',
  /* ACCEPTS HTML: <br> for the line break */
  sub: 'Agentic GenAI, production ML, and the data engineering underneath. <br>90K+ clinical encounters. 10M+ records processed. 200 staff hours a month automated away.',
  actions: [
    { label: 'My career',    href: '#experience' },
    { label: 'Get in touch', href: '#contact' }
  ],
  /* the caption under the film, bottom of the screen */
  scrollHint: 'Scroll to advance',
  portrait: { src: 'assets/photo.jpg' }
};

/* --------------------------------------------------------------- mission -- */
exports.mission = {
  lead: 'Every system I ship has to answer for itself.',
  body: 'A risk score decides who gets seen first. A forecast decides what gets stocked. An agent decides what to do without asking. When software carries that kind of weight, “it performed well in validation” is not an answer, so I build the evaluation, the drift gates, the human-in-the-loop checks and the audit trail that let someone else verify my work.',
  /* ACCEPTS HTML: <em> sets the italic ember phrase */
  kicker: '<em>Accuracy is a number.</em> Trust is the deliverable.',

  /* Each figure counts up from zero when it scrolls into view.
     count  the number it lands on. A decimal is kept as written, so 4.2
            counts up to 4.2 and not to 4.
     prefix optional, printed before the number ($)
     suffix the small raised characters after it (K+, M+, /mo, %) */
  stats: [
    { count: '90',  suffix: 'K+',                label: 'Clinical encounters modeled' },
    { count: '10',  suffix: 'M+',                label: 'Transactional records processed' },
    { count: '200', suffix: '/mo',               label: 'Staff hours automated away' },
    { count: '4.2', prefix: '$', suffix: 'K/mo', label: 'Infrastructure spend cut' },
    { count: '50',  suffix: '%',                 label: 'Defect false negatives cut' }
  ]
};
