/* The intro puzzle.

   A four-station agent loop drawn on a rounded track: Observe, Reason, the
   empty socket, Learn. A pulse runs the track and dies at the socket, which
   is the whole instruction. The visitor drags one chip, once.

   The geometry is a 360x240 viewBox. The track is a rounded rectangle from
   (70,26) to (290,214) with a 44 corner radius, so the four stations sit at
   the midpoints of its sides and the chevrons sit on the corner curves,
   which is the only part of the track no station box covers.

   Node positions in the CSS are those midpoints expressed as percentages:
     top    (180, 26)  -> 50%,    10.83%
     right  (290, 120) -> 80.56%, 50%
     bottom (180, 214) -> 50%,    89.17%   (the socket)
     left   (70, 120)  -> 19.44%, 50% */

var u = require('./util');
var e = u.e, a = u.a;

module.exports = function gate(site) {
  var g = site.gate;
  var arrow = 'M-4 -4.6 L1.4 0 L-4 4.6';

  return [
    '<div class="gate" id="gate">',
    '  <div class="gate__bg" aria-hidden="true"></div>',
    '',
    '  <header class="gate__id">',
    '    <span class="gate__name">' + e(site.name) + '</span>',
    '    <span class="gate__title">' + e(site.role) + '</span>',
    '  </header>',
    '',
    '  <div class="gate__inner">',
    '    <p class="gate__eyebrow" id="gateStep">' + e(g.prompt) + '</p>',
    '',
    '    <div class="gate__loop" id="gateLoop">',
    '      <svg class="gate__ring" viewBox="0 0 360 240" aria-hidden="true">',
    '        <defs>',
    '          <pattern id="gateGrid" width="15" height="15" patternUnits="userSpaceOnUse">',
    '            <circle class="gate__dot" cx="1" cy="1" r="0.85"/>',
    '          </pattern>',
    '        </defs>',
    '        <rect class="gate__board" x="40" y="4" width="280" height="232" fill="url(#gateGrid)"/>',
    '        <path class="gate__arc" id="gseg1" d="M180 26 H246 A44 44 0 0 1 290 70 V120"/>',
    '        <path class="gate__arc gate__arc--gap" id="gseg2" d="M290 120 V170 A44 44 0 0 1 246 214 H180"/>',
    '        <path class="gate__arc gate__arc--gap" id="gseg3" d="M180 214 H114 A44 44 0 0 1 70 170 V120"/>',
    '        <path class="gate__arc" id="gseg4" d="M70 120 V70 A44 44 0 0 1 114 26 H180"/>',
    '        <g class="gate__flow">',
    '          <path d="' + arrow + '" transform="translate(277 39) rotate(45)"/>',
    '          <path d="' + arrow + '" transform="translate(277 201) rotate(135)"/>',
    '          <path d="' + arrow + '" transform="translate(83 201) rotate(225)"/>',
    '          <path d="' + arrow + '" transform="translate(83 39) rotate(315)"/>',
    '        </g>',
    '      </svg>',
    '      <div class="gate__node gate__node--n1"><b>01</b>' + e(g.nodes[0]) + '</div>',
    '      <div class="gate__node gate__node--n2"><b>02</b>' + e(g.nodes[1]) + '</div>',
    '      <div class="gate__node gate__node--n4"><b>04</b>' + e(g.nodes[2]) + '</div>',
    '      <div class="gate__slot" id="gateSlot" aria-label="Drop the missing step here"><b>03</b><span class="gate__slotT">?</span></div>',
    '    </div>',
    '',
    '    <button class="gate__chip" id="gateChip" type="button"',
    '            aria-label="' + a(g.missing) + ': drag into the gap, or press Enter"><b>03</b>' + e(g.missing) + '</button>',
    '    <span class="gate__hint" id="gateHint">' + e(g.hint) + '</span>',
    '',
    '    <div class="gate__fact" id="gateFact" hidden>',
    '      <span class="gate__factLabel">' + e(g.factLabel) + '</span>',
    '      <p class="gate__factText" id="gateFactText"></p>',
    '      <span class="gate__enter">' + e(g.enter) + '</span>',
    '      <div class="gate__count" aria-hidden="true"><span id="gateCount"></span></div>',
    '    </div>',
    '  </div>',
    '',
    '  <button class="gate__skip" id="gateSkip" type="button">' + e(g.skip) + '</button>',
    '  <div class="gate__load"><span id="gateLoad"></span></div>',
    '</div>'
  ].join('\n');
};
