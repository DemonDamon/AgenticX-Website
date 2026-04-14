"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const desktop = searchParams.get("desktop") === "1";
  const deviceId = searchParams.get("device_id")?.trim() ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const supabaseReady = useMemo(() => {
    try {
      getSupabaseBrowserClient();
      return true;
    } catch {
      return false;
    }
  }, []);

  const bindDesktopSession = useCallback(
    async (accessToken: string, refreshToken: string | null) => {
      if (!desktop || !deviceId) return;
      const res = await fetch("/api/auth/device/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          device_id: deviceId,
          refresh_token: refreshToken ?? "",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `confirm_failed_${res.status}`);
      }
    },
    [desktop, deviceId]
  );

  const onEmailSignIn = async () => {
    if (!supabaseReady) {
      toast.error("未配置 Supabase 环境变量，无法登录");
      return;
    }
    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      const session = data.session;
      if (!session?.access_token) throw new Error("no_session");
      await bindDesktopSession(session.access_token, session.refresh_token);
      toast.success("登录成功");
      router.replace("/agents");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "登录失败");
    } finally {
      setBusy(false);
    }
  };

  const onEmailSignUp = async () => {
    if (!supabaseReady) {
      toast.error("未配置 Supabase 环境变量，无法注册");
      return;
    }
    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      const session = data.session;
      if (session?.access_token) {
        await bindDesktopSession(session.access_token, session.refresh_token);
        toast.success("注册并登录成功");
        router.replace("/agents");
        router.refresh();
        return;
      }
      toast.message("请查收邮箱验证链接（如项目启用了邮箱确认）");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || "注册失败");
    } finally {
      setBusy(false);
    }
  };

  const onWechatMock = () => {
    toast.info("微信扫码登录即将上线，请先用邮箱登录");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-950 text-zinc-50">
      <Toaster richColors position="top-center" />
      {/* 左侧：产品介绍 */}
      <div className="flex-1 flex flex-col justify-between p-10 lg:p-14 border-b lg:border-b-0 lg:border-r border-zinc-800">
        <div>
          <div className="text-sm font-semibold tracking-wide text-zinc-400">AgenticX · Machi</div>
          <h1 className="mt-6 text-2xl lg:text-3xl font-bold leading-tight tracking-tight">
            Claw Your Ideas Into Reality
          </h1>
          <p className="mt-3 text-lg text-zinc-300 font-medium">随处下达，本地完成。</p>
          <p className="mt-4 text-zinc-400 max-w-md">
            桌面端多智能体助手：模型自选、工作区与工具链深度集成。官网账号用于后续云端能力与权益同步（可选）。
          </p>
          <ul className="mt-8 space-y-3 text-sm text-zinc-300">
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">本地会话与配置优先保留在本机</li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">支持多模型供应商与 MCP / 技能生态</li>
            <li className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">与 Machi 桌面端一键绑定登录</li>
          </ul>
        </div>
        <div className="mt-10 text-xs text-zinc-500">
          {desktop && deviceId ? (
            <p>桌面绑定模式：device_id 已附带在链接中，登录完成后将自动回写 Machi。</p>
          ) : (
            <p>浏览器直接登录：登录后可使用 Machi 云端工作台（演示）。</p>
          )}
        </div>
      </div>

      {/* 右侧：登录 */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white text-zinc-900">
        <Card className="w-full max-w-md border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">欢迎回来</CardTitle>
            <CardDescription className="text-zinc-600">
              {desktop ? "登录以连接 Machi 桌面应用" : "登录 AgenticX 账号以继续"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!supabaseReady && (
              <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                服务端未配置 <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
                <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>，请联系管理员。
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-zinc-300"
              onClick={onWechatMock}
              disabled={busy}
            >
              <span className="mr-2 text-lg leading-none">💬</span>
              微信登录（即将上线）
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500">或使用邮箱</span>
              </div>
            </div>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">登录</TabsTrigger>
                <TabsTrigger value="signup">注册</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button className="w-full" disabled={busy || !supabaseReady} onClick={() => void onEmailSignIn()}>
                  {busy ? "处理中…" : "邮箱登录"}
                </Button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email2">邮箱</Label>
                  <Input
                    id="email2"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2">密码</Label>
                  <Input
                    id="password2"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <Button className="w-full" disabled={busy || !supabaseReady} onClick={() => void onEmailSignUp()}>
                  {busy ? "处理中…" : "注册并登录"}
                </Button>
              </TabsContent>
            </Tabs>
            <p className="text-center text-xs text-zinc-500">
              继续即表示你同意我们的{" "}
              <Link href="/terms" className="underline underline-offset-2">
                服务条款
              </Link>{" "}
              与{" "}
              <Link href="/privacy" className="underline underline-offset-2">
                隐私政策
              </Link>
              。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400 text-sm">
          加载中…
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
