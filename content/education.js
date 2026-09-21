/* EDUCATION
   gpa counts up from zero on scroll; gpaOutOf is the denominator after it.
   Both are strings so a trailing zero (3.70) is not dropped.
   
   Fields that accept HTML are marked below; everywhere else < > & are
   printed literally, so write a plain ampersand and a plain apostrophe.

   Edit this file, then run `npm run build`. */

module.exports = [
  {
    school: 'Indiana University Bloomington',
    when: 'Aug 2024 - May 2026',
    degree: 'Master of Science, Data Science',
    meta: 'Luddy School of Informatics, Computing, and Engineering · Bloomington, IN',
    gpa: '3.91',
    gpaOutOf: '4.0',
    logo: 'iu.png',
    logoAlt: 'Indiana University',
    logoClass: 'logo--color',
    coursework: [
      'Applied Machine Learning', 'Applied Database Technologies',
      'Exploratory Data Analysis', 'Usable Artificial Intelligence', 'Social Media Mining',
      'Statistics', 'Data Visualization'
    ]
  },
  {
    school: 'IIIT Chennai',
    when: 'Aug 2018 - May 2023',
    degree: 'Bachelor’s and Master’s of Technology (Dual Degree), Electronics & Communication Engineering',
    meta: 'Minor in Machine Learning & Data Analytics · Chennai, India',
    gpa: '3.70',
    gpaOutOf: '4.0',
    logo: 'iiitdm.png',
    logoAlt: 'IIIT Chennai',
    logoClass: '',
    coursework: [
      'Machine Learning', 'Deep Learning', 'Data Analytics', 'Python Programming',
      'Signal Processing', 'Interdisciplinary Research',
      'Introduction to Artificial Intelligence'
    ]
  }
];
