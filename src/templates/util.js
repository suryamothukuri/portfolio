/* Shared helpers for the templates.

   Two rules run through all of them:
     e(s)   escape: & < > become entities. Use this for every field that the
            content files describe as plain text.
     raw    pass a string straight through. Only for the handful of fields
            marked ACCEPTS HTML in content/, so a stray angle bracket in
            ordinary prose can never silently become a tag.

   Quotes and apostrophes are left alone. The page is UTF-8 and the content
   files hold real characters, so a curly apostrophe is just an apostrophe. */

function e(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* the same, for a value going inside a double-quoted attribute */
function a(s) {
  return e(s).replace(/"/g, '&quot;');
}

/* 1 -> "01". The header and the phone menu number themselves. */
function pad(n) {
  return String(n).padStart(2, '0');
}

/* drop empty strings so a template can list optional pieces inline */
function lines(parts) {
  return parts.filter(function (p) { return p !== '' && p != null; }).join('\n');
}

module.exports = { e: e, a: a, pad: pad, lines: lines };
