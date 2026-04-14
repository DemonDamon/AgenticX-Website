"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Clock, MessageSquarePlus } from "lucide-react";

import { ChatWorkspace } from "@/components/agents/ChatWorkspace";
import { ModelServicePanel } from "@/components/agents/ModelServicePanel";
import { MachiAvatar } from "@/components/branding/MachiAvatar";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";

type SessionItem = { id: string; title: string };

export default function AgentsHomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<"chat" | "settings">("chat");
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [modelLabel] = useState("移动云 / minimax-m2.5");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          router.replace("/auth");
          return;
        }
        const u = data.session.user;
        if (!cancelled) setEmail(u.email ?? u.phone ?? "Machi 用户");
      } catch {
        router.replace("/auth");
        return;
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const onNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    setSessions((s) => [{ id, title: "新会话" }, ...s]);
    setActiveId(id);
    setWorkspace("chat");
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-zinc-500 text-sm">
        校验登录状态…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#0a0a0a] text-zinc-100 overflow-hidden">
      {/* 左侧：仅新建会话 + 历史（Kimi 式窄栏） */}
      <aside className="w-full md:w-[260px] shrink-0 border-b md:border-b-0 md:border-r border-zinc-800/90 flex flex-col bg-[#0f0f0f] min-h-0">
        <div className="p-3 flex items-center justify-between gap-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 min-w-0">
            <MachiAvatar size={32} className="h-8 w-8 shrink-0" priority />
            <span className="text-sm font-semibold tracking-tight truncate">Machi</span>
          </div>
          <Link
            href="/"
            className="text-[11px] text-zinc-500 hover:text-zinc-300 whitespace-nowrap"
          >
            官网
          </Link>
        </div>

        <div className="p-2">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-between gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/50 hover:bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <MessageSquarePlus className="size-4" />
              新建会话
            </span>
            <kbd className="hidden sm:inline text-[10px] text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-2 pb-2">
          <div className="flex items-center gap-1.5 px-2 py-2 text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            <Clock className="size-3.5" />
            历史会话
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {sessions.length === 0 ? (
              <p className="px-2 py-3 text-xs text-zinc-600">暂无历史，点击「新建会话」开始</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveId(s.id);
                    setWorkspace("chat");
                  }}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-lg text-sm truncate transition-colors",
                    activeId === s.id
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  )}
                >
                  {s.title}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 左下角：资料条 → 主区切换为设置（非弹窗、非新页面） */}
        <div className="p-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() => setWorkspace("settings")}
            className="w-full flex items-center gap-2 rounded-xl px-2 py-2.5 hover:bg-zinc-900/90 transition-colors text-left"
          >
            <div className="size-9 rounded-full overflow-hidden border border-zinc-700 shrink-0 bg-zinc-900">
              <MachiAvatar size={36} className="h-9 w-9" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-100 truncate">{email ?? "—"}</div>
              <div className="text-[10px] text-zinc-500">模型服务 · 设置</div>
            </div>
            <ChevronRight className="size-4 text-zinc-500 shrink-0" />
          </button>
        </div>
      </aside>

      {/* 主区：聊天 或 Cursor 式「模型服务」 */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#0a0a0a]">
        {workspace === "settings" ? (
          <>
            <header className="shrink-0 flex items-center gap-3 px-4 md:px-6 h-12 border-b border-zinc-800/80">
              <button
                type="button"
                onClick={() => setWorkspace("chat")}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ← 返回对话
              </button>
              <span className="text-zinc-600">|</span>
              <span className="text-sm font-medium text-zinc-200">模型服务</span>
            </header>
            <ModelServicePanel className="flex-1 overflow-hidden" />
          </>
        ) : (
          <ChatWorkspace modelLabel={modelLabel} className="flex-1" />
        )}
      </main>
    </div>
  );
}
