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
    <div className="min-h-screen flex flex-col lg:flex-row bg-black text-zinc-50 selection:bg-white/30">
      <Toaster richColors position="top-center" theme="dark" />
      
      {/* 左侧：品牌与视觉 - 极客化解构、高对比度黑白 */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden border-r border-white/10">
        {/* 背景网格点缀 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
            AgenticX // Core System
          </div>
          <h1 className="mt-12 text-[5.5rem] leading-[0.85] font-black tracking-tighter text-white">
            MA<br />CHI<span className="text-zinc-600">.</span>
          </h1>
          <div className="mt-8 font-mono text-sm text-zinc-500 max-w-sm leading-relaxed">
            <p className="text-zinc-400">"绝对理性，冷酷洞悉。"</p>
            <div className="mt-4 space-y-1">
              <p>&gt; 初始化本地工作区上下文...</p>
              <p>&gt; 加载多模型调度引擎...</p>
              <p>&gt; 建立安全端到端隧道...</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-200">
            Claw Your Ideas Into Reality.
          </h2>
          <ul className="mt-6 space-y-4 font-mono text-xs text-zinc-400">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-white rounded-full" /> 本地会话优先，数据安全隔离
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" /> 高对比度极客视觉，剥离冗余噪音
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full" /> 桌面端一键握手，无缝能力跃迁
            </li>
          </ul>
        </div>
      </div>

      {/* 右侧：登录面板 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-[#050505]">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {desktop ? "Authenticate" : "System Access"}
            </h2>
            <p className="text-sm text-zinc-400 font-mono">
              {desktop ? "ENTER CREDENTIALS TO BIND DESKTOP" : "IDENTIFY YOURSELF TO CONTINUE"}
            </p>
          </div>

          <div className="space-y-6">
            {!supabaseReady && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-sm text-red-400 text-xs font-mono">
                [!] MISSING_ENV: NEXT_PUBLIC_SUPABASE_URL / ANON_KEY
              </div>
            )}

            <Button
              type="button"
              className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium rounded-sm transition-colors uppercase tracking-widest text-xs"
              onClick={onWechatMock}
              disabled={busy}
            >
              WeChat Login (Coming Soon)
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                or use email
              </span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-900/50 rounded-sm p-1">
                <TabsTrigger value="signin" className="rounded-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 transition-all font-mono text-xs uppercase tracking-wider">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-sm data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 transition-all font-mono text-xs uppercase tracking-wider">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 pt-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@agenticx.com"
                    className="h-11 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-700 rounded-sm focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-zinc-900/50 border-zinc-800 text-white rounded-sm focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm"
                  />
                </div>
                <Button 
                  className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-white rounded-sm font-mono text-[11px] uppercase tracking-widest mt-2 transition-colors border border-zinc-700" 
                  disabled={busy || !supabaseReady} 
                  onClick={() => void onEmailSignIn()}
                >
                  {busy ? "PROCESSING..." : "AUTHORIZE"}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 pt-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="email2" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Email</Label>
                  <Input
                    id="email2"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@agenticx.com"
                    className="h-11 bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-700 rounded-sm focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2" className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Password</Label>
                  <Input
                    id="password2"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-zinc-900/50 border-zinc-800 text-white rounded-sm focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm"
                  />
                </div>
                <Button 
                  className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-white rounded-sm font-mono text-[11px] uppercase tracking-widest mt-2 transition-colors border border-zinc-700" 
                  disabled={busy || !supabaseReady} 
                  onClick={() => void onEmailSignUp()}
                >
                  {busy ? "PROCESSING..." : "INITIALIZE ACCOUNT"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          
          {desktop && deviceId && (
             <div className="pt-4 border-t border-zinc-800/50">
               <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                 [DEVICE_BINDING_ACTIVE]<br/>
                 ID: {deviceId.split('-')[0]}***<br/>
                 Authentication will automatically sync to Machi Desktop.
               </p>
             </div>
          )}

          <p className="text-center text-[10px] text-zinc-600 font-mono mt-8 uppercase tracking-wide">
            By proceeding, you agree to our{" "}
            <Link href="/terms" className="text-zinc-400 hover:text-white underline underline-offset-4 decoration-zinc-700 transition-colors">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-zinc-400 hover:text-white underline underline-offset-4 decoration-zinc-700 transition-colors">
              Privacy
            </Link>.
          </p>
        </div>
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
