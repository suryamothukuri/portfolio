/* SITE
   Who you are, how you are reachable, and the words that frame each section.
   Everything a search engine or a link preview shows comes from `meta`.

   Fields that accept HTML are marked. Everywhere else < > & are printed
   literally, so write a plain ampersand and a plain apostrophe.

   Edit this file, then run `npm run build`. */

module.exports = {
  name:     'Surya Teja Mothukuri',
  role:     'AI Engineer & Data Scientist',
  location: 'New York City',
  locationLine: 'New York City, NY',
  email:    'suryamothuk23@gmail.com',
  /* the copyright year in the footer */
  year: 2026,

  linkedin: 'https://www.linkedin.com/in/surya-mothukuri/',
  github:   'https://github.com/suryamothukuri',

  /* Where the site will actually live. Until it is hosted this is a claim
     rather than a fact, and it is what search engines and link previews
     treat as the canonical address, so keep it correct. */
  url: 'https://suryamothukuri.com/',

  meta: {
    title:       'Surya Teja Mothukuri, AI Engineer & Data Scientist',
    description: 'Surya Teja Mothukuri builds AI systems that earn their place in production. Agentic GenAI, production ML, and the data engineering underneath. New York City.',
    /* the card people see when the link is pasted into LinkedIn or Slack */
    ogTitle:       'Surya Teja Mothukuri, AI Engineer & Data Scientist',
    ogDescription: 'Agentic GenAI, production ML, and the data engineering underneath. 90K+ clinical encounters. 10M+ records processed. 200 staff hours a month automated away.',
    /* the card is a rendered image with the name and `role` above baked
       into the pixels, so it has to be redrawn if either changes */
    ogImage:       'assets/og-card.jpg',
    ogImageAlt:    'Surya Teja Mothukuri, AI Engineer & Data Scientist',
    twitterTitle:       'Surya Teja Mothukuri, AI Engineer & Data Scientist',
    twitterDescription: 'I build AI systems that earn their place in production.',
    themeColorDark:  '#07080B',
    themeColorLight: '#EFEDE7'
  },

  /* structured data, so a search engine can read the page as a person */
  schema: {
    alumniOf: [
      'Indiana University Bloomington',
      'Indian Institute of Information Technology, Design & Manufacturing, Chennai'
    ],
    knowsAbout: [
      'Machine Learning', 'Generative AI', 'Retrieval-Augmented Generation',
      'Data Engineering', 'MLOps', 'Computer Vision'
    ]
  },

  /* the desktop header. Numbers are added automatically in order. */
  nav: [
    { label: 'Experience', href: '#experience' },
    { label: 'Projects',   href: '#work' },
    { label: 'Skills',     href: '#skills' },
    { label: 'Contact',    href: '#contact' }
  ],

  /* the phone menu, which has room for one more */
  menu: [
    { label: 'Experience',  href: '#experience' },
    { label: 'Projects',    href: '#work' },
    { label: 'Skills',      href: '#skills' },
    { label: 'Credentials', href: '#credentials' },
    { label: 'Contact',     href: '#contact' }
  ],

  /* the small index label and the big heading on each section */
  sections: {
    mission:    { index: '01 / Mission' },
    experience: { index: '02 / Experience',            heading: 'Experience' },
    skills:     { index: '03 / Technical skills',      heading: 'Technical Skills' },
    projects:   { index: '04 / Projects',              heading: 'Projects' },
    research:   { index: '05 / Additional experience', heading: 'Research & Mentorship' },
    education:  { index: '06 / Education',             heading: 'Education' },
    contact:    { index: '07 / Contact' }
  },

  /* the intro puzzle. The loop is Observe, Reason, Act, Learn; `missing` is
     the step taken out and dragged back in. */
  gate: {
    prompt:  'An agent loop with one step missing. Put it back to enter.',
    nodes:   ['Observe', 'Reason', 'Learn'],
    missing: 'Act',
    hint:    'Drag it into the gap',
    factLabel: 'Did you know',
    enter:   'Click anywhere, or wait',
    skip:    'Skip'
  },

  contact: {
    /* ACCEPTS HTML: <em> sets the italic ember phrase */
    title: 'Let\'s build something that <em>has to work.</em>',
    /* ACCEPTS HTML: <br> for the line break */
    sub: 'Currently in New York City. Open to relocation.<br>Hiring, building, or just curious where this is all going? Coffee’s on me.',
    /* `copy` puts the value on the clipboard when the row is clicked */
    channels: [
      { label: 'Email',    value: 'suryamothuk23@gmail.com', href: 'mailto:suryamothuk23@gmail.com', copy: true },
      { label: 'LinkedIn', value: '/in/surya-mothukuri',     href: 'https://www.linkedin.com/in/surya-mothukuri/' },
      { label: 'GitHub',   value: '/suryamothukuri',         href: 'https://github.com/suryamothukuri' }
    ],
    form: {
      name: 'Name', email: 'Email', message: 'Message', send: 'Send message'
    }
  }
};
