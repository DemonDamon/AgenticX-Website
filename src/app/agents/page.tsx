"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Code2,
  FileText,
  LayoutGrid,
  Monitor,
  Paperclip,
  Presentation,
  SendHorizonal,
  Sparkles,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const pills = [
  { label: "幻灯片", icon: Presentation },
  { label: "视频生成", icon: Video },
  { label: "深度研究", icon: Sparkles },
  { label: "文档处理", icon: FileText },
  { label: "数据分析", icon: BarChart3 },
  { label: "可视化", icon: LayoutGrid },
];

export default function AgentsHomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"code" | "office">("office");

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

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 text-zinc-500 text-sm">
        校验登录状态…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col">
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center px-4 gap-3 shrink-0">
        <span className="font-semibold tracking-tight">Machi Cloud</span>
        <span className="text-xs text-zinc-500 ml-auto">
          <Link href="/" className="underline-offset-2 hover:underline">
            返回官网
          </Link>
        </span>
      </header>
      <main className="flex-1 flex flex-col items-center px-4 py-10 max-w-4xl mx-auto w-full">
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 text-white flex items-center justify-center text-2xl font-bold mb-6">
          MX
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center">Claw Your Ideas Into Reality</h1>
        <p className="mt-2 text-sm text-zinc-600 text-center">Triggered Anywhere, Completed Locally.</p>

        <div className="mt-8 flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setMode("code")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === "code" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <Code2 className="size-4" />
            代码开发
          </button>
          <button
            type="button"
            onClick={() => setMode("office")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              mode === "office" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            <Monitor className="size-4" />
            日常办公
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {pills.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-full bg-white border border-zinc-200 text-zinc-800 shadow-sm"
            >
              <Icon className="size-4 mr-1.5 opacity-70" />
              {label}
            </Button>
          ))}
        </div>

        <div className="mt-auto w-full max-w-2xl pt-16 pb-8">
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-3 flex items-end gap-2">
            <Button type="button" size="icon" variant="ghost" className="shrink-0 text-zinc-500">
              <Paperclip className="size-5" />
            </Button>
            <textarea
              className="flex-1 min-h-[44px] max-h-40 resize-none bg-transparent text-sm outline-none px-1 py-2"
              placeholder="输入消息…"
              rows={2}
            />
            <Button type="button" size="icon" className="shrink-0 rounded-xl">
              <SendHorizonal className="size-5" />
            </Button>
          </div>
          <p className="text-center text-[11px] text-zinc-400 mt-2">
            演示工作台 · 与 Machi 桌面端登录联动后可用于后续云端能力扩展
          </p>
        </div>
      </main>
    </div>
  );
}
