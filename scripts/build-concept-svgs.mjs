#!/usr/bin/env node
/**
 * Generate theme-aware concept diagrams for /docs/svg/*.
 * Colors use CSS variables so inlined SVGs follow light / dark.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'docs', 'svg');
const FONT =
  "'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function text(x, y, value, opts = {}) {
  const {
    size = 13,
    weight = 400,
    fill = 'var(--foreground)',
    anchor = 'start',
    mono = false,
  } = opts;
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${mono ? MONO : FONT}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`;
}

const CARD_FILL = 'var(--background)';
const CARD_STROKE = 'color-mix(in oklab, var(--border) 35%, var(--foreground) 28%)';
const CANVAS_FILL = 'color-mix(in oklab, var(--muted) 82%, var(--foreground) 18%)';
const CHIP_FILL = 'color-mix(in oklab, var(--muted) 70%, var(--foreground) 10%)';
const ACCENT = 'var(--foreground)';

function rect(x, y, w, h, { fill = CARD_FILL, rx = 12, stroke = CARD_STROKE, sw = 1.4 } = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function arrow(x1, y1, x2, y2) {
  return `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="var(--muted-foreground)" stroke-width="1.5" marker-end="url(#arrow)"/>`;
}

function vArrow(x, y1, y2) {
  return arrow(x, y1, x, y2);
}

function hArrow(x1, y, x2) {
  return arrow(x1, y, x2, y);
}

function pill(cx, cy, label, { minW = 72 } = {}) {
  const w = Math.max(minW, 16 + [...label].length * 7.4);
  const h = 24;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `${rect(x, y, w, h, { fill: CHIP_FILL, rx: 12, stroke: CARD_STROKE })}${text(cx, cy + 4, label, {
    size: 11,
    weight: 500,
    fill: 'var(--foreground)',
    anchor: 'middle',
  })}`;
}

function badge(x, y, n) {
  return `${rect(x, y, 22, 22, { fill: 'var(--foreground)', rx: 7, stroke: 'none' })}${text(
    x + 11,
    y + 16,
    String(n),
    { size: 12, weight: 600, fill: 'var(--background)', anchor: 'middle' },
  )}`;
}

function nodeCard(x, y, w, h, { n, title, lines = [], kicker } = {}) {
  const parts = [
    rect(x, y, w, h),
    `<rect x="${x}" y="${y + 10}" width="3" height="${Math.max(24, h - 20)}" rx="1.5" fill="${ACCENT}"/>`,
  ];
  if (n) parts.push(badge(x + 14, y + 14, n));
  const titleX = n ? x + 44 : x + 16;
  if (kicker) {
    parts.push(text(titleX, y + 22, kicker, { size: 11, fill: 'var(--muted-foreground)' }));
    parts.push(text(titleX, y + 44, title, { size: 15, weight: 600 }));
  } else {
    parts.push(text(titleX, y + 30, title, { size: 15, weight: 600 }));
  }
  lines.forEach((line, i) => {
    parts.push(
      text(x + 16, y + (kicker ? 68 : 56) + i * 18, line, {
        size: 12,
        fill: 'var(--muted-foreground)',
        mono: /^(~\/|[A-Za-z_][\w./-]*[./_][\w./-]*|agx |127\.|@|tool:)/.test(line),
      }),
    );
  });
  return parts.join('');
}

function header(width, { eyebrow, title, subtitle }) {
  return [
    text(28, 32, eyebrow, { size: 12, fill: 'var(--muted-foreground)' }),
    text(28, 58, title, { size: 22, weight: 600 }),
    subtitle ? text(28, 82, subtitle, { size: 13, fill: 'var(--muted-foreground)' }) : '',
  ].join('');
}

function wrapLines(note, max = 44) {
  const lines = [];
  let current = '';
  const flush = () => {
    if (current) lines.push(current);
    current = '';
  };
  const tokens = note.split(/(\s+)/);
  const hasSpace = tokens.some((t) => t.trim() && /\s/.test(t));
  if (hasSpace && /[A-Za-z]/.test(note)) {
    for (const token of tokens) {
      if (!token) continue;
      if ((current + token).length > max && current.trim()) {
        flush();
        current = token.trimStart();
      } else {
        current += token;
      }
    }
    flush();
    return lines.map((line) => line.trim()).filter(Boolean);
  }
  for (const ch of note) {
    current += ch;
    if (current.length >= max) flush();
  }
  flush();
  return lines;
}

function footer(width, height, note) {
  const lines = wrapLines(note, 52);
  return lines
    .map((line, i) =>
      text(24, height - 16 - (lines.length - 1 - i) * 16, line, {
        size: 12,
        fill: 'var(--muted-foreground)',
      }),
    )
    .join('');
}

function rowCards(items, { y, x = 24, width = 800, h = 148, gap = 14, arrows = true } = {}) {
  const n = items.length;
  const cw = Math.floor((width - x * 2 - gap * (n - 1)) / n);
  return items
    .map((item, i) => {
      const cx = x + i * (cw + gap);
      return [
        arrows && i > 0 ? hArrow(cx - gap + 1, y + h / 2, cx - 2) : '',
        nodeCard(cx, y, cw, h, item),
      ].join('');
    })
    .join('');
}

function wrapSvg(width, height, title, desc, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${esc(title)}</title>
  <desc id="desc">${esc(desc)}</desc>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 1.6 L10 5 L0 8.4 z" fill="var(--muted-foreground)"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" rx="16" fill="${CANVAS_FILL}"/>
  ${body}
</svg>
`;
}

function architectureForms(L) {
  const w = 800;
  const h = 540;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.sdk.title, kicker: L.sdk.kicker, lines: L.sdk.lines },
        { n: 2, title: L.near.title, kicker: L.near.kicker, lines: L.near.lines },
        { n: 3, title: L.ent.title, kicker: L.ent.kicker, lines: L.ent.lines },
      ],
      { y: 108, width: w, h: 156, arrows: false },
    ),
    vArrow(148, 264, 292),
    vArrow(400, 264, 292),
    vArrow(652, 264, 292),
    rowCards(
      [
        { title: L.core.title, kicker: L.core.kicker, lines: L.core.lines },
        { title: L.studio.title, kicker: L.studio.kicker, lines: L.studio.lines },
        { title: L.gw.title, kicker: L.gw.kicker, lines: L.gw.lines },
      ],
      { y: 292, width: w, h: 148, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function architectureLayers(L) {
  const w = 800;
  const h = 680;
  const rows = L.layers
    .map((layer, i) => {
      const y = 108 + i * 102;
      let chipX = 74;
      const chips = layer.chips
        .map((chip) => {
          const cw = Math.max(96, 20 + [...chip].length * 7.4);
          const mark = `${rect(chipX, y + 58, cw, 24, { fill: CHIP_FILL, rx: 12 })}${text(
            chipX + cw / 2,
            y + 74,
            chip,
            { size: 11, weight: 500, fill: 'var(--foreground)', anchor: 'middle' },
          )}`;
          chipX += cw + 10;
          return mark;
        })
        .join('');
      return [
        rect(24, y, 752, 90, { rx: 14 }),
        `<rect x="24" y="${y + 10}" width="3" height="70" rx="1.5" fill="${ACCENT}"/>`,
        badge(40, y + 12, i + 1),
        text(74, y + 30, layer.title, { size: 16, weight: 600 }),
        text(74, y + 48, layer.sub, { size: 12, fill: 'var(--muted-foreground)' }),
        chips,
      ].join('');
    })
    .join('');
  const body = [header(w, L.header), rows, footer(w, h, L.note)];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function nearBoot(L) {
  const w = 800;
  const h = 528;
  const top = L.steps.slice(0, 3).map((step, i) => ({
    n: i + 1,
    title: step.title,
    kicker: step.kicker,
    lines: step.lines,
  }));
  const bottom = L.steps.slice(3).map((step, i) => ({
    n: i + 4,
    title: step.title,
    kicker: step.kicker,
    lines: step.lines,
  }));
  const body = [
    header(w, L.header),
    rowCards(top, { y: 108, width: w, h: 140 }),
    vArrow(400, 248, 268),
    rowCards(bottom, { y: 268, width: w, h: 128 }),
    rect(24, 412, 752, 68, { rx: 12 }),
    text(40, 434, L.disk.title, { size: 13, weight: 600 }),
    ...wrapLines(L.disk.line, 52).map((line, i) =>
      text(40, 454 + i * 16, line, { size: 12, fill: 'var(--muted-foreground)' }),
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function agentLoop(L) {
  const w = 800;
  const h = 560;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.user.title, kicker: L.user.kicker, lines: L.user.lines },
        { n: 2, title: L.sanit.title, kicker: L.sanit.kicker, lines: L.sanit.lines },
        { n: 3, title: L.compact.title, kicker: L.compact.kicker, lines: L.compact.lines },
      ],
      { y: 108, width: w, h: 140 },
    ),
    vArrow(400, 248, 268),
    rowCards(
      [
        { n: 4, title: L.llm.title, kicker: L.llm.kicker, lines: L.llm.lines },
        { n: 5, title: L.tools.title, kicker: L.tools.kicker, lines: L.tools.lines },
      ],
      { y: 268, width: w, h: 140 },
    ),
    pill(400, 258, L.loopLabel, { minW: 90 }),
    vArrow(400, 408, 428),
    rect(24, 428, 752, 44, { rx: 12 }),
    text(400, 456, L.final, { size: 14, weight: 600, anchor: 'middle' }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function toolsDispatch(L) {
  const w = 800;
  const h = 470;
  const body = [
    header(w, L.header),
    nodeCard(236, 108, 328, 86, { n: 1, title: L.llm.title, lines: L.llm.lines }),
    vArrow(400, 194, 214),
    nodeCard(200, 214, 400, 78, { n: 2, title: L.dispatch.title, lines: L.dispatch.lines }),
    vArrow(400, 292, 316),
    rowCards(
      [
        { title: L.studio.title, lines: L.studio.lines },
        { title: L.mcp.title, lines: L.mcp.lines },
        { title: L.skill.title, lines: L.skill.lines },
      ],
      { y: 316, width: w, h: 88, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function memoryRecall(L) {
  const w = 800;
  const h = 460;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.files.title, kicker: L.files.kicker, lines: L.files.lines },
        { n: 2, title: L.hist.title, kicker: L.hist.kicker, lines: L.hist.lines },
      ],
      { y: 108, width: w, h: 136, arrows: false },
    ),
    vArrow(216, 244, 268),
    vArrow(584, 244, 268),
    rowCards(
      [
        { n: 3, title: L.merge.title, kicker: L.merge.kicker, lines: L.merge.lines },
        { n: 4, title: L.prompt.title, kicker: L.prompt.kicker, lines: L.prompt.lines },
      ],
      { y: 268, width: w, h: 136 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function orchestrationBranch(L) {
  const w = 800;
  const h = 460;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.fetch.title, kicker: L.fetch.kicker, lines: L.fetch.lines },
        { n: 2, title: L.analyze.title, kicker: L.analyze.kicker, lines: L.analyze.lines },
      ],
      { y: 108, width: w, h: 128 },
    ),
    vArrow(400, 236, 260),
    rowCards(
      [
        { n: 3, title: L.publish.title, kicker: L.publish.kicker, lines: L.publish.lines },
        { n: 4, title: L.review.title, kicker: L.review.kicker, lines: L.review.lines },
      ],
      { y: 260, width: w, h: 120, arrows: false },
    ),
    pill(216, 250, L.high, { minW: 72 }),
    pill(584, 250, L.low, { minW: 72 }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function flowDecorators(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.start.title, kicker: '@start', lines: L.start.lines },
        { n: 2, title: L.listen.title, kicker: '@listen', lines: L.listen.lines },
        { n: 3, title: L.router.title, kicker: '@router', lines: L.router.lines },
      ],
      { y: 108, width: w, h: 132 },
    ),
    vArrow(400, 240, 264),
    rowCards(
      [
        { title: L.a.title, lines: L.a.lines },
        { title: L.b.title, lines: L.b.lines },
      ],
      { y: 264, width: w, h: 100, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function llmConfig(L) {
  const w = 800;
  const h = 460;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.ui.title, kicker: L.ui.kicker, lines: L.ui.lines },
        { n: 2, title: L.yaml.title, kicker: L.yaml.kicker, lines: L.yaml.lines },
      ],
      { y: 108, width: w, h: 132 },
    ),
    vArrow(400, 240, 260),
    rowCards(
      [
        { n: 3, title: L.provider.title, kicker: L.provider.kicker, lines: L.provider.lines },
        { n: 4, title: L.up.title, kicker: L.up.kicker, lines: L.up.lines },
      ],
      { y: 260, width: w, h: 120 },
    ),
    footer(w, h, L.rule + ' ' + L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function hooksLifecycle(L) {
  const w = 800;
  const h = 500;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.start.title, kicker: L.start.kicker, lines: L.start.lines },
        { n: 2, title: L.before.title, kicker: L.before.kicker, lines: L.before.lines },
      ],
      { y: 108, width: w, h: 120 },
    ),
    vArrow(400, 228, 248),
    rowCards(
      [
        { n: 3, title: L.tool.title, kicker: L.tool.kicker, lines: L.tool.lines },
        { n: 4, title: L.after.title, kicker: L.after.kicker, lines: L.after.lines },
      ],
      { y: 248, width: w, h: 110 },
    ),
    vArrow(216, 358, 378),
    nodeCard(24, 378, 752, 58, { title: `${L.confirm.title}  ·  ${L.confirm.lines[0] ?? ''}` }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function skillsLifecycle(L) {
  const w = 800;
  const h = 590;
  const body = [
    header(w, L.header),
    text(24, 108, L.trackA, { size: 12, weight: 600, fill: 'var(--muted-foreground)' }),
    rowCards(
      [
        { n: 1, title: L.scan.title, lines: L.scan.lines },
        { n: 2, title: L.guard.title, lines: L.guard.lines },
      ],
      { y: 118, width: w, h: 100 },
    ),
    vArrow(216, 218, 232),
    rowCards(
      [
        { n: 3, title: L.visible.title, lines: L.visible.lines },
        { n: 4, title: L.use.title, lines: L.use.lines },
      ],
      { y: 232, width: w, h: 92 },
    ),
    nodeCard(24, 338, 368, 52, { title: L.blocked.title, lines: L.blocked.lines }),
    text(24, 410, L.trackB, { size: 12, weight: 600, fill: 'var(--muted-foreground)' }),
    rowCards(
      [
        { title: L.observe.title, lines: L.observe.lines },
        { title: L.review.title, lines: L.review.lines },
        { title: L.gate.title, lines: L.gate.lines },
        { title: L.create.title, lines: L.create.lines },
      ],
      { y: 420, width: w, h: 108 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function longrunCycle(L) {
  const w = 800;
  const h = 530;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.src.title, kicker: L.src.kicker, lines: L.src.lines },
        { n: 2, title: L.orch.title, kicker: L.orch.kicker, lines: L.orch.lines },
      ],
      { y: 108, width: w, h: 120 },
    ),
    vArrow(400, 228, 248),
    rowCards(
      [
        { n: 3, title: L.ws.title, kicker: L.ws.kicker, lines: L.ws.lines },
        { n: 4, title: L.impl.title, lines: L.impl.lines },
      ],
      { y: 248, width: w, h: 110 },
    ),
    vArrow(400, 358, 376),
    rowCards(
      [
        { n: 5, title: L.stall.title, lines: L.stall.lines },
        { title: L.verify.title, lines: L.verify.lines },
        { title: L.commit.title, lines: L.commit.lines },
      ],
      { y: 376, width: w, h: 92, arrows: false },
    ),
    pill(400, 368, L.retry, { minW: 72 }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function introPath(L) {
  const w = 800;
  const h = 430;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.you.title, kicker: L.you.kicker },
        { n: 2, title: L.door.title, kicker: L.door.kicker },
        { n: 3, title: L.studio.title, kicker: L.studio.kicker },
        { n: 4, title: L.rt.title, kicker: L.rt.kicker },
      ],
      { y: 108, width: w, h: 108 },
    ),
    vArrow(400, 216, 236),
    rowCards(
      [
        { title: L.tools.title, lines: L.tools.lines },
        { title: L.llm.title, lines: L.llm.lines },
        { title: L.mem.title, lines: L.mem.lines },
      ],
      { y: 236, width: w, h: 112, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function installPaths(L) {
  const w = 800;
  const h = 430;
  const body = [
    header(w, L.header),
    nodeCard(236, 108, 328, 80, { n: 1, title: L.pip.title, lines: L.pip.lines }),
    vArrow(300, 188, 208),
    vArrow(500, 188, 208),
    rowCards(
      [
        { n: 2, title: L.cli.title, kicker: L.cli.kicker, lines: L.cli.lines },
        { n: 3, title: L.sdk.title, kicker: L.sdk.kicker, lines: L.sdk.lines },
      ],
      { y: 208, width: w, h: 120, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function quickstartPaths(L) {
  const w = 800;
  const h = 430;
  const body = [
    header(w, L.header),
    text(24, 108, L.trackA, { size: 12, weight: 600, fill: 'var(--muted-foreground)' }),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
        { n: 3, title: L.c.title, lines: L.c.lines },
      ],
      { y: 118, width: w, h: 100 },
    ),
    text(24, 240, L.trackB, { size: 12, weight: 600, fill: 'var(--muted-foreground)' }),
    rowCards(
      [
        { n: 1, title: L.d.title, lines: L.d.lines },
        { n: 2, title: L.e.title, lines: L.e.lines },
        { n: 3, title: L.f.title, lines: L.f.lines },
      ],
      { y: 250, width: w, h: 100 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function configYaml(L) {
  const w = 800;
  const h = 430;
  const body = [
    header(w, L.header),
    nodeCard(24, 108, 752, 78, { n: 1, title: L.yaml.title, kicker: L.yaml.kicker, lines: L.yaml.lines }),
    vArrow(400, 186, 206),
    rowCards(
      [
        { title: L.serve.title, lines: L.serve.lines },
        { title: L.runtime.title, lines: L.runtime.lines },
        { title: L.providers.title, lines: L.providers.lines },
        { title: L.skills.title, lines: L.skills.lines },
      ],
      { y: 206, width: w, h: 120, arrows: false },
    ),
    pill(616, 196, L.env, { minW: 88 }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function firstAgentLoop(L) {
  const w = 800;
  const h = 430;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.topic.title, lines: L.topic.lines },
        { n: 2, title: L.task.title, lines: L.task.lines },
        { n: 3, title: L.exec.title, lines: L.exec.lines },
      ],
      { y: 108, width: w, h: 110 },
    ),
    vArrow(400, 218, 238),
    rowCards(
      [
        { n: 4, title: L.llm.title, lines: L.llm.lines },
        { n: 5, title: L.tools.title, lines: L.tools.lines },
      ],
      { y: 238, width: w, h: 100 },
    ),
    pill(400, 228, L.loop, { minW: 90 }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function multiAgentRoute(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.user.title, kicker: L.user.kicker },
        { n: 2, title: L.meta.title, kicker: L.meta.kicker, lines: L.meta.lines },
      ],
      { y: 108, width: w, h: 100 },
    ),
    vArrow(400, 208, 228),
    rowCards(
      [
        { title: L.mention.title, kicker: L.mention.kicker, lines: L.mention.lines },
        { title: L.delegate.title, kicker: L.delegate.kicker, lines: L.delegate.lines },
        { title: L.spawn.title, kicker: L.spawn.kicker, lines: L.spawn.lines },
      ],
      { y: 228, width: w, h: 118, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function studioSse(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.ui.title, kicker: L.ui.kicker, lines: L.ui.lines },
        { n: 2, title: L.main.title, kicker: L.main.kicker, lines: L.main.lines },
        { n: 3, title: L.api.title, kicker: L.api.kicker, lines: L.api.lines },
      ],
      { y: 108, width: w, h: 118 },
    ),
    vArrow(400, 226, 246),
    rowCards(
      [
        { n: 4, title: L.sm.title, lines: L.sm.lines },
        { n: 5, title: L.ar.title, lines: L.ar.lines },
        { n: 6, title: L.sse.title, lines: L.sse.lines },
      ],
      { y: 246, width: w, h: 110 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function knowledgeIngest(L) {
  const w = 800;
  const h = 450;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.files.title, lines: L.files.lines },
        { n: 2, title: L.parse.title, lines: L.parse.lines },
        { n: 3, title: L.chunk.title, lines: L.chunk.lines },
      ],
      { y: 108, width: w, h: 100 },
    ),
    vArrow(400, 208, 228),
    rowCards(
      [
        { n: 4, title: L.embed.title, lines: L.embed.lines },
        { n: 5, title: L.store.title, lines: L.store.lines },
        { n: 6, title: L.search.title, lines: L.search.lines },
      ],
      { y: 228, width: w, h: 100 },
    ),
    nodeCard(24, 344, 752, 56, { title: `${L.code.title}  ·  ${L.code.lines[0] ?? ''}` }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function extensionsBundle(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.scan.title, lines: L.scan.lines },
        { n: 2, title: L.guard.title, lines: L.guard.lines },
        { n: 3, title: L.list.title, lines: L.list.lines },
      ],
      { y: 108, width: w, h: 110 },
    ),
    vArrow(400, 218, 238),
    rowCards(
      [
        { title: L.use.title, kicker: L.use.kicker, lines: L.use.lines },
        { title: L.prompt.title, kicker: L.prompt.kicker, lines: L.prompt.lines },
        { title: L.mcp.title, kicker: L.mcp.kicker, lines: L.mcp.lines },
      ],
      { y: 238, width: w, h: 118, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function deployServe(L) {
  const w = 800;
  const h = 400;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.client.title, lines: L.client.lines },
        { n: 2, title: L.serve.title, lines: L.serve.lines },
        { n: 3, title: L.app.title, lines: L.app.lines },
        { n: 4, title: L.disk.title, lines: L.disk.lines },
      ],
      { y: 108, width: w, h: 130 },
    ),
    pill(400, 250, L.proxy, { minW: 100 }),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function apiExecutor(L) {
  const w = 800;
  const h = 400;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.agent.title, lines: L.agent.lines },
        { n: 2, title: L.task.title, lines: L.task.lines },
      ],
      { y: 108, width: w, h: 100, arrows: false },
    ),
    vArrow(216, 208, 228),
    vArrow(584, 208, 228),
    rowCards(
      [
        { n: 3, title: L.exec.title, kicker: L.exec.kicker, lines: L.exec.lines },
        { n: 4, title: L.result.title, kicker: L.result.kicker, lines: L.result.lines },
      ],
      { y: 228, width: w, h: 100 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function cliCommands(L) {
  const w = 800;
  const h = 360;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.serve.title, kicker: L.serve.kicker, lines: L.serve.lines },
        { n: 2, title: L.studio.title, kicker: L.studio.kicker, lines: L.studio.lines },
        { n: 3, title: L.feishu.title, kicker: L.feishu.kicker, lines: L.feishu.lines },
      ],
      { y: 108, width: w, h: 160, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function faqDoors(L) {
  const w = 800;
  const h = 420;
  const body = [
    header(w, L.header),
    nodeCard(236, 108, 328, 72, { n: 1, title: L.q.title }),
    vArrow(400, 180, 200),
    rowCards(
      [
        { title: L.sdk.title, kicker: L.sdk.kicker, lines: L.sdk.lines },
        { title: L.desk.title, kicker: L.desk.kicker, lines: L.desk.lines },
        { title: L.ent.title, kicker: L.ent.kicker, lines: L.ent.lines },
      ],
      { y: 200, width: w, h: 140, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function changelogArc(L) {
  const w = 800;
  const h = 340;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
        { n: 3, title: L.c.title, lines: L.c.lines },
        { n: 4, title: L.d.title, lines: L.d.lines },
      ],
      { y: 108, width: w, h: 150 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function roadmapNext(L) {
  const w = 800;
  const h = 360;
  const body = [
    header(w, L.header),
    nodeCard(24, 108, 752, 72, { n: 1, title: L.done.title, lines: L.done.lines }),
    vArrow(400, 180, 200),
    rowCards(
      [
        { title: L.m12.title, lines: L.m12.lines },
        { title: L.m18.title, lines: L.m18.lines },
        { title: L.cluster.title, lines: L.cluster.lines },
      ],
      { y: 200, width: w, h: 88, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function guidesMap(L) {
  const w = 800;
  const h = 400;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
        { n: 3, title: L.c.title, lines: L.c.lines },
      ],
      { y: 108, width: w, h: 110, arrows: false },
    ),
    rowCards(
      [
        { n: 4, title: L.d.title, lines: L.d.lines },
        { n: 5, title: L.e.title, lines: L.e.lines },
        { n: 6, title: L.f.title, lines: L.f.lines },
      ],
      { y: 232, width: w, h: 110, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function apiMap(L) {
  const w = 800;
  const h = 400;
  const body = [
    header(w, L.header),
    nodeCard(24, 108, 752, 80, { n: 1, title: L.sdk.title, kicker: L.sdk.kicker, lines: L.sdk.lines }),
    vArrow(400, 188, 208),
    rowCards(
      [
        { title: L.agents.title, lines: L.agents.lines },
        { title: L.concepts.title, lines: L.concepts.lines },
        { title: L.runtime.title, lines: L.runtime.lines },
      ],
      { y: 208, width: w, h: 120, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function twoColSteps(items, { y, width = 800, x = 24, h = 86, gap = 10 } = {}) {
  const colW = Math.floor((width - x * 2 - 16) / 2);
  const mid = Math.ceil(items.length / 2);
  return items
    .map((item, i) => {
      const col = i < mid ? 0 : 1;
      const row = i < mid ? i : i - mid;
      const cx = x + col * (colW + 16);
      const cy = y + row * (h + gap);
      return nodeCard(cx, cy, colW, h, item);
    })
    .join('');
}

function entTopo(L) {
  const w = 800;
  const h = 560;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.emp.title, kicker: L.emp.kicker, lines: L.emp.lines },
        { n: 2, title: L.adm.title, kicker: L.adm.kicker, lines: L.adm.lines },
      ],
      { y: 108, width: w, h: 88, arrows: false },
    ),
    vArrow(220, 196, 220),
    vArrow(580, 196, 220),
    rowCards(
      [
        { title: L.portal.title, kicker: L.portal.kicker, lines: L.portal.lines },
        { title: L.console.title, kicker: L.console.kicker, lines: L.console.lines },
        { title: L.gw.title, kicker: L.gw.kicker, lines: L.gw.lines },
      ],
      { y: 220, width: w, h: 118, arrows: false },
    ),
    vArrow(148, 338, 360),
    vArrow(400, 338, 360),
    vArrow(652, 338, 360),
    rowCards(
      [
        { title: L.pg.title, kicker: L.pg.kicker, lines: L.pg.lines },
        { title: L.redis.title, kicker: L.redis.kicker, lines: L.redis.lines },
        { title: L.up.title, kicker: L.up.kicker, lines: L.up.lines },
      ],
      { y: 360, width: w, h: 118, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entChatSeq(L) {
  const w = 800;
  const h = 560;
  const body = [
    header(w, L.header),
    twoColSteps(
      [
        { n: 1, title: L.s1.title, lines: L.s1.lines },
        { n: 2, title: L.s2.title, lines: L.s2.lines },
        { n: 3, title: L.s3.title, lines: L.s3.lines },
        { n: 4, title: L.s4.title, lines: L.s4.lines },
        { n: 5, title: L.s5.title, lines: L.s5.lines },
        { n: 6, title: L.s6.title, lines: L.s6.lines },
        { n: 7, title: L.s7.title, lines: L.s7.lines },
        { n: 8, title: L.s8.title, lines: L.s8.lines },
      ],
      { y: 108, width: w, h: 88 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entFour(L) {
  const w = 800;
  const h = 420;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
      ],
      { y: 108, width: w, h: 110 },
    ),
    vArrow(400, 218, 238),
    rowCards(
      [
        { n: 3, title: L.c.title, lines: L.c.lines },
        { n: 4, title: L.d.title, lines: L.d.lines },
      ],
      { y: 238, width: w, h: 110 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entThree(L) {
  const w = 800;
  const h = 340;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
        { n: 3, title: L.c.title, lines: L.c.lines },
      ],
      { y: 108, width: w, h: 148 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entFive(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
        { n: 3, title: L.c.title, lines: L.c.lines },
      ],
      { y: 108, width: w, h: 110 },
    ),
    vArrow(400, 218, 238),
    rowCards(
      [
        { n: 4, title: L.d.title, lines: L.d.lines },
        { n: 5, title: L.e.title, lines: L.e.lines },
      ],
      { y: 238, width: w, h: 118 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entSso(L) {
  const w = 800;
  const h = 470;
  const body = [
    header(w, L.header),
    twoColSteps(
      [
        { n: 1, title: L.s1.title, lines: L.s1.lines },
        { n: 2, title: L.s2.title, lines: L.s2.lines },
        { n: 3, title: L.s3.title, lines: L.s3.lines },
        { n: 4, title: L.s4.title, lines: L.s4.lines },
        { n: 5, title: L.s5.title, lines: L.s5.lines },
        { n: 6, title: L.s6.title, lines: L.s6.lines },
      ],
      { y: 108, width: w, h: 92 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entGwChat(L) {
  const w = 800;
  const h = 560;
  const body = [
    header(w, L.header),
    twoColSteps(
      [
        { n: 1, title: L.s1.title, lines: L.s1.lines },
        { n: 2, title: L.s2.title, lines: L.s2.lines },
        { n: 3, title: L.s3.title, lines: L.s3.lines },
        { n: 4, title: L.s4.title, lines: L.s4.lines },
        { n: 5, title: L.s5.title, lines: L.s5.lines },
        { n: 6, title: L.s6.title, lines: L.s6.lines },
        { n: 7, title: L.s7.title, lines: L.s7.lines },
        { n: 8, title: L.s8.title, lines: L.s8.lines },
      ],
      { y: 108, width: w, h: 88 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entSchema(L) {
  const w = 800;
  const h = 520;
  const body = [
    header(w, L.header),
    nodeCard(24, 108, 752, 78, { n: 1, title: L.tenant.title, kicker: L.tenant.kicker, lines: L.tenant.lines }),
    vArrow(400, 186, 206),
    rowCards(
      [
        { title: L.iam.title, kicker: L.iam.kicker, lines: L.iam.lines },
        { title: L.chat.title, kicker: L.chat.kicker, lines: L.chat.lines },
        { title: L.policy.title, kicker: L.policy.kicker, lines: L.policy.lines },
      ],
      { y: 206, width: w, h: 118, arrows: false },
    ),
    vArrow(400, 324, 344),
    rowCards(
      [
        { title: L.runtime.title, kicker: L.runtime.kicker, lines: L.runtime.lines },
        { title: L.audit.title, kicker: L.audit.kicker, lines: L.audit.lines },
        { title: L.chan.title, kicker: L.chan.kicker, lines: L.chan.lines },
      ],
      { y: 344, width: w, h: 110, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entMcp(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    nodeCard(24, 108, 752, 72, { n: 1, title: L.route.title, kicker: L.route.kicker, lines: L.route.lines }),
    vArrow(400, 180, 200),
    rowCards(
      [
        { title: L.reg.title, kicker: L.reg.kicker, lines: L.reg.lines },
        { title: L.back.title, kicker: L.back.kicker, lines: L.back.lines },
        { title: L.tr.title, kicker: L.tr.kicker, lines: L.tr.lines },
      ],
      { y: 200, width: w, h: 148, arrows: false },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

function entKeypool(L) {
  const w = 800;
  const h = 440;
  const body = [
    header(w, L.header),
    rowCards(
      [
        { n: 1, title: L.a.title, lines: L.a.lines },
        { n: 2, title: L.b.title, lines: L.b.lines },
        { n: 3, title: L.c.title, lines: L.c.lines },
      ],
      { y: 108, width: w, h: 118 },
    ),
    vArrow(400, 226, 246),
    rowCards(
      [
        { n: 4, title: L.d.title, lines: L.d.lines },
        { n: 5, title: L.e.title, lines: L.e.lines },
      ],
      { y: 246, width: w, h: 118 },
    ),
    footer(w, h, L.note),
  ];
  return wrapSvg(w, h, L.header.title, L.desc, body.join(''));
}

const copy = {
  'architecture-forms': {
    fn: architectureForms,
    en: {
      header: {
        eyebrow: 'Product forms',
        title: 'One capability core, three doors',
        subtitle: 'Near and Enterprise share abstractions. Their deploy paths stay independent.',
      },
      desc: 'SDK, Near Desktop, and Enterprise sit on different runtimes but can call the same upstream models.',
      sdk: { kicker: 'Your process', title: 'SDK / CLI', lines: ['AgentExecutor(llm_provider=)', 'run(agent=, task=)', 'No Near panes'] },
      near: { kicker: 'Local workspace', title: 'Near Desktop', lines: ['spawn agx serve', 'REST + SSE', '127.0.0.1 only'] },
      ent: { kicker: 'Governed web', title: 'Enterprise', lines: ['Portal + Admin', 'Go AI Gateway', 'Not AgentRuntime'] },
      core: { kicker: 'Python', title: 'Capability core', lines: ['Tools · MCP · Memory · Skills', 'Hooks · KB · LLM providers'] },
      studio: { kicker: 'Near path', title: 'Studio + AgentRuntime', lines: ['run_turn · sessions', 'avatars · group chat'] },
      gw: { kicker: 'Enterprise path', title: 'Go Gateway', lines: ['Policy · quota · audit', 'OpenAI-compatible relay'] },
      note: 'Do not expect Desktop panes behind the Gateway. The official architecture JPGs above are the product maps.',
    },
    zh: {
      header: {
        eyebrow: '产品形态',
        title: '一套能力核心，三扇门',
        subtitle: 'Near 与 Enterprise 共用抽象，当前部署路径彼此独立。',
      },
      desc: 'SDK、Near 桌面与 Enterprise 走不同运行时，但都可以打到上游模型。',
      sdk: { kicker: '你的进程', title: 'SDK / CLI', lines: ['AgentExecutor(llm_provider=)', 'run(agent=, task=)', '没有 Near 窗格'] },
      near: { kicker: '本机工作区', title: 'Near 桌面', lines: ['拉起 agx serve', 'REST + SSE', '只连 127.0.0.1'] },
      ent: { kicker: '受管控 Web', title: 'Enterprise', lines: ['Portal + 管理台', 'Go AI 网关', '不是 AgentRuntime'] },
      core: { kicker: 'Python', title: '能力核心', lines: ['工具 · MCP · 记忆 · 技能', 'Hooks · 知识库 · LLM'] },
      studio: { kicker: 'Near 路径', title: 'Studio + AgentRuntime', lines: ['run_turn · 会话', '分身 · 群聊'] },
      gw: { kicker: 'Enterprise 路径', title: 'Go 网关', lines: ['策略 · 配额 · 审计', 'OpenAI 兼容中继'] },
      note: '不要指望网关后面还有 Desktop 窗格。上面的正式架构图才是产品总图。',
    },
  },
  'architecture-layers': {
    fn: architectureLayers,
    en: {
      header: {
        eyebrow: 'Runtime stack',
        title: 'Five layers, UI down to platform',
        subtitle: 'Read the Python / Near path this way. Enterprise Gateway is a different process.',
      },
      desc: 'UI, Studio, core runtime, protocols, and platform services.',
      layers: [
        { title: 'User interface', sub: 'How a human starts a turn', chips: ['Near panes', 'agx CLI', 'Python SDK'] },
        { title: 'Studio', sub: 'Session, Meta, and team control plane', chips: ['SessionManager', 'Meta-Agent', 'AgentTeamManager'] },
        { title: 'Core', sub: 'Think-act loop and shared capabilities', chips: ['AgentRuntime', 'Tools / MCP', 'Memory / Skills'] },
        { title: 'Protocols', sub: 'Talk to tools and other agents', chips: ['MCP Hub', 'A2A', 'Hooks'] },
        { title: 'Platform', sub: 'What lands on disk under ~/.agenticx', chips: ['config.yaml', 'sessions', 'Knowledge brains'] },
      ],
      note: 'Layer 2–3 are AgentRuntime. The Gateway does policy and relay; it does not run this loop.',
    },
    zh: {
      header: {
        eyebrow: '运行时分层',
        title: '五层：从界面到平台',
        subtitle: '按 Python / Near 这条路径来读。Enterprise 网关是另一个进程。',
      },
      desc: '界面、Studio、核心运行时、协议与平台服务。',
      layers: [
        { title: '用户界面', sub: '人从哪里发起一轮', chips: ['Near 窗格', 'agx CLI', 'Python SDK'] },
        { title: 'Studio', sub: '会话、Meta 与团队控制面', chips: ['SessionManager', 'Meta-Agent', 'AgentTeamManager'] },
        { title: '核心', sub: 'think-act 循环与共享能力', chips: ['AgentRuntime', '工具 / MCP', '记忆 / 技能'] },
        { title: '协议', sub: '连工具与其他智能体', chips: ['MCP Hub', 'A2A', 'Hooks'] },
        { title: '平台', sub: '落在 ~/.agenticx 里的东西', chips: ['config.yaml', 'sessions', '知识脑'] },
      ],
      note: '第 2–3 层才是 AgentRuntime。网关做策略与中继，不跑这套循环。',
    },
  },
  'near-boot': {
    fn: nearBoot,
    en: {
      header: {
        eyebrow: 'Boot path',
        title: 'Near attaches to a local agx serve',
        subtitle: 'Desktop is not a second runtime. It starts Studio, then talks REST + SSE.',
      },
      desc: 'Near app spawns agx serve, writes port and token, then calls AgentRuntime.',
      steps: [
        { kicker: 'Electron', title: 'Near app', lines: ['React + Zustand', 'Hard-binds localhost'] },
        { kicker: 'Child process', title: 'spawn serve', lines: ['agx serve / agx-server', '127.0.0.1'] },
        { kicker: 'Discovery', title: 'Write port', lines: ['~/.agenticx/serve.port', 'serve.token'] },
        { kicker: 'HTTP', title: 'Studio API', lines: ['REST + SSE', 'AGX_DESKTOP_TOKEN'] },
        { kicker: 'Loop', title: 'AgentRuntime', lines: ['run_turn', 'Meta / avatars'] },
      ],
      disk: {
        title: 'If every list looks empty',
        line: 'Check serve.port is still listening. A crashed import in studio/server.py looks like data loss; it is not.',
      },
      note: 'Remote agx serve is not the default product path. Closing a pane should restore the last session, not create a blank one.',
    },
    zh: {
      header: {
        eyebrow: '启动链路',
        title: 'Near 挂上本机 agx serve',
        subtitle: '桌面端不是第二套运行时。它拉起 Studio，再用 REST + SSE 通信。',
      },
      desc: 'Near 应用拉起 agx serve，写入端口和令牌，再调用 AgentRuntime。',
      steps: [
        { kicker: 'Electron', title: 'Near 应用', lines: ['React + Zustand', '硬绑本机'] },
        { kicker: '子进程', title: '拉起 serve', lines: ['agx serve / agx-server', '127.0.0.1'] },
        { kicker: '发现', title: '写端口', lines: ['~/.agenticx/serve.port', 'serve.token'] },
        { kicker: 'HTTP', title: 'Studio API', lines: ['REST + SSE', 'AGX_DESKTOP_TOKEN'] },
        { kicker: '循环', title: 'AgentRuntime', lines: ['run_turn', 'Meta / 分身'] },
      ],
      disk: {
        title: '如果列表突然全空',
        line: '先看 serve.port 还在不在听。studio/server.py 导入崩溃会像丢数据，数据通常还在。',
      },
      note: '连接远程 agx serve 不是默认产品路径。关掉窗格再打开，应回到最近会话，而不是空白新会话。',
    },
  },
  'agent-loop': {
    fn: agentLoop,
    en: {
      header: {
        eyebrow: 'AgentRuntime.run_turn',
        title: 'One chat turn: clean, think, act, or finish',
        subtitle: 'Studio / Near path. SDK embedding uses AgentExecutor(llm_provider=).run(agent=, task=).',
      },
      desc: 'Sanitize tool rows, maybe compact, invoke the model, dispatch tools, detect loops, then FINAL.',
      user: { kicker: 'Input', title: 'User message', lines: ['SSE stays on this session', '@file keeps sourcePath'] },
      sanit: { kicker: 'Safety', title: 'Sanitize tools', lines: ['Drop orphan tool_calls', 'Avoid provider 400'] },
      compact: { kicker: 'Context', title: 'Maybe compact', lines: ['Long history only', 'Keep the live turn'] },
      llm: { kicker: 'Model', title: 'Invoke / stream', lines: ['<think> → Thought block', 'Text only → FINAL'] },
      tools: { kicker: 'Act', title: 'dispatch_tool_async', lines: ['LoopDetector watches', 'Confirm gates can pause'] },
      loopLabel: 'tool_calls',
      final: 'FINAL  ·  write messages.json',
      note: 'Broken assistant/tool sequences are cleaned before the next provider call. You should not see a raw HTTP 400 in the bubble.',
    },
    zh: {
      header: {
        eyebrow: 'AgentRuntime.run_turn',
        title: '一轮对话：清洗、思考、行动或收束',
        subtitle: 'Studio / Near 路径。SDK 嵌入走 AgentExecutor(llm_provider=).run(agent=, task=)。',
      },
      desc: '清洗工具行、按需压缩、调用模型、分发工具、检测循环，然后 FINAL。',
      user: { kicker: '输入', title: '用户消息', lines: ['SSE 绑在本会话', '@file 保留绝对路径'] },
      sanit: { kicker: '安全', title: '清洗工具序列', lines: ['丢掉孤儿 tool_calls', '避免 provider 400'] },
      compact: { kicker: '上下文', title: '按需压缩', lines: ['只在历史很长时', '保住当前这一轮'] },
      llm: { kicker: '模型', title: '调用 / 流式', lines: ['<think> → 思考块', '纯文本 → FINAL'] },
      tools: { kicker: '行动', title: 'dispatch_tool_async', lines: ['LoopDetector 盯着', '确认门可以暂停'] },
      loopLabel: 'tool_calls',
      final: 'FINAL  ·  写入 messages.json',
      note: '断裂的 assistant / tool 序列会在下一次请求前洗掉。气泡里不应出现裸的 HTTP 400。',
    },
  },
  'tools-dispatch': {
    fn: toolsDispatch,
    en: {
      header: {
        eyebrow: 'Tool contract',
        title: 'One dispatcher, three places a call can land',
        subtitle: 'A @tool in your script is not automatically visible in Near.',
      },
      desc: 'LLM tool_calls go through dispatch_tool_async to STUDIO_TOOLS, MCP, or skill_use.',
      llm: { title: 'LLM tool_calls', lines: ['Name + arguments'] },
      dispatch: { title: 'dispatch_tool_async', lines: ['Policy · hooks · timeout'] },
      studio: { title: 'STUDIO_TOOLS', lines: ['file_read · liteparse · bash'] },
      mcp: { title: 'MCPHub / mcp_call', lines: ['Added ≠ call will succeed'] },
      skill: { title: 'skill_use', lines: ['Progressive disclosure'] },
      note: 'Results return to the model. Group chat folds progress into one card per avatar, not one bubble per tool.',
    },
    zh: {
      header: {
        eyebrow: '工具契约',
        title: '一个分发器，调用可能落在三处',
        subtitle: '脚本里 @tool 的工具不会自动出现在 Near。',
      },
      desc: 'LLM 的 tool_calls 经 dispatch_tool_async 落到 STUDIO_TOOLS、MCP 或 skill_use。',
      llm: { title: 'LLM tool_calls', lines: ['名字 + 参数'] },
      dispatch: { title: 'dispatch_tool_async', lines: ['策略 · 钩子 · 超时'] },
      studio: { title: 'STUDIO_TOOLS', lines: ['file_read · liteparse · bash'] },
      mcp: { title: 'MCPHub / mcp_call', lines: ['已添加 ≠ 调用必成功'] },
      skill: { title: 'skill_use', lines: ['渐进披露'] },
      note: '结果回到模型。群聊把进度折进每个分身一张卡，而不是每个工具一条气泡。',
    },
  },
  'memory-recall': {
    fn: memoryRecall,
    en: {
      header: {
        eyebrow: 'Memory',
        title: 'Workspace notes and the live transcript are different files',
        subtitle: 'Do not mix ~/.agenticx/workspace with an empty session_store.db.',
      },
      desc: 'MEMORY.md is recalled into the Meta system prompt; messages.json may be compacted.',
      files: { kicker: 'Long-term', title: 'MEMORY.md', lines: ['~/.agenticx/workspace', '_build_memory_recall_context'] },
      hist: { kicker: 'This session', title: 'messages.json', lines: ['~/.agenticx/sessions/<id>', 'maybe compact'] },
      merge: { kicker: 'Meta', title: 'Assemble prompt', lines: ['_build_user_profile_block', 'active subagents snapshot'] },
      prompt: { kicker: 'This turn', title: 'System prompt', lines: ['Preferences stay', 'Titles live in SQLite'] },
      note: 'Session titles / FTS: ~/.agenticx/memory/sessions.sqlite. The next turn should already know a preference you wrote down.',
    },
    zh: {
      header: {
        eyebrow: '记忆',
        title: '工作区笔记和当场记录不是同一份文件',
        subtitle: '不要把 ~/.agenticx/workspace 和工作区下空的 session_store.db 混用。',
      },
      desc: 'MEMORY.md 召回到 Meta 系统提示；messages.json 可能被压缩。',
      files: { kicker: '长期', title: 'MEMORY.md', lines: ['~/.agenticx/workspace', '_build_memory_recall_context'] },
      hist: { kicker: '本会话', title: 'messages.json', lines: ['~/.agenticx/sessions/<id>', '按需压缩'] },
      merge: { kicker: 'Meta', title: '拼系统提示', lines: ['_build_user_profile_block', '活跃子智能体快照'] },
      prompt: { kicker: '这一轮', title: '系统提示', lines: ['偏好还在', '标题在 SQLite'] },
      note: '会话标题 / FTS：~/.agenticx/memory/sessions.sqlite。你写下的偏好，下一轮就应该已经知道。',
    },
  },
  'orchestration-branch': {
    fn: orchestrationBranch,
    en: {
      header: {
        eyebrow: 'In-process graph',
        title: 'Workflow nodes branch; Near groups do not use this constructor',
        subtitle: 'SDK graphs are Workflow / Node / Edge. Group chat is group_router + delegate_to_avatar.',
      },
      desc: 'fetch → analyze → publish or review based on confidence.',
      fetch: { kicker: 'Node', title: 'fetch', lines: ['Collect facts', 'Return payload'] },
      analyze: { kicker: 'Node', title: 'analyze', lines: ['Score confidence', 'ConditionalEdge'] },
      publish: { kicker: 'High confidence', title: 'publish', lines: ['Continue the DAG'] },
      review: { kicker: 'Low confidence', title: 'review', lines: ['Human or extra pass'] },
      high: 'high',
      low: 'low',
      note: 'Do not write AgentTeamManager(agents=[...]). That class needs llm_factory and a StudioSession.',
    },
    zh: {
      header: {
        eyebrow: '进程内的图',
        title: '工作流节点会分支；Near 群聊不用这个构造',
        subtitle: 'SDK 图是 Workflow / Node / Edge。群聊是 group_router + delegate_to_avatar。',
      },
      desc: '抓取 → 分析 → 按置信度发布或复核。',
      fetch: { kicker: '节点', title: '抓取', lines: ['收集事实', '返回载荷'] },
      analyze: { kicker: '节点', title: '分析', lines: ['打置信度', 'ConditionalEdge'] },
      publish: { kicker: '高置信度', title: '发布', lines: ['继续 DAG'] },
      review: { kicker: '低置信度', title: '复核', lines: ['人或多走一轮'] },
      high: '高',
      low: '低',
      note: '不要写 AgentTeamManager(agents=[...])。它需要 llm_factory 和 StudioSession。',
    },
  },
  'flow-decorators': {
    fn: flowDecorators,
    en: {
      header: {
        eyebrow: 'agenticx.flow',
        title: 'Decorators build a process graph, not a chat pane',
        subtitle: 'kickoff() never starts Near and never writes messages.json.',
      },
      desc: '@start → @listen → @router → branch A or B.',
      start: { title: 'Entry', lines: ['@start method', 'Create initial state'] },
      listen: { title: 'Next step', lines: ['@listen', 'Wait for upstream'] },
      router: { title: 'Branch', lines: ['@router', 'Return the next name'] },
      a: { title: 'Step A', lines: ['e.g. publish'] },
      b: { title: 'Step B', lines: ['e.g. review'] },
      note: 'Pause / resume lives on ExecutionPlan (to_mermaid, pause, resume) — still in your process.',
    },
    zh: {
      header: {
        eyebrow: 'agenticx.flow',
        title: '装饰器画出进程内的图，不是聊天窗格',
        subtitle: 'kickoff() 不会启动 Near，也不会写 messages.json。',
      },
      desc: '@start → @listen → @router → 分支 A 或 B。',
      start: { title: '入口', lines: ['@start 方法', '建立初始状态'] },
      listen: { title: '下一步', lines: ['@listen', '等上游结果'] },
      router: { title: '分支', lines: ['@router', '返回下一个名字'] },
      a: { title: '步骤 A', lines: ['例如发布'] },
      b: { title: '步骤 B', lines: ['例如复核'] },
      note: '暂停 / 续跑在 ExecutionPlan（to_mermaid、pause、resume）——仍然在你的进程里。',
    },
  },
  'llm-config': {
    fn: llmConfig,
    en: {
      header: {
        eyebrow: 'Providers',
        title: 'Settings persist to YAML, then BaseLLMProvider calls upstream',
        subtitle: 'Green means actually configured — not “using the official default base”.',
      },
      desc: 'Near settings write config.yaml; the provider uses key or custom base.',
      ui: { kicker: 'Near', title: 'Settings', lines: ['One key field', 'Test connectivity'] },
      yaml: { kicker: 'Disk', title: 'config.yaml', lines: ['~/.agenticx/', 'providers.*'] },
      provider: { kicker: 'Python', title: 'BaseLLMProvider', lines: ['LiteLLM route', 'Studio / SDK'] },
      up: { kicker: 'Network', title: 'Upstream API', lines: ['Cloud or local', 'Ollama needs a URL'] },
      rule: 'Configured = API key or a custom API base is non-empty. Clearing both turns the status red and treats the provider as off.',
      note: 'MiniMax M2 and text-only GLM-5 are non-vision: Studio strips image_inputs; Near should block attachments.',
    },
    zh: {
      header: {
        eyebrow: '供应商',
        title: '设置写入 YAML，再由 BaseLLMProvider 打上游',
        subtitle: '绿色表示真正已配置——不是「只用官方默认 Base」。',
      },
      desc: 'Near 设置写入 config.yaml；供应商使用密钥或自定义地址。',
      ui: { kicker: 'Near', title: '设置', lines: ['一个密钥框', '测试连通性'] },
      yaml: { kicker: '磁盘', title: 'config.yaml', lines: ['~/.agenticx/', 'providers.*'] },
      provider: { kicker: 'Python', title: 'BaseLLMProvider', lines: ['LiteLLM 路由', 'Studio / SDK'] },
      up: { kicker: '网络', title: '上游 API', lines: ['云或本机', 'Ollama 要可访问地址'] },
      rule: '已配置 = 密钥或自定义 API 地址至少一项非空。两项都清空视为关闭，状态点变红。',
      note: 'MiniMax M2 与纯文本 GLM-5 按非视觉处理：Studio 剥 image_inputs，Near 应拦截附件。',
    },
  },
  'hooks-lifecycle': {
    fn: hooksLifecycle,
    en: {
      header: {
        eyebrow: 'Hooks',
        title: 'Guards only run if tool:before_call is actually dispatched',
        subtitle: 'The confirm UI is themed in-app — not window.confirm.',
      },
      desc: 'agent start → before_call → tool → after_call, with a confirm side door.',
      start: { kicker: 'agent:start', title: 'Turn begins', lines: ['Runtime event', 'Legacy bridge'] },
      before: { kicker: 'tool:before_call', title: 'pre_tool_guard', lines: ['Dangerous shell', 'Merged flags'] },
      tool: { kicker: 'Execute', title: 'Tool runs', lines: ['Timeout / sandbox', 'Record observation'] },
      after: { kicker: 'tool:after_call', title: 'Then stop', lines: ['agent:stop', 'Review can follow'] },
      confirm: { title: 'Awaiting confirm', lines: ['Themed dialog · countdown if needed'] },
      note: 'rm -rf matching must cover merged flags and must not fire on quoted commit messages.',
    },
    zh: {
      header: {
        eyebrow: 'Hooks',
        title: '只有真正派发了 tool:before_call，守卫才会拦',
        subtitle: '确认是应用内主题化弹层，不是 window.confirm。',
      },
      desc: 'agent 开始 → before_call → 执行工具 → after_call，旁边是确认岔路。',
      start: { kicker: 'agent:start', title: '一轮开始', lines: ['运行时事件', '旧桥接'] },
      before: { kicker: 'tool:before_call', title: 'pre_tool_guard', lines: ['危险 shell', '合并 flag'] },
      tool: { kicker: '执行', title: '工具跑起来', lines: ['超时 / 沙箱', '记下观察'] },
      after: { kicker: 'tool:after_call', title: '然后结束', lines: ['agent:stop', '之后可以复盘'] },
      confirm: { title: '等待确认', lines: ['主题化弹层 · 需要时带倒计时'] },
      note: 'rm -rf 匹配要覆盖合并 flag，且不能误伤带引号的 commit message。',
    },
  },
  'skills-lifecycle': {
    fn: skillsLifecycle,
    en: {
      header: {
        eyebrow: 'Skills & evolution',
        title: 'Load with a guard; learn only if the quality gate passes',
        subtitle: 'Global off switch is skills.disabled. Avatars store explicit offs in skills_enabled.',
      },
      desc: 'Scan roots, guard, expose, use; observations can become a new SKILL.md after review.',
      trackA: 'This session',
      trackB: 'After the session',
      scan: { title: 'Scan roots', lines: ['~/.agenticx/skills', 'preset + custom paths'] },
      guard: { title: 'scan_skill', lines: ['should_allow', 'Readable fail reason'] },
      visible: { title: 'Visible set', lines: ['Per-skill toggle', 'Source badges'] },
      use: { title: 'skill_use', lines: ['Progressive disclose', 'Not every CLI you list'] },
      blocked: { title: 'Blocked', lines: ['Show the hit category, not just “high risk”'] },
      observe: { title: 'Observations', lines: ['tool_call_observations.json'] },
      review: { title: 'Session review', lines: ['on_agent_end background'] },
      gate: { title: 'Quality gate', lines: ['5 checks · min score'] },
      create: { title: 'Optional SKILL.md', lines: ['Fail → no auto-create'] },
      note: 'AGX_LEARNING_ENABLED / learning.enabled controls both observation and review. Empty search must return the full marketplace, not a curated slice.',
    },
    zh: {
      header: {
        eyebrow: '技能与自进化',
        title: '先门禁再进会话；过了质量门才允许学成新技能',
        subtitle: '全局关闭写在 skills.disabled。分身只把显式关闭项写入 skills_enabled。',
      },
      desc: '扫描根目录、门禁、暴露、使用；观察经复盘后才可能变成新的 SKILL.md。',
      trackA: '这一轮会话',
      trackB: '会话结束之后',
      scan: { title: '扫描根目录', lines: ['~/.agenticx/skills', '预设 + 自定义路径'] },
      guard: { title: 'scan_skill', lines: ['should_allow', '失败要写出原因'] },
      visible: { title: '可见集', lines: ['单技能开关', '来源徽章'] },
      use: { title: 'skill_use', lines: ['渐进披露', '≠ 你列出的每个 CLI'] },
      blocked: { title: '拦截', lines: ['写出命中类别，不要只说「高危」'] },
      observe: { title: '观察', lines: ['tool_call_observations.json'] },
      review: { title: '会话复盘', lines: ['on_agent_end 后台'] },
      gate: { title: '质量门禁', lines: ['5 项检查 · 最低分'] },
      create: { title: '可选 SKILL.md', lines: ['失败 → 不自动创建'] },
      note: 'AGX_LEARNING_ENABLED / learning.enabled 同时控制观察与复盘。市场搜索为空时必须回全量，不能继续只展示精选。',
    },
  },
  'longrun-cycle': {
    fn: longrunCycle,
    en: {
      header: {
        eyebrow: 'Long-horizon',
        title: 'Keep a feature on disk across polls and retries',
        subtitle: 'Short AgentExecutor.run does not need longrun or project_state.',
      },
      desc: 'Sources, orchestrator, isolated workspace, implement, stall, verify, commit.',
      src: { kicker: 'Sources', title: 'Queue a job', lines: ['manual / cron', 'project feature'] },
      orch: { kicker: 'longrun/', title: 'Orchestrator', lines: ['Poll · backoff', 'TaskTokenAccountant'] },
      ws: { kicker: 'Isolate', title: 'TaskWorkspace', lines: ['Own directory', 'No path escape'] },
      impl: { title: 'implement', lines: ['project_state'] },
      stall: { title: 'Stall detector', lines: ['Healthy → verify', 'Stuck → retry'] },
      verify: { title: 'verify', lines: ['Tests / checks'] },
      commit: { title: 'commit', lines: ['Token ledger'] },
      retry: 'retry',
      note: 'A crash should leave the same feature directory and state file. Progress cards name the phase, not a static hourglass.',
    },
    zh: {
      header: {
        eyebrow: '长周期',
        title: '把功能钉在磁盘上，撑过轮询和重试',
        subtitle: '短的 AgentExecutor.run 不必上 longrun 或 project_state。',
      },
      desc: '任务源、编排器、隔离工作区、实现、停滞、校验、提交。',
      src: { kicker: '来源', title: '投入任务', lines: ['手动 / cron', '项目 feature'] },
      orch: { kicker: 'longrun/', title: '编排器', lines: ['轮询 · 退避', 'TaskTokenAccountant'] },
      ws: { kicker: '隔离', title: 'TaskWorkspace', lines: ['自己的目录', '禁止路径逃逸'] },
      impl: { title: '实现', lines: ['project_state'] },
      stall: { title: '停滞检测', lines: ['健康 → 校验', '卡住 → 重试'] },
      verify: { title: '校验', lines: ['测试 / 检查'] },
      commit: { title: '提交', lines: ['token 账本'] },
      retry: '重试',
      note: '崩溃后同一功能目录和状态文件还应在。进度卡要写出阶段，不是静止沙漏。',
    },
  },
  'intro-path': {
    fn: introPath,
    en: {
      header: { eyebrow: 'Introduction', title: 'How a request moves', subtitle: 'Near and the SDK are doors. Studio + AgentRuntime is the loop.' },
      desc: 'You pick Near or the SDK, then Studio calls AgentRuntime, which talks to tools, models, and memory.',
      you: { kicker: 'Human', title: 'You' },
      door: { kicker: 'Door', title: 'Near or SDK' },
      studio: { kicker: 'Process', title: 'Studio Server' },
      rt: { kicker: 'Loop', title: 'AgentRuntime' },
      tools: { title: 'Tools / MCP / Skills', lines: ['dispatch_tool_async'] },
      llm: { title: 'Model provider', lines: ['BaseLLMProvider'] },
      mem: { title: 'Memory / KB', lines: ['MEMORY.md · brains'] },
      note: 'Enterprise Gateway is a different process. It relays models; it does not run this loop.',
    },
    zh: {
      header: { eyebrow: '简介', title: '一轮请求怎么走', subtitle: 'Near 和 SDK 是门。Studio + AgentRuntime 才是循环。' },
      desc: '先选 Near 或 SDK，再由 Studio 调用 AgentRuntime，去打工具、模型和记忆。',
      you: { kicker: '人', title: '你' },
      door: { kicker: '入口', title: 'Near 或 SDK' },
      studio: { kicker: '进程', title: 'Studio Server' },
      rt: { kicker: '循环', title: 'AgentRuntime' },
      tools: { title: '工具 / MCP / 技能', lines: ['dispatch_tool_async'] },
      llm: { title: '模型供应商', lines: ['BaseLLMProvider'] },
      mem: { title: '记忆 / 知识库', lines: ['MEMORY.md · 知识脑'] },
      note: 'Enterprise 网关是另一个进程。它做模型中继，不跑这套循环。',
    },
  },
  'install-paths': {
    fn: installPaths,
    en: {
      header: { eyebrow: 'Install', title: 'One package, two ways to start', subtitle: 'pip install agenticx gives the CLI and the Python SDK.' },
      desc: 'CLI starts agx serve for Near. The SDK embeds AgentExecutor in your process.',
      pip: { title: 'pip install agenticx', lines: ['Public Python package'] },
      cli: { kicker: 'CLI', title: 'agx', lines: ['agx serve', 'Near attaches here'] },
      sdk: { kicker: 'SDK', title: 'Python import', lines: ['AgentExecutor', 'Your process'] },
      note: 'Near Desktop embeds the same backend. A machine without Python still needs the packaged server, not a second runtime.',
    },
    zh: {
      header: { eyebrow: '安装', title: '一个包，两条起步路', subtitle: 'pip install agenticx 同时给出 CLI 和 Python SDK。' },
      desc: 'CLI 拉起 agx serve 给 Near。SDK 在你的进程里嵌入 AgentExecutor。',
      pip: { title: 'pip install agenticx', lines: ['公开 Python 包'] },
      cli: { kicker: 'CLI', title: 'agx', lines: ['agx serve', 'Near 挂在这里'] },
      sdk: { kicker: 'SDK', title: 'Python import', lines: ['AgentExecutor', '你的进程'] },
      note: 'Near 桌面内嵌同一套后端。没有 Python 的机器用打包好的 server，不是第二套运行时。',
    },
  },
  'quickstart-paths': {
    fn: quickstartPaths,
    en: {
      header: { eyebrow: 'Quick start', title: 'Two first runs — they are not the same loop', subtitle: 'Do not mix AgentExecutor constructor args with AgentRuntime.' },
      desc: 'SDK path returns a dict. Studio path streams SSE to Near or an HTTP client.',
      trackA: 'SDK path',
      trackB: 'Studio / Near path',
      a: { title: 'Agent + Task', lines: ['agenticx.core'] },
      b: { title: 'AgentExecutor.run', lines: ['llm_provider=', 'run(agent=, task=)'] },
      c: { title: 'dict result', lines: ['In your process'] },
      d: { title: 'agx serve', lines: ['create_studio_app'] },
      e: { title: 'Near or HTTP', lines: ['REST + SSE'] },
      f: { title: 'AgentRuntime.run_turn', lines: ['messages.json'] },
      note: 'agx studio is a terminal REPL, not the FastAPI process Near talks to.',
    },
    zh: {
      header: { eyebrow: '快速上手', title: '两种第一次运行——不是同一套循环', subtitle: '不要把 AgentExecutor 的构造参数和 AgentRuntime 混用。' },
      desc: 'SDK 路径返回 dict。Studio 路径把 SSE 推给 Near 或 HTTP 客户端。',
      trackA: 'SDK 路径',
      trackB: 'Studio / Near 路径',
      a: { title: 'Agent + Task', lines: ['agenticx.core'] },
      b: { title: 'AgentExecutor.run', lines: ['llm_provider=', 'run(agent=, task=)'] },
      c: { title: 'dict 结果', lines: ['在你的进程里'] },
      d: { title: 'agx serve', lines: ['create_studio_app'] },
      e: { title: 'Near 或 HTTP', lines: ['REST + SSE'] },
      f: { title: 'AgentRuntime.run_turn', lines: ['messages.json'] },
      note: 'agx studio 是终端 REPL，不是 Near 连接的 FastAPI 进程。',
    },
  },
  'config-yaml': {
    fn: configYaml,
    en: {
      header: { eyebrow: 'Configuration', title: 'One YAML file, plus env overrides', subtitle: 'Green provider status needs a key or a custom base — not the official default URL alone.' },
      desc: 'config.yaml drives serve, tool rounds, providers, and skill scan paths.',
      yaml: { kicker: 'Disk', title: '~/.agenticx/config.yaml', lines: ['providers.* · skills.disabled · runtime.max_tool_rounds'] },
      serve: { title: 'agx serve / Near', lines: ['Reads on boot'] },
      runtime: { title: 'runtime.*', lines: ['max_tool_rounds'] },
      providers: { title: 'providers.*', lines: ['Key or custom base'] },
      skills: { title: 'skills.*', lines: ['disabled · scan paths'] },
      env: 'env vars',
      note: 'Clearing both the key and the custom base turns the provider off. Ollama still needs a reachable URL.',
    },
    zh: {
      header: { eyebrow: '配置', title: '一份 YAML，环境变量可以覆盖', subtitle: '供应商绿灯要密钥或自定义地址——不是只用官方默认 URL。' },
      desc: 'config.yaml 驱动 serve、工具轮次、供应商和技能扫描路径。',
      yaml: { kicker: '磁盘', title: '~/.agenticx/config.yaml', lines: ['providers.* · skills.disabled · runtime.max_tool_rounds'] },
      serve: { title: 'agx serve / Near', lines: ['启动时读取'] },
      runtime: { title: 'runtime.*', lines: ['max_tool_rounds'] },
      providers: { title: 'providers.*', lines: ['密钥或自定义地址'] },
      skills: { title: 'skills.*', lines: ['disabled · 扫描路径'] },
      env: '环境变量',
      note: '密钥和自定义地址都清空视为关闭。Ollama 仍要可访问的地址。',
    },
  },
  'first-agent-loop': {
    fn: firstAgentLoop,
    en: {
      header: { eyebrow: 'First agent', title: 'SDK research loop: task in, report out', subtitle: 'This is AgentExecutor, not a Near pane.' },
      desc: 'Topic becomes a Task; tool_calls loop until the model returns text.',
      topic: { title: 'Topic', lines: ['Your question'] },
      task: { title: 'Task', lines: ['description', 'expected_output'] },
      exec: { title: 'AgentExecutor.run', lines: ['llm_provider='] },
      llm: { title: 'LLM', lines: ['text → report'] },
      tools: { title: 'search / fetch', lines: ['@tool functions'] },
      loop: 'tool_calls',
      note: 'There is no max_iter or verbose on Agent. Use max_iterations on the executor.',
    },
    zh: {
      header: { eyebrow: '第一个智能体', title: 'SDK 研究环：任务进，报告出', subtitle: '这是 AgentExecutor，不是 Near 窗格。' },
      desc: '主题变成 Task；tool_calls 回环直到模型吐出文本。',
      topic: { title: '主题', lines: ['你的问题'] },
      task: { title: 'Task', lines: ['description', 'expected_output'] },
      exec: { title: 'AgentExecutor.run', lines: ['llm_provider='] },
      llm: { title: 'LLM', lines: ['文本 → 报告'] },
      tools: { title: '搜索 / 抓取', lines: ['@tool 函数'] },
      loop: 'tool_calls',
      note: 'Agent 上没有 max_iter 或 verbose。轮次上限用执行器的 max_iterations。',
    },
  },
  'multi-agent-route': {
    fn: multiAgentRoute,
    en: {
      header: { eyebrow: 'Multi-agent', title: 'Meta routes; avatars actually run', subtitle: 'Do not construct AgentTeamManager(agents=[...]).' },
      desc: '@mention, delegate_to_avatar, or spawn_subagent — replies land in a pane or group.',
      user: { kicker: 'Chat', title: 'User' },
      meta: { kicker: 'Router', title: 'Meta-Agent', lines: ['Default if no @'] },
      mention: { kicker: '@name', title: 'Named avatar', lines: ['Speaks in the group'] },
      delegate: { kicker: 'Tool', title: 'delegate_to_avatar', lines: ['Real avatar session'] },
      spawn: { kicker: 'Tool', title: 'spawn_subagent', lines: ['AgentTeamManager'] },
      note: 'Spawn will refuse a registered avatar name and tell you to delegate instead.',
    },
    zh: {
      header: { eyebrow: '多智能体', title: 'Meta 负责路由；分身真正去跑', subtitle: '不要写 AgentTeamManager(agents=[...])。' },
      desc: '@提及、delegate_to_avatar 或 spawn_subagent —— 回复落在窗格或群里。',
      user: { kicker: '对话', title: '用户' },
      meta: { kicker: '路由', title: 'Meta-Agent', lines: ['没 @ 时兜底'] },
      mention: { kicker: '@名字', title: '具名分身', lines: ['在群里发言'] },
      delegate: { kicker: '工具', title: 'delegate_to_avatar', lines: ['真分身会话'] },
      spawn: { kicker: '工具', title: 'spawn_subagent', lines: ['AgentTeamManager'] },
      note: 'spawn 会拦截已注册分身名，并让你改走委派。',
    },
  },
  'studio-sse': {
    fn: studioSse,
    en: {
      header: { eyebrow: 'Studio', title: 'Near talks HTTP + SSE to one local process', subtitle: 'agx studio (REPL) is a different command.' },
      desc: 'Renderer → Electron main → FastAPI → SessionManager / AgentRuntime → SSE back.',
      ui: { kicker: 'Renderer', title: 'Near UI', lines: ['React panes'] },
      main: { kicker: 'Main', title: 'Electron', lines: ['spawn / fetch'] },
      api: { kicker: 'HTTP', title: 'Studio FastAPI', lines: ['create_studio_app'] },
      sm: { title: 'SessionManager', lines: ['messages.json'] },
      ar: { title: 'AgentRuntime', lines: ['run_turn'] },
      sse: { title: 'SSE events', lines: ['Back to the pane'] },
      note: 'Leaving a pane may abort the browser fetch while the turn still finishes on disk.',
    },
    zh: {
      header: { eyebrow: 'Studio', title: 'Near 用 HTTP + SSE 连本机这一份进程', subtitle: 'agx studio（REPL）是另一条命令。' },
      desc: '渲染进程 → Electron 主进程 → FastAPI → SessionManager / AgentRuntime → SSE 回来。',
      ui: { kicker: '渲染', title: 'Near 界面', lines: ['React 窗格'] },
      main: { kicker: '主进程', title: 'Electron', lines: ['拉起 / 请求'] },
      api: { kicker: 'HTTP', title: 'Studio FastAPI', lines: ['create_studio_app'] },
      sm: { title: 'SessionManager', lines: ['messages.json'] },
      ar: { title: 'AgentRuntime', lines: ['run_turn'] },
      sse: { title: 'SSE 事件', lines: ['回到窗格'] },
      note: '离开窗格可能中止浏览器 fetch，但这一轮仍可能在磁盘上跑完。',
    },
  },
  'knowledge-ingest': {
    fn: knowledgeIngest,
    en: {
      header: { eyebrow: 'Knowledge', title: 'Parse, chunk, embed, then search', subtitle: 'DashScope embedding batches must stay ≤ 10.' },
      desc: 'LiteParseAdapter is the only parse path. Repo index is a second search tool.',
      files: { title: 'Files / folders', lines: ['md / pdf / office'] },
      parse: { title: 'LiteParseAdapter', lines: ['No raw-text fallback'] },
      chunk: { title: 'chunk', lines: ['Then embed'] },
      embed: { title: 'embedding', lines: ['Batches of ≤10'] },
      store: { title: 'Chroma default', lines: ['Optional other stores'] },
      search: { title: 'knowledge_search', lines: ['Studio tool'] },
      code: { title: 'Repo index', lines: ['code_search is a separate path'] },
      note: 'Ingest must show real percent or stage text. Failures need the filename and the exception chain, not a single token.',
    },
    zh: {
      header: { eyebrow: '知识库', title: '解析、分块、向量化，再检索', subtitle: '百炼 embedding 批量必须 ≤ 10。' },
      desc: '解析只走 LiteParseAdapter。仓库索引是另一条检索工具。',
      files: { title: '文件 / 文件夹', lines: ['md / pdf / office'] },
      parse: { title: 'LiteParseAdapter', lines: ['不回退纯文本直读'] },
      chunk: { title: '分块', lines: ['然后向量化'] },
      embed: { title: 'embedding', lines: ['每批 ≤10'] },
      store: { title: '默认 Chroma', lines: ['可换其他库'] },
      search: { title: 'knowledge_search', lines: ['Studio 工具'] },
      code: { title: '仓库索引', lines: ['code_search 是另一条路'] },
      note: '入库必须露出真实百分比或阶段。失败要带文件名和异常链，不能只丢一个 token。',
    },
  },
  'extensions-bundle': {
    fn: extensionsBundle,
    en: {
      header: { eyebrow: 'Extensions', title: 'Scan and guard before a skill is visible', subtitle: 'An AGX Bundle can also drop MCP servers.' },
      desc: 'skill_use is path 1. active_skill in the system prompt is path 2.',
      scan: { title: 'Scan roots', lines: ['build_skill_search_paths'] },
      guard: { title: 'scan_skill', lines: ['should_allow'] },
      list: { title: 'Skill list', lines: ['Per-skill toggles'] },
      use: { kicker: 'Path 1', title: 'skill_use', lines: ['Progressive disclose'] },
      prompt: { kicker: 'Path 2', title: 'active_skill', lines: ['System prompt'] },
      mcp: { kicker: 'Also', title: 'MCPHub', lines: ['marketplace / mcp.json'] },
      note: 'Empty marketplace search must return the full catalog, not a curated slice.',
    },
    zh: {
      header: { eyebrow: '扩展', title: '先扫描和门禁，技能才进入可见集', subtitle: 'AGX Bundle 也可以带上 MCP。' },
      desc: 'skill_use 是路径 1。系统提示里的 active_skill 是路径 2。',
      scan: { title: '扫描根目录', lines: ['build_skill_search_paths'] },
      guard: { title: 'scan_skill', lines: ['should_allow'] },
      list: { title: '技能列表', lines: ['单技能开关'] },
      use: { kicker: '路径 1', title: 'skill_use', lines: ['渐进披露'] },
      prompt: { kicker: '路径 2', title: 'active_skill', lines: ['系统提示'] },
      mcp: { kicker: '另外', title: 'MCPHub', lines: ['市场 / mcp.json'] },
      note: '市场搜索为空时必须回全量，不能继续只展示精选。',
    },
  },
  'deploy-serve': {
    fn: deployServe,
    en: {
      header: { eyebrow: 'Deploy', title: 'Clients hit agx serve; state stays on disk', subtitle: 'Nginx is optional. The app is still create_studio_app().' },
      desc: 'Near or other clients call Studio. ~/.agenticx holds sessions and config.',
      client: { title: 'Near / clients', lines: ['REST + SSE'] },
      serve: { title: 'agx serve', lines: ['Host + port'] },
      app: { title: 'create_studio_app', lines: ['FastAPI'] },
      disk: { title: '~/.agenticx', lines: ['config · sessions'] },
      proxy: 'Nginx optional',
      note: 'Do not put a long-run job on a laptop that will sleep the lid. Desktop still binds localhost by default.',
    },
    zh: {
      header: { eyebrow: '部署', title: '客户端打 agx serve；状态留在磁盘', subtitle: 'Nginx 可选。应用仍是 create_studio_app()。' },
      desc: 'Near 或其他客户端调用 Studio。~/.agenticx 放会话和配置。',
      client: { title: 'Near / 客户端', lines: ['REST + SSE'] },
      serve: { title: 'agx serve', lines: ['地址 + 端口'] },
      app: { title: 'create_studio_app', lines: ['FastAPI'] },
      disk: { title: '~/.agenticx', lines: ['配置 · 会话'] },
      proxy: '可选 Nginx',
      note: '长任务不要放在会合盖休眠的笔记本上。桌面端默认仍只绑本机。',
    },
  },
  'api-executor': {
    fn: apiExecutor,
    en: {
      header: { eyebrow: 'Agents API', title: 'Construct the executor, pass the agent at run()', subtitle: 'This page is agenticx.core — not AgentRuntime.' },
      desc: 'Agent + Task + llm_provider + tools go into AgentExecutor.run and return a dict.',
      agent: { title: 'Agent', lines: ['name · role · goal', 'tools · max_iterations'] },
      task: { title: 'Task', lines: ['description', 'expected_output'] },
      exec: { kicker: 'Python', title: 'AgentExecutor', lines: ['llm_provider=', 'run(agent=, task=)'] },
      result: { kicker: 'Return', title: 'dict result', lines: ['Same process'] },
      note: 'There is no agent=, llm=, or verbose= on the constructor. Source is agenticx/core/, not agenticx/agents/.',
    },
    zh: {
      header: { eyebrow: 'Agents API', title: '先构造执行器，run() 时再传入 agent', subtitle: '本页是 agenticx.core，不是 AgentRuntime。' },
      desc: 'Agent + Task + llm_provider + tools 进入 AgentExecutor.run，返回 dict。',
      agent: { title: 'Agent', lines: ['name · role · goal', 'tools · max_iterations'] },
      task: { title: 'Task', lines: ['description', 'expected_output'] },
      exec: { kicker: 'Python', title: 'AgentExecutor', lines: ['llm_provider=', 'run(agent=, task=)'] },
      result: { kicker: '返回', title: 'dict 结果', lines: ['同一进程'] },
      note: '构造器没有 agent=、llm=、verbose=。源码在 agenticx/core/，不是 agenticx/agents/。',
    },
  },
  'cli-commands': {
    fn: cliCommands,
    en: {
      header: { eyebrow: 'CLI', title: 'Daily commands vs the REPL', subtitle: 'Near talks to agx serve, not agx studio.' },
      desc: 'serve is FastAPI. studio is a terminal REPL. feishu attaches to the same HTTP process.',
      serve: { kicker: 'HTTP + SSE', title: 'agx serve', lines: ['create_studio_app', 'Writes serve.port'] },
      studio: { kicker: 'REPL', title: 'agx studio', lines: ['Interactive terminal', 'Not the desktop backend'] },
      feishu: { kicker: 'IM', title: 'agx feishu', lines: ['Long connection', 'Uses serve.port / token'] },
      note: 'Scaffold groups (project / agent / workflow) exist. Run agx --help for the live list.',
    },
    zh: {
      header: { eyebrow: 'CLI', title: '日常命令和 REPL 不是一回事', subtitle: 'Near 连的是 agx serve，不是 agx studio。' },
      desc: 'serve 是 FastAPI。studio 是终端 REPL。飞书挂在同一份 HTTP 进程上。',
      serve: { kicker: 'HTTP + SSE', title: 'agx serve', lines: ['create_studio_app', '写入 serve.port'] },
      studio: { kicker: 'REPL', title: 'agx studio', lines: ['交互终端', '不是桌面后端'] },
      feishu: { kicker: 'IM', title: 'agx feishu', lines: ['长连接', '读 serve.port / token'] },
      note: '脚手架分组（project / agent / workflow）也在。以 agx --help 为准。',
    },
  },
  'faq-doors': {
    fn: faqDoors,
    en: {
      header: { eyebrow: 'FAQ', title: 'What are you actually doing?', subtitle: 'Pick one door. They do not share a process.' },
      desc: 'Embed in Python, use the local workspace, or put a governed web portal in front.',
      q: { title: 'What are you doing?' },
      sdk: { kicker: 'Embed', title: 'Python SDK', lines: ['AgentExecutor', 'Quickstart SDK'] },
      desk: { kicker: 'Local', title: 'Near workspace', lines: ['agx serve + Near'] },
      ent: { kicker: 'Governed', title: 'Enterprise', lines: ['Portal + Gateway'] },
      note: 'The Gateway is not AgentRuntime. Empty lists in Near usually mean serve crashed, not deleted data.',
    },
    zh: {
      header: { eyebrow: '常见问题', title: '你到底在做什么？', subtitle: '先选一扇门。它们不共享一个进程。' },
      desc: '嵌进 Python、用本机工作区，或在前面放受治理的 Web 门户。',
      q: { title: '你在做什么？' },
      sdk: { kicker: '嵌入', title: 'Python SDK', lines: ['AgentExecutor', '快速上手 SDK'] },
      desk: { kicker: '本机', title: 'Near 工作区', lines: ['agx serve + Near'] },
      ent: { kicker: '治理', title: 'Enterprise', lines: ['Portal + 网关'] },
      note: '网关不是 AgentRuntime。Near 列表全空通常是 serve 崩了，不是数据被删。',
    },
  },
  'changelog-arc': {
    fn: changelogArc,
    en: {
      header: { eyebrow: 'Changelog', title: 'How the shipped arc reads', subtitle: 'Milestones are product slices, not marketing versions.' },
      desc: 'Core M1–M11, then Near/Studio, then v0.5 brains / long-run / learning.',
      a: { title: 'M1–M11', lines: ['Capability core'] },
      b: { title: 'M14–M17', lines: ['Near / Studio'] },
      c: { title: 'v0.5', lines: ['Brains · long-run', 'Learning'] },
      d: { title: 'Next', lines: ['M12 / M18', 'Cluster planned'] },
      note: 'Read the GitHub releases for exact tags. This diagram is the story, not a substitute for the log.',
    },
    zh: {
      header: { eyebrow: '更新日志', title: '已落地的弧怎么读', subtitle: '里程碑是产品切片，不是营销版本号。' },
      desc: '核心 M1–M11，然后 Near/Studio，然后 v0.5 多脑 / 长周期 / 自进化。',
      a: { title: 'M1–M11', lines: ['能力核心'] },
      b: { title: 'M14–M17', lines: ['Near / Studio'] },
      c: { title: 'v0.5', lines: ['多脑 · 长周期', '自进化'] },
      d: { title: '接下来', lines: ['M12 / M18', '集群规划中'] },
      note: '具体 tag 看 GitHub releases。这张图是故事线，不能代替更新日志。',
    },
  },
  'roadmap-next': {
    fn: roadmapNext,
    en: {
      header: { eyebrow: 'Roadmap', title: 'Shipped vs still planned', subtitle: 'M12, M18, and cluster runtime are not in the current Near loop.' },
      desc: 'Core + Near/Studio + v0.5 are out. Evolution, Studio RBAC, and cluster are next.',
      done: { title: 'Shipped: M1–M11 / M13–M17 / v0.5', lines: ['Core · Near · Studio · brains · long-run · learning'] },
      m12: { title: 'M12 evolution', lines: ['Control-plane work'] },
      m18: { title: 'M18 Studio RBAC', lines: ['Not Desktop ACL'] },
      cluster: { title: 'Cluster Runtime', lines: ['Planned'] },
      note: 'Do not treat a planned box as a live API. If a page says planned, the code path is not the default product.',
    },
    zh: {
      header: { eyebrow: '路线图', title: '已落地和还在规划', subtitle: 'M12、M18、集群 Runtime 还不在当前 Near 循环里。' },
      desc: '核心 + Near/Studio + v0.5 已出。进化、Studio RBAC、集群是下一步。',
      done: { title: '已落地：M1–M11 / M13–M17 / v0.5', lines: ['核心 · Near · Studio · 多脑 · 长周期 · 自进化'] },
      m12: { title: 'M12 进化', lines: ['控制面工作'] },
      m18: { title: 'M18 Studio RBAC', lines: ['不是桌面 ACL'] },
      cluster: { title: '集群 Runtime', lines: ['规划中'] },
      note: '规划框不是现成 API。页面写了规划中，就不要当默认产品路径。',
    },
  },
  'guides-map': {
    fn: guidesMap,
    en: {
      header: { eyebrow: 'Guides', title: 'Six how-to pages, one job each', subtitle: 'These are walks. Concepts explain the loop; guides show the first successful run.' },
      desc: 'First agent, multi-agent, Studio, knowledge, extensions, deploy.',
      a: { title: 'First agent', lines: ['SDK research loop'] },
      b: { title: 'Multi-agent', lines: ['Meta · @ · delegate'] },
      c: { title: 'Studio', lines: ['agx serve + SSE'] },
      d: { title: 'Knowledge', lines: ['LiteParse · Chroma'] },
      e: { title: 'Extensions', lines: ['Skills · MCP · Bundle'] },
      f: { title: 'Deploy', lines: ['serve + disk'] },
      note: 'Enterprise portal deploy is a different docs set. This section stays on the Python / Near path.',
    },
    zh: {
      header: { eyebrow: '指南', title: '六篇 HOWTO，各做一件事', subtitle: '概念页讲循环；指南页带你跑通第一次。' },
      desc: '第一个智能体、多智能体、Studio、知识库、扩展、部署。',
      a: { title: '第一个智能体', lines: ['SDK 研究环'] },
      b: { title: '多智能体', lines: ['Meta · @ · 委派'] },
      c: { title: 'Studio', lines: ['agx serve + SSE'] },
      d: { title: '知识库', lines: ['LiteParse · Chroma'] },
      e: { title: '扩展', lines: ['技能 · MCP · Bundle'] },
      f: { title: '部署', lines: ['serve + 磁盘'] },
      note: 'Enterprise 门户部署是另一套文档。本节只走 Python / Near 这条路。',
    },
  },
  'api-map': {
    fn: apiMap,
    en: {
      header: { eyebrow: 'API reference', title: 'SDK types live here; the chat loop lives in Concepts', subtitle: 'Only the Agents page is a field-level SDK reference today.' },
      desc: 'Agent / Task / AgentExecutor are documented. LLMs, Tools, Memory, Flow point at the concept pages.',
      sdk: { kicker: 'agenticx.core', title: 'Public SDK constructors', lines: ['Agent · Task · AgentExecutor(llm_provider=)'] },
      agents: { title: 'Agents page', lines: ['Fields and run()'] },
      concepts: { title: 'Concept pages', lines: ['LLMs · Tools', 'Memory · Flow'] },
      runtime: { title: 'Near / Studio', lines: ['AgentRuntime', 'Not this executor'] },
      note: 'Sidebar LLMs / Tools / Memory / Flow are the concept docs until a dedicated SDK page exists. Do not invent extra constructors.',
    },
    zh: {
      header: { eyebrow: 'API 参考', title: 'SDK 类型在这里；对话循环在概念页', subtitle: '目前只有 Agents 页是字段级 SDK 参考。' },
      desc: 'Agent / Task / AgentExecutor 有字段说明。LLMs、Tools、Memory、Flow 先看概念页。',
      sdk: { kicker: 'agenticx.core', title: '公开 SDK 构造', lines: ['Agent · Task · AgentExecutor(llm_provider=)'] },
      agents: { title: 'Agents 页', lines: ['字段和 run()'] },
      concepts: { title: '概念页', lines: ['LLMs · Tools', 'Memory · Flow'] },
      runtime: { title: 'Near / Studio', lines: ['AgentRuntime', '不是这个执行器'] },
      note: '侧栏 LLMs / Tools / Memory / Flow 在独立 SDK 页补齐前，先读概念文档。不要发明额外构造器。',
    },
  },
  'ent-topo': {
    fn: entTopo,
    en: {
      header: { eyebrow: 'Architecture', title: 'Three apps, one data plane', subtitle: 'Portal and admin are Next.js; the gateway is a standalone Go process.' },
      desc: 'Employee and admin browsers hit portal :3000 and admin :3001. Both share Postgres. Portal forwards chat to gateway :8088, which calls OpenAI-compatible upstreams.',
      emp: { kicker: 'HTTPS', title: 'Employee browser', lines: ['web-portal workspace'] },
      adm: { kicker: 'HTTPS', title: 'Admin browser', lines: ['IAM · policy · metering'] },
      portal: { kicker: ':3000', title: 'web-portal', lines: ['Next.js', 'POST /api/chat/completions'] },
      console: { kicker: ':3001', title: 'admin-console', lines: ['Next.js', 'Writes PG + snapshots'] },
      gw: { kicker: ':8088', title: 'apps/gateway', lines: ['Go + chi', 'Policy · quota · audit'] },
      pg: { kicker: ':5432', title: 'PostgreSQL', lines: ['IAM · chat · policy', 'Audit · usage'] },
      redis: { kicker: ':6379', title: 'Redis', lines: ['Portal session', 'Optional rate limit'] },
      up: { kicker: 'HTTPS', title: 'Upstream LLM', lines: ['OpenAI-compatible', 'Not LiteLLM'] },
      note: 'edge-agent :7823 is still a skeleton. Gateway may poll admin /api/internal/*. Do not describe a sidecar loop that is not in this repo.',
    },
    zh: {
      header: { eyebrow: '架构', title: '三端应用，一套数据面', subtitle: '前台和后台是 Next.js；网关是独立 Go 进程。' },
      desc: '员工和管理员浏览器分别打 portal :3000 与 admin :3001，共用 Postgres。前台把聊天转发到 gateway :8088，再调 OpenAI 兼容上游。',
      emp: { kicker: 'HTTPS', title: '员工浏览器', lines: ['web-portal 工作区'] },
      adm: { kicker: 'HTTPS', title: '管理员浏览器', lines: ['IAM · 策略 · 计量'] },
      portal: { kicker: ':3000', title: 'web-portal', lines: ['Next.js', 'POST /api/chat/completions'] },
      console: { kicker: ':3001', title: 'admin-console', lines: ['Next.js', '写 PG 与快照'] },
      gw: { kicker: ':8088', title: 'apps/gateway', lines: ['Go + chi', '策略 · 配额 · 审计'] },
      pg: { kicker: ':5432', title: 'PostgreSQL', lines: ['IAM · 聊天 · 策略', '审计 · 用量'] },
      redis: { kicker: ':6379', title: 'Redis', lines: ['Portal session', '可选限流'] },
      up: { kicker: 'HTTPS', title: '上游 LLM', lines: ['OpenAI 兼容', '不是 LiteLLM'] },
      note: 'edge-agent :7823 仍是 skeleton。网关可轮询 admin /api/internal/*。不要把仓库里没有的 sidecar 闭环写进方案。',
    },
  },
  'ent-chat-seq': {
    fn: entChatSeq,
    en: {
      header: { eyebrow: 'Data flow', title: 'Chat request through the gateway', subtitle: 'History stays in portal Postgres. The gateway infers, evaluates, audits, and meters.' },
      desc: 'Browser → portal API → gateway JWT parse → quota → policy → upstream → second-pass policy → audit + usage.',
      s1: { title: 'Browser POST', lines: ['/api/chat/completions', 'JWT cookie'] },
      s2: { title: 'Portal validates', lines: ['Session + OpenAI body'] },
      s3: { title: 'Forward to gateway', lines: ['GATEWAY_COMPLETIONS_URL'] },
      s4: { title: 'Parse JWT', lines: ['tenant / dept / user / session'] },
      s5: { title: 'Quota then policy', lines: ['Tracker + keyword/regex/pii'] },
      s6: { title: 'Block or upstream', lines: ['Business error ≠ model refusal'] },
      s7: { title: 'Response / stream pass', lines: ['SSE scan on stream'] },
      s8: { title: 'Audit + meter', lines: ['JSONL + PG · usage_records'] },
      note: 'block returns a gateway business error. Warn/redact can hit without blocked=true. Chat history is written by portal, not by the gateway.',
    },
    zh: {
      header: { eyebrow: '数据流', title: '聊天请求怎么过网关', subtitle: '历史留在 portal 的 Postgres。网关只做推理、策略、审计、计量。' },
      desc: '浏览器 → portal API → 网关解析 JWT → 配额 → 策略 → 上游 → 二次策略 → 审计 + 用量。',
      s1: { title: '浏览器 POST', lines: ['/api/chat/completions', 'JWT cookie'] },
      s2: { title: 'Portal 校验', lines: ['Session + OpenAI body'] },
      s3: { title: '转发到网关', lines: ['GATEWAY_COMPLETIONS_URL'] },
      s4: { title: '解析 JWT', lines: ['tenant / dept / user / session'] },
      s5: { title: '配额再策略', lines: ['Tracker + keyword/regex/pii'] },
      s6: { title: '拦截或上游', lines: ['业务错误 ≠ 模型拒答'] },
      s7: { title: '响应 / 流式二次评估', lines: ['流式走 SSE 扫描'] },
      s8: { title: '审计 + 计量', lines: ['JSONL + PG · usage_records'] },
      note: 'block 返回网关业务错误。warn/redact 可有 hits 但 blocked 仍为 false。聊天历史由 portal 写，不经网关落库。',
    },
  },
  'ent-visibility': {
    fn: entFour,
    en: {
      header: { eyebrow: 'Data flow', title: 'Who sees a model vs who can call it', subtitle: 'Portal visibility and gateway upstreams are independent lists.' },
      desc: 'Admin CRUD writes provider and visible-model tables. Portal filters GET /api/me/models by JWT. Gateway reads providers via internal API.',
      a: { title: 'admin /admin/models', lines: ['CRUD providers'] },
      b: { title: 'enterprise_runtime_*', lines: ['providers + visible models'] },
      c: { title: 'portal GET /api/me/models', lines: ['Filter by JWT'] },
      d: { title: 'gateway internals', lines: ['/api/internal/providers'] },
      note: 'A model in the dropdown is not automatically a live upstream. Gateway still needs a decrypted key or env fallback.',
    },
    zh: {
      header: { eyebrow: '数据流', title: '谁能看见模型，谁能真正调用', subtitle: '前台可见列表和网关上游是两套名单。' },
      desc: 'Admin CRUD 写 provider 与可见模型表。Portal 按 JWT 过滤 GET /api/me/models。网关经 internal API 读 providers。',
      a: { title: 'admin /admin/models', lines: ['CRUD providers'] },
      b: { title: 'enterprise_runtime_*', lines: ['providers + 可见模型'] },
      c: { title: 'portal GET /api/me/models', lines: ['按 JWT 过滤'] },
      d: { title: '网关内部', lines: ['/api/internal/providers'] },
      note: '下拉里出现的模型不等于上游已接通。网关还要能解密密钥或回退环境变量。',
    },
  },
  'ent-policy-publish': {
    fn: entFour,
    en: {
      header: { eyebrow: 'Data flow', title: 'Only published rules enter the snapshot', subtitle: 'Drafts stay in PG. The gateway hot-reloads active snapshots.' },
      desc: 'draft → POST /api/policy/publish → publish events + snapshot → gateway policy-engine.',
      a: { title: 'policy_rules draft', lines: ['Editable, not enforced'] },
      b: { title: 'POST /api/policy/publish', lines: ['status=active only'] },
      c: { title: 'snapshots + events', lines: ['enterprise_runtime_*'] },
      d: { title: 'gateway reload', lines: ['Remote URL or local file'] },
      note: 'blocked=true only when action is block. POST /api/policy/test merges unsaved form preview with stored rules.',
    },
    zh: {
      header: { eyebrow: '数据流', title: '只有已发布规则进入快照', subtitle: '草稿留在 PG。网关热加载 active 快照。' },
      desc: 'draft → POST /api/policy/publish → 发布事件 + 快照 → 网关 policy-engine。',
      a: { title: 'policy_rules 草稿', lines: ['可编辑，不生效'] },
      b: { title: 'POST /api/policy/publish', lines: ['仅 status=active'] },
      c: { title: '快照 + 事件', lines: ['enterprise_runtime_*'] },
      d: { title: '网关热加载', lines: ['远程 URL 或本地文件'] },
      note: 'blocked=true 仅当动作为拦截。POST /api/policy/test 会合并未保存的表单预览与库内规则。',
    },
  },
  'ent-audit-dual': {
    fn: entFour,
    en: {
      header: { eyebrow: 'Data flow', title: 'JSONL must succeed; Postgres is best-effort', subtitle: 'Startup backfills .pg-pending for GATEWAY_AUDIT_BACKFILL_DAYS (default 7).' },
      desc: 'Each LLM call writes append-only JSONL, then tries gateway_audit_events. Failures land in .pg-pending.',
      a: { title: 'Gateway LLM call', lines: ['Must write JSONL'] },
      b: { title: 'JSONL on disk', lines: ['.runtime/audit/'] },
      c: { title: 'gateway_audit_events', lines: ['Best-effort PG'] },
      d: { title: '.pg-pending → boot', lines: ['Backfill window 7d'] },
      note: 'Admin /audit reads PgAuditStore with audit:read:all or audit:read:dept. IAM admin audit is a different table: audit_events.',
    },
    zh: {
      header: { eyebrow: '数据流', title: 'JSONL 必须成功；Postgres 尽力而为', subtitle: '启动时按 GATEWAY_AUDIT_BACKFILL_DAYS（默认 7）回灌 .pg-pending。' },
      desc: '每次 LLM 调用先写 append-only JSONL，再尝试 gateway_audit_events。失败落入 .pg-pending。',
      a: { title: '网关 LLM 调用', lines: ['必须写下 JSONL'] },
      b: { title: '磁盘 JSONL', lines: ['.runtime/audit/'] },
      c: { title: 'gateway_audit_events', lines: ['尽力写 PG'] },
      d: { title: '.pg-pending → 启动', lines: ['回灌窗口 7 天'] },
      note: 'Admin /audit 读 PgAuditStore，可见域是 audit:read:all 或 audit:read:dept。IAM 管理审计在另一张表 audit_events。',
    },
  },
  'ent-metering': {
    fn: entThree,
    en: {
      header: { eyebrow: 'Data flow', title: 'Usage lands in usage_records', subtitle: 'Quotas are enforced by quota.Tracker. The admin page is still mostly query/export.' },
      desc: 'Gateway billing writes usage_records. Admin /metering queries them. Portal can show a token chip from SSE usage.',
      a: { title: 'Gateway settle', lines: ['usage_records row'] },
      b: { title: 'admin /metering', lines: ['Query + export'] },
      c: { title: 'Portal token chip', lines: ['SSE / usage'] },
      note: 'Tracker can key PAT → user → dept → model → role. Treat tenant-level limits as the product default; do not promise a finished dept/user quota console.',
    },
    zh: {
      header: { eyebrow: '数据流', title: '用量落到 usage_records', subtitle: '配额由 quota.Tracker 执行。管理台额度页仍偏查询 / 导出。' },
      desc: '网关结算写入 usage_records。Admin /metering 查询。Portal 可用 SSE usage 显示 token chip。',
      a: { title: '网关结算', lines: ['usage_records 行'] },
      b: { title: 'admin /metering', lines: ['查询 + 导出'] },
      c: { title: 'Portal token chip', lines: ['SSE / usage'] },
      note: 'Tracker 选择顺序是 PAT → 用户 → 部门 → 模型 → 角色。产品默认按租户级限额讲；不要承诺已经做好的部门 / 用户配额控制台。',
    },
  },
  'ent-channel': {
    fn: entFive,
    en: {
      header: { eyebrow: 'Gateway', title: 'Channel relay when the registry is on', subtitle: 'Enable with GATEWAY_CHANNEL_REGISTRY=on. Admin CRUD lives in gateway_channels.' },
      desc: 'Admin writes channels. Gateway polls /api/internal/channels, picks by weight/priority, then relay.Executor retries.',
      a: { title: 'Admin CRUD', lines: ['gateway_channels'] },
      b: { title: 'Internal poll ~5s', lines: ['/api/internal/channels'] },
      c: { title: 'channel.Registry', lines: ['Refresh in process'] },
      d: { title: 'Picker', lines: ['Weight · priority · affinity'] },
      e: { title: 'relay.Executor', lines: ['Adaptor → upstream'] },
      note: 'Key pool rotation happens inside the executor. A missing env ref is skipped; cooldown starts after three consecutive retryable failures.',
    },
    zh: {
      header: { eyebrow: '网关', title: '打开 Registry 后的 Channel 中继', subtitle: '开关是 GATEWAY_CHANNEL_REGISTRY=on。Admin CRUD 落在 gateway_channels。' },
      desc: 'Admin 写 Channel。网关轮询 /api/internal/channels，按权重 / 优先级挑选，再由 relay.Executor 重试。',
      a: { title: 'Admin CRUD', lines: ['gateway_channels'] },
      b: { title: '内部轮询 ~5s', lines: ['/api/internal/channels'] },
      c: { title: 'channel.Registry', lines: ['进程内刷新'] },
      d: { title: 'Picker', lines: ['权重 · 优先级 · 亲和'] },
      e: { title: 'relay.Executor', lines: ['Adaptor → 上游'] },
      note: 'Key 轮转发生在 executor 内。缺失的环境变量名会被跳过；连续三次可重试失败后进入冷却。',
    },
  },
  'ent-sso': {
    fn: entSso,
    en: {
      header: { eyebrow: 'Data flow', title: 'OIDC login to the portal', subtitle: 'Admin mirrors the same routes on :3001. Provider CRUD is under /settings/sso.' },
      desc: 'SSO button → /api/auth/sso/oidc/start → IdP authorize → callback → token exchange → JIT upsert + cookie.',
      s1: { title: 'Click SSO', lines: ['Portal /auth'] },
      s2: { title: '302 to start', lines: ['/api/auth/sso/oidc/start'] },
      s3: { title: 'IdP authorize', lines: ['Enterprise IdP'] },
      s4: { title: 'Callback + code', lines: ['/oidc/callback'] },
      s5: { title: 'Token exchange', lines: ['Then JIT upsert'] },
      s6: { title: 'Set-Cookie', lines: ['Redirect /workspace'] },
      note: 'Missing NEXT_PUBLIC_SSO_PROVIDERS or issuer env fails discovery. Restart Next after changing SSO env; hot reload will not pick it up.',
    },
    zh: {
      header: { eyebrow: '数据流', title: '前台 OIDC 登录', subtitle: 'Admin 在 :3001 镜像同一组路由。Provider CRUD 在 /settings/sso。' },
      desc: '点 SSO → /api/auth/sso/oidc/start → IdP authorize → callback → 换 token → JIT upsert + cookie。',
      s1: { title: '点击 SSO', lines: ['Portal /auth'] },
      s2: { title: '302 到 start', lines: ['/api/auth/sso/oidc/start'] },
      s3: { title: 'IdP authorize', lines: ['企业 IdP'] },
      s4: { title: 'Callback + code', lines: ['/oidc/callback'] },
      s5: { title: '换 token', lines: ['然后 JIT upsert'] },
      s6: { title: 'Set-Cookie', lines: ['跳转 /workspace'] },
      note: '缺少 NEXT_PUBLIC_SSO_PROVIDERS 或 issuer 会 discovery 失败。改 SSO 环境变量后必须重启 Next，热更新不会生效。',
    },
  },
  'ent-gw-chat': {
    fn: entGwChat,
    en: {
      header: { eyebrow: 'Gateway', title: 'handleChatCompletions order', subtitle: 'Stream path evaluates policy while scanning SSE, then audits in segments.' },
      desc: 'JWT → quota → request policy → route or channel → provider/relay → response or stream policy → audit → metering.',
      s1: { title: 'Parse JWT', lines: ['Four subject claims'] },
      s2: { title: 'quota.Check', lines: ['Tracker + limiter'] },
      s3: { title: 'EvaluateRequest', lines: ['block returns error'] },
      s4: { title: 'Route or Pick', lines: ['Decide / channel.Pick'] },
      s5: { title: 'Call / relay', lines: ['provider or Executor'] },
      s6: { title: 'Non-stream pass', lines: ['EvaluateResponse'] },
      s7: { title: 'Stream pass', lines: ['SSE + stream policy'] },
      s8: { title: 'Audit then meter', lines: ['JSONL + usage_records'] },
      note: 'Routing order: explicit provider header → local_route_header → model route → default_route. Values: local / private-cloud / third-party.',
    },
    zh: {
      header: { eyebrow: '网关', title: 'handleChatCompletions 顺序', subtitle: '流式路径在扫描 SSE 时做策略，再分段审计。' },
      desc: 'JWT → 配额 → 请求策略 → 路由或 Channel → provider/relay → 响应或流式策略 → 审计 → 计量。',
      s1: { title: '解析 JWT', lines: ['主体四维'] },
      s2: { title: 'quota.Check', lines: ['Tracker + limiter'] },
      s3: { title: 'EvaluateRequest', lines: ['block 直接返回错误'] },
      s4: { title: '路由或挑选', lines: ['Decide / channel.Pick'] },
      s5: { title: '调用 / 中继', lines: ['provider 或 Executor'] },
      s6: { title: '非流式二次评估', lines: ['EvaluateResponse'] },
      s7: { title: '流式二次评估', lines: ['SSE + stream 策略'] },
      s8: { title: '审计再计量', lines: ['JSONL + usage_records'] },
      note: '路由优先级：显式 provider header → local_route_header → 模型 route → default_route。取值：local / private-cloud / third-party。',
    },
  },
  'ent-schema': {
    fn: entSchema,
    en: {
      header: { eyebrow: 'Database', title: 'Tenant is the root of almost every table', subtitle: 'Business tables carry tenant_id. Cross-tenant reads are rejected in the API layer.' },
      desc: 'tenants own IAM, chat, policy, runtime, audit, and channels. Departments nest. Users own sessions and messages.',
      tenant: { kicker: 'tenants', title: 'One tenant row', lines: ['RESTRICT deletes · composite unique keys include tenant_id'] },
      iam: { kicker: 'IAM', title: 'Org · dept · user · role', lines: ['user_roles · sso_providers'] },
      chat: { kicker: 'Chat', title: 'Sessions · messages', lines: ['Owned by users'] },
      policy: { kicker: 'Policy', title: 'Packs · rules · versions', lines: ['publish_events'] },
      runtime: { kicker: 'Runtime', title: 'enterprise_runtime_*', lines: ['Providers · quotas · snapshots'] },
      audit: { kicker: 'Audit', title: 'Two tables', lines: ['gateway_audit_events · audit_events'] },
      chan: { kicker: 'Relay', title: 'gateway_channels', lines: ['AES-GCM api_key_cipher'] },
      note: 'Primary keys are ULID varchar(26). Encrypt provider/channel/SSO secrets with the documented env keys. This diagram is a map, not a substitute for schema.md.',
    },
    zh: {
      header: { eyebrow: '数据库', title: '租户几乎是每张表的根', subtitle: '业务表都带 tenant_id。API 层禁止跨租户读写。' },
      desc: 'tenants 拥有 IAM、聊天、策略、运行时、审计和 Channel。部门可嵌套。用户拥有会话和消息。',
      tenant: { kicker: 'tenants', title: '一行租户', lines: ['删除多为 RESTRICT · 复合唯一常含 tenant_id'] },
      iam: { kicker: 'IAM', title: '组织 · 部门 · 用户 · 角色', lines: ['user_roles · sso_providers'] },
      chat: { kicker: '聊天', title: '会话 · 消息', lines: ['归属用户'] },
      policy: { kicker: '策略', title: '包 · 规则 · 版本', lines: ['publish_events'] },
      runtime: { kicker: '运行时', title: 'enterprise_runtime_*', lines: ['Provider · 配额 · 快照'] },
      audit: { kicker: '审计', title: '两张表', lines: ['gateway_audit_events · audit_events'] },
      chan: { kicker: '中继', title: 'gateway_channels', lines: ['AES-GCM api_key_cipher'] },
      note: '主键是 ULID varchar(26)。Provider / Channel / SSO 密钥按文档环境变量加密。这张图是地图，不能代替 schema.md。',
    },
  },
  'ent-mcp': {
    fn: entMcp,
    en: {
      header: { eyebrow: 'MCP hosting', title: 'Same process, separate handlers', subtitle: 'Routes mount only when GATEWAY_MCP_HOSTING=on. Builtin demo needs no Postgres row.' },
      desc: 'Client hits /mcp/{server}/… → Host resolves Registry, entitlement, backend, then transport.',
      route: { kicker: 'chi', title: '/mcp/registry and /mcp/{server}/*', lines: ['auth → mcp_tool policy → quota → audit'] },
      reg: { kicker: 'PG', title: 'Registry', lines: ['mcp_servers · mcp_tools', 'builtin demo'] },
      back: { kicker: 'Backend', title: 'echo · openapi', lines: ['custom-go is a stub'] },
      tr: { kicker: 'Transport', title: 'Streamable HTTP · SSE', lines: ['messages channel for SSE'] },
      note: 'Scopes: mcp:server:{name}:read / :invoke, or mcp:*. Rate limit is tool_calls_per_minute (default 60). edge-agent does not host MCP.',
    },
    zh: {
      header: { eyebrow: 'MCP 托管', title: '同一进程，独立 handler', subtitle: '只有 GATEWAY_MCP_HOSTING=on 才挂路由。内置 demo 不需要 PG 行。' },
      desc: '客户端打 /mcp/{server}/… → Host 解析 Registry、授权、backend，再走 transport。',
      route: { kicker: 'chi', title: '/mcp/registry 与 /mcp/{server}/*', lines: ['auth → mcp_tool 策略 → 配额 → 审计'] },
      reg: { kicker: 'PG', title: 'Registry', lines: ['mcp_servers · mcp_tools', '内置 demo'] },
      back: { kicker: 'Backend', title: 'echo · openapi', lines: ['custom-go 只是留口'] },
      tr: { kicker: 'Transport', title: 'Streamable HTTP · SSE', lines: ['SSE 另有 messages 通道'] },
      note: 'Scope：mcp:server:{name}:read / :invoke，或 mcp:*。限流是 tool_calls_per_minute（默认 60）。edge-agent 不托管 MCP。',
    },
  },
  'ent-keypool': {
    fn: entKeypool,
    en: {
      header: { eyebrow: 'Key pool', title: 'Rotate env refs, not plaintext keys in PG', subtitle: 'metadata.keyRefs are environment variable names. A Channel API key still wins if set.' },
      desc: 'Resolve skips cooldown and empty env. Retryable 401/403/429/5xx marks failure; three hits start a 60s cooldown.',
      a: { title: 'Channel keyRefs', lines: ['DEEPSEEK_API_KEY_1, …'] },
      b: { title: 'ResolveWithRef', lines: ['Skip empty / cooldown'] },
      c: { title: 'Upstream call', lines: ['adaptor.Complete'] },
      d: { title: 'Retryable error', lines: ['401 · 403 · 429 · 5xx'] },
      e: { title: 'Cooldown 60s', lines: ['After 3 failures'] },
      note: 'PAT is a different secret: Bearer agx-pat-… hashed with SHA-256 in api_tokens. Revocation can linger in the ~60s cache.',
    },
    zh: {
      header: { eyebrow: 'Key Pool', title: '轮转的是环境变量名，不是库里的明文 Key', subtitle: 'metadata.keyRefs 是环境变量名。Channel 上若填了 API Key，仍优先用它。' },
      desc: 'Resolve 跳过冷却和空环境变量。可重试的 401/403/429/5xx 记失败；连续三次进入 60 秒冷却。',
      a: { title: 'Channel keyRefs', lines: ['DEEPSEEK_API_KEY_1, …'] },
      b: { title: 'ResolveWithRef', lines: ['跳过空值 / 冷却'] },
      c: { title: '上游调用', lines: ['adaptor.Complete'] },
      d: { title: '可重试错误', lines: ['401 · 403 · 429 · 5xx'] },
      e: { title: '冷却 60 秒', lines: ['连续失败 3 次后'] },
      note: 'PAT 是另一类密钥：Bearer agx-pat-…，库内只存 SHA-256。吊销后 LRU 缓存最长约 60 秒仍可能接受旧 Token。',
    },
  },
};

mkdirSync(outDir, { recursive: true });
let count = 0;
for (const [stem, spec] of Object.entries(copy)) {
  for (const locale of ['en', 'zh']) {
    const svg = spec.fn(spec[locale]);
    const file = join(outDir, `${stem}-${locale}.svg`);
    writeFileSync(file, svg);
    count += 1;
  }
}
console.log(`wrote ${count} svgs → ${outDir}`);
