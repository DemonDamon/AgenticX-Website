'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  Code2,
  Cpu,
  HardDrive,
  Layers,
  MessageSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from '@/i18n/locale-context';
import { cn } from '@/lib/utils';

type SceneTag = { title: string; detail: string };

const INSTALL_CMD = 'pip install agenticx';

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  return reduce;
}

function useAutoCycle(length: number, intervalMs: number, paused: boolean, offsetMs = 0) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || paused) return;
    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      setActive((prev) => (prev + 1) % length);
      intervalId = window.setInterval(() => {
        setActive((prev) => (prev + 1) % length);
      }, intervalMs);
    }, offsetMs);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [reduce, paused, length, intervalMs, offsetMs]);

  return [active, setActive] as const;
}

function useTypedCommand(target: string, active: boolean, speedMs = 38) {
  const reduce = useReducedMotion();
  const [text, setText] = useState(target);

  useEffect(() => {
    if (reduce || !active) {
      setText(target);
      return;
    }
    let idx = 1;
    setText(target.slice(0, idx));
    const id = window.setInterval(() => {
      idx += 1;
      setText(target.slice(0, idx));
      if (idx >= target.length) {
        window.clearInterval(id);
      }
    }, speedMs);
    return () => window.clearInterval(id);
  }, [target, active, reduce, speedMs]);

  return text;
}

interface HeroOverlaySpec {
  tag: string;
  line: string;
  status: string;
}

const CARD_ICONS = [
  [Terminal, Cpu, Code2],
  [HardDrive, Users, Radio],
  [MessageSquare, Layers, ShieldCheck],
] as const;

