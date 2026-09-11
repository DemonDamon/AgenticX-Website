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