export function SceneCard({
  scene,
  artSrc,
  index,
}: {
  scene: { title: string; description: string; tags: SceneTag[] };
  artSrc: string;
  index: number;
}) {
  const { locale } = useLocale();
  const { home } = useTranslations();
  const isEn = locale === 'en';

  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [hovered, setHovered] = useState<number | null>(null);
  const [cycleIndex, setCycleIndex] = useAutoCycle(
    3,
    2800,
    hovered !== null,
    index * 620,
  );
  const activeIndex = hovered ?? cycleIndex;
  const typedInstall = useTypedCommand(INSTALL_CMD, index === 0 && activeIndex === 0, 36);

  const overlays: HeroOverlaySpec[][] = [
    [
      {
        tag: 'CLI',
        line: `$ ${typedInstall}`,
        status: 'PyPI · v0.6',
      },
      {
        tag: 'STUDIO',
        line: '$ agx serve --port 8000',
        status: `${home.motion.terminal.ready} · ${home.motion.terminal.host}`,
      },
      {
        tag: 'PYTHON',
        line: 'from agenticx import Agent, Runtime',
        status: 'REST + SSE',
      },
    ],
    [
      {
        tag: 'LOCAL',
        line: '~/.agenticx/config.yaml · sessions.sqlite',
        status: isEn ? 'On-device' : '本机落盘',
      },
      {
        tag: 'ROUTER',
        line: `${home.motion.route.user} -> ${home.motion.route.reply}`,
        status: home.motion.route.meta,
      },
      {
        tag: 'BRIDGE',
        line: isEn
          ? 'Feishu / WeChat -> active Near session'
          : '飞书 / 微信 -> 写入当前绑定会话',
        status: isEn ? 'Synced' : '实时同步',
      },
    ],
    [
      {
        tag: 'PORTAL',
        line: isEn
          ? 'Multi-model workspace · chat history'
          : '多模型工作台 · 历史会话实时入库',
        status: 'SSO / OIDC',
      },
      {
        tag: 'POLICY',
        line: isEn
          ? 'RBAC scopes · PII redact & guardrails'
          : '部门 RBAC · 敏感词拦截与 PII 脱敏',
        status: isEn ? 'Enforced' : '策略生效',
      },
      {
        tag: 'GATEWAY',
        line: isEn
          ? 'Blake2b audit chain · token metering'
          : 'Blake2b 审计链 · Token 按次计量回写',
        status: isEn ? 'Verified' : '链完整',
      },
    ],
  ];

  const iconSet = CARD_ICONS[index] ?? CARD_ICONS[0];
  const currentOverlay = overlays[index]?.[activeIndex] ?? overlays[0]![0]!;

  const renderRightDetail = (rowIdx: number, tag: SceneTag, isActive: boolean) => {
    if (index === 0 && rowIdx === 0) {
      return (
        <span className="inline-flex items-center font-mono text-xs text-foreground/95">
          <span className="mr-1 text-muted-foreground/70">$</span>
          {isActive ? typedInstall : INSTALL_CMD}
          {isActive ? <span className="agx-caret" /> : null}
        </span>
      );
    }

    if (index === 0 && rowIdx === 1) {
      return isActive ? (
        <span className="agx-StageSwap inline-flex items-center gap-1.5 font-mono text-xs text-[#D97706] dark:text-[#FBBF24]">
          <span className="agx-StagePulseDot" />
          <span>{home.motion.terminal.ready}</span>
          <span className="text-muted-foreground">{home.motion.terminal.host}</span>
        </span>
      ) : (
        <span className="font-mono text-xs text-muted-foreground">
          <span className="mr-1 text-muted-foreground/60">$</span>
          {tag.detail}
        </span>
      );
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 text-xs transition-colors duration-200',
          isActive ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        <span>{tag.detail}</span>
        <span
          className={cn(
            'inline-flex h-4 w-4 items-center justify-center rounded-full transition-[transform,opacity,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
            isActive
              ? 'scale-100 bg-[#E86C1F]/15 text-[#E86C1F] opacity-100 dark:bg-[#F59E0B]/20 dark:text-[#FBBF24]'
              : 'scale-90 opacity-0',
          )}
        >
          {index === 2 ? (
            <Check className="h-2.5 w-2.5 stroke-[2.5]" />
          ) : (
            <Sparkles className="h-2.5 w-2.5" />
          )}
        </span>
      </span>
    );
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={(event) => {
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const rect = cardRef.current?.getBoundingClientRect();
        const glow = glowRef.current;
        if (!rect || !glow) return;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        glow.style.opacity = '1';
        glow.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(245, 158, 11, 0.11), transparent 70%)`;
      }}
      onMouseLeave={() => {
        setHovered(null);
        if (glowRef.current) glowRef.current.style.opacity = '0';
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/90 bg-card shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition-[transform,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:-translate-y-0.5 hover:border-[#E86C1F]/35 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)] dark:hover:border-[#F59E0B]/30"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-200 ease-out"
      />

      <div className="relative aspect-video w-full overflow-hidden bg-[#0c0a09]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artSrc}
          alt={scene.title}
          className="h-full w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
        />

        <div
          aria-hidden
          className=" absolute inset-x-3 bottom-2.5 flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-zinc-950/75 px-3 py-1.5 text-[11px] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_20px_rgba(0,0,0,0.45)] backdrop-blur-md"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="agx-StagePulseDot text-[#F59E0B]" />
            <span className="shrink-0 rounded bg-[#F59E0B]/15 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#FBBF24]">
              {currentOverlay.tag}
            </span>
            <span
              key={`line-${activeIndex}`}
              className="agx-StageSwap truncate font-mono text-[11px] text-zinc-200"
            >
              {currentOverlay.line}
            </span>
          </div>
          <span
            key={`status-${activeIndex}`}
            className="agx-StageSwap shrink-0 font-mono text-[10px] text-zinc-400"
          >
            {currentOverlay.status}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between p-6 pt-5">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{scene.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            {scene.description}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          {scene.tags.slice(0, 3).map((tag, rowIdx) => {
            const isActive = activeIndex === rowIdx;
            const Icon = iconSet[rowIdx] ?? Terminal;

            return (
              <div
                key={tag.title}
                onMouseEnter={() => {
                  setHovered(rowIdx);
                  setCycleIndex(rowIdx);
                }}
                className={cn(
                  'group/row relative flex cursor-default items-center justify-between gap-3 overflow-hidden rounded-xl border px-3.5 py-2.5 transition-[transform,border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                  isActive
                    ? 'border-[#E86C1F]/40 bg-gradient-to-r from-[#E86C1F]/[0.11] via-[#E86C1F]/[0.04] to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-[#F59E0B]/35 dark:from-[#F59E0B]/[0.13] dark:via-[#F59E0B]/[0.04]'
                    : 'border-border/80 bg-background/60 hover:border-border',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#F59E0B] to-[#EA580C] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                    isActive ? 'scale-y-100 opacity-100' : 'scale-y-50 opacity-0',
                  )}
                />

                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-[transform,colors,background-color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                      isActive
                        ? 'scale-100 border-[#E86C1F]/35 bg-[#E86C1F]/15 text-[#E86C1F] dark:border-[#F59E0B]/35 dark:bg-[#F59E0B]/15 dark:text-[#FBBF24]'
                        : 'scale-95 border-border/70 bg-muted/40 text-muted-foreground',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={cn(
                      'truncate text-sm font-medium transition-colors duration-200',
                      isActive ? 'text-foreground' : 'text-foreground/80',
                    )}
                  >
                    {tag.title}
                  </span>
                </div>

                <div className="min-w-0 shrink-0 text-right">
                  {renderRightDetail(rowIdx, tag, isActive)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
