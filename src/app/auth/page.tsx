"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Sun, Moon } from "lucide-react";

import { MachiAvatar } from "@/components/branding/MachiAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";
import { AgentsLocaleProvider, useAgentsLocale } from "@/contexts/agents-locale-context";
import { useAgentsUiTheme } from "@/hooks/use-agents-ui-theme";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const desktop = searchParams.get("desktop") === "1";
  const deviceId = searchParams.get("device_id")?.trim() ?? "";

  const { locale, setLocale } = useAgentsLocale();
  const { theme, setTheme } = useAgentsUiTheme();
  const isZh = locale === "zh";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  /** 仅 Sign Up 使用：展示名 / 用户名将写入 Supabase user_metadata */
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const emailHashHandledRef = useRef(false);

  const supabaseReady = useMemo(() => {
    try {
      getSupabaseBrowserClient();
      return true;
    } catch {
      return false;
    }
  }, []);

  /** Sign Up：确认框已输入且与密码不一致时展示内联错误（不依赖点击提交后的 toast） */
  const signupPasswordMismatch = useMemo(
    () => confirmPassword.length > 0 && password !== confirmPassword,
    [password, confirmPassword]
  );

  /**
   * 确认邮件回跳地址：
   * - 浏览器端优先使用当前页面 origin（最稳，避免生产环境误用 localhost 配置）
   * - 仅在无 window 环境下兜底用 NEXT_PUBLIC_SITE_URL
   */
  const buildEmailRedirectTo = useCallback(() => {
    const fromWindow =
      typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";
    const envBase = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
    const envLooksLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(envBase);
    const origin = fromWindow || (!envLooksLocal ? envBase : "");
    if (!origin) return undefined;
    const qs = new URLSearchParams();
    if (desktop) qs.set("desktop", "1");
    if (deviceId) qs.set("device_id", deviceId);
    const q = qs.toString();
    return `${origin}/auth${q ? `?${q}` : ""}`;
  }, [desktop, deviceId]);

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

  /** 邮箱确认链接常带 #access_token=… 回到 /auth；消费 hash 后绑定桌面并清掉 hash */
  useEffect(() => {
    if (!supabaseReady || typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash.includes("access_token")) return;
    if (emailHashHandledRef.current) return;
    emailHashHandledRef.current = true;

    void (async () => {
      try {
        await new Promise((r) => setTimeout(r, 0));
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session?.access_token) {
          emailHashHandledRef.current = false;
          return;
        }
        await bindDesktopSession(data.session.access_token, data.session.refresh_token);
        toast.success(isZh ? "邮箱已确认" : "Email confirmed");
        const qs = new URLSearchParams(window.location.search);
        const clean = `/auth${qs.toString() ? `?${qs.toString()}` : ""}`;
        window.history.replaceState(null, "", clean);
        router.replace("/agents");
        router.refresh();
      } catch (e) {
        emailHashHandledRef.current = false;
        const msg = e instanceof Error ? e.message : String(e);
        toast.error(msg || (isZh ? "确认邮箱后绑定失败" : "Failed to bind device after email confirmation"));
      }
    })();
  }, [supabaseReady, bindDesktopSession, router, isZh]);

  const onEmailSignIn = async () => {
    if (!supabaseReady) {
      toast.error(isZh ? "未配置 Supabase 环境变量，无法登录" : "Supabase environment not configured, cannot login");
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
      toast.success(isZh ? "登录成功" : "Login successful");
      router.replace("/agents");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || (isZh ? "登录失败" : "Login failed"));
    } finally {
      setBusy(false);
    }
  };

  const onEmailSignUp = async () => {
    if (!supabaseReady) {
      toast.error(isZh ? "未配置 Supabase 环境变量，无法注册" : "Supabase environment not configured, cannot sign up");
      return;
    }
    const name = username.trim();
    if (!name) {
      toast.error(isZh ? "请填写用户名" : "Please fill in your username");
      return;
    }
    if (name.length > 64) {
      toast.error(isZh ? "用户名请控制在 64 个字符以内" : "Username must be less than 64 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error(isZh ? "两次输入的密码不一致" : "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error(isZh ? "密码至少 6 位" : "Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const emailRedirectTo = buildEmailRedirectTo();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          ...(emailRedirectTo ? { emailRedirectTo } : {}),
          data: {
            username: name,
            display_name: name,
          },
        },
      });
      if (error) throw error;
      const session = data.session;
      if (session?.access_token) {
        await bindDesktopSession(session.access_token, session.refresh_token);
        toast.success(isZh ? "注册并登录成功" : "Signed up and logged in successfully");
        router.replace("/agents");
        router.refresh();
        return;
      }
      // 无 session：通常表示 Supabase 开启了「邮箱确认」，应已尝试发信（也可能因策略/垃圾箱/重注册而不发）
      toast.success(isZh ? "若已开启邮箱确认，请查收验证邮件" : "Please check your inbox to confirm your email", {
        description: isZh
          ? "收不到请看垃圾箱（Hotmail/Outlook 常见）。若 Supabase 关闭了「Confirm email」，不会发邮件，请改用 Sign In 登录。"
          : "Check your spam folder. If 'Confirm email' is disabled in Supabase, no email is sent, just use Sign In.",
        duration: 10_000,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg || (isZh ? "注册失败" : "Sign up failed"));
    } finally {
      setBusy(false);
    }
  };

  const onWechatMock = () => {
    toast.info(isZh ? "微信扫码登录即将上线，请先用邮箱登录" : "WeChat login coming soon, please use email for now");
  };

  const toggleLanguage = () => {
    setLocale(isZh ? "en" : "zh");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-50 selection:bg-black/10 dark:selection:bg-white/30 transition-colors">
      <Toaster richColors position="top-center" theme={theme === "dark" ? "dark" : "light"} />
      
      {/* 顶栏操作区：主题和语言 */}
      <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
        <button
          type="button"
          onClick={toggleTheme}
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <button
          type="button"
          onClick={toggleLanguage}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
        >
          {isZh ? "English" : "简体中文"}
        </button>
      </div>

      {/* 左侧：AgenticX + Machi 自有品牌区（非第三方标语） */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden border-r border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent transition-colors">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <MachiAvatar size={56} className="h-14 w-14 shrink-0" priority />
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 uppercase">AgenticX</div>
              <div className="mt-1 text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Machi</div>
              <div className="mt-0.5 text-[11px] text-zinc-500 font-mono">runtime · desktop · agents</div>
            </div>
          </div>

          <p className="mt-14 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug max-w-lg">
            {isZh ? "想清楚，在本机做完。" : "Think clearly, finish locally."}
          </p>
          <p className="mt-3 text-sm text-zinc-500 max-w-md leading-relaxed">
            Orchestrate locally. Keep the proof on your machine.
          </p>

          <div className="mt-10 font-mono text-xs text-zinc-500 max-w-sm space-y-1.5 border-l border-zinc-300 dark:border-zinc-800 pl-4">
            <p className="text-zinc-600 dark:text-zinc-400">— {isZh ? "AgenticX 提供统一智能体运行时；Machi 是桌面里的编排与门面。" : "AgenticX provides runtime; Machi is the desktop interface."}</p>
            <p>&gt; {isZh ? "多模型 · 工作区 · MCP / 技能，一处调度" : "Multi-model · Workspace · MCP / Skills"}</p>
            <p>&gt; {isZh ? "会话与敏感上下文默认留在本机" : "Sessions & context stay local by default"}</p>
            <p>&gt; {isZh ? "官网账号：身份与后续云端能力同步（可选）" : "Cloud Account: Optional sync capabilities"}</p>
          </div>
        </div>

        <div className="relative z-10 text-[11px] font-mono text-zinc-500 dark:text-zinc-600">
          {desktop && deviceId ? (
            <p>{isZh ? "桌面绑定：device_id 已在链接中；登录成功后将回写 Machi。" : "Desktop binding: device_id is present; will sync to Machi after login."}</p>
          ) : (
            <p>{isZh ? "浏览器登录：进入 Machi 云端工作台（演示）。" : "Browser login: Entering Machi Cloud Workspace (Demo)."}</p>
          )}
        </div>
      </div>

      {/* 右侧：登录面板 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-white dark:bg-[#050505] transition-colors">
        <div className="w-full max-w-[380px] space-y-8 mt-12 lg:mt-0">
          {/* 小屏也露出自有标识（左侧栏在 lg 以下隐藏） */}
          <div className="flex lg:hidden items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800/80">
            <MachiAvatar size={44} className="h-11 w-11 shrink-0" />
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-zinc-500 uppercase">AgenticX</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">Machi</div>
            </div>
          </div>

          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {desktop ? (isZh ? "连接 Machi 桌面" : "Connect Machi Desktop") : (isZh ? "登录 Machi" : "Log in to Machi")}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {desktop
                ? (isZh ? "使用邮箱验证身份，以完成本机 Machi 绑定。" : "Verify identity via email to complete local Machi binding.")
                : (isZh ? "使用 AgenticX 账号进入工作台。" : "Sign in with your AgenticX account to enter the workspace.")}
            </p>
          </div>

          <div className="space-y-6">
            {!supabaseReady && (
              <div className="p-3.5 border border-amber-500/50 dark:border-amber-900/50 rounded-sm bg-amber-50 dark:bg-amber-950/25 text-amber-900 dark:text-amber-100/95 text-xs leading-relaxed space-y-2">
                <p className="font-medium text-amber-950 dark:text-amber-50">{isZh ? "未配置 Supabase 公钥，无法使用邮箱登录" : "Supabase environment not configured, cannot login"}</p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  <strong className="text-zinc-900 dark:text-zinc-300">本地：</strong>在{" "}
                  <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-black/40 text-amber-700 dark:text-amber-200/90">AgenticX-Website/.env.local</code>{" "}
                  写入{" "}
                  <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-black/40">NEXT_PUBLIC_SUPABASE_URL</code> 与{" "}
                  <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-black/40">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                  （与 Supabase 控制台 Project Settings → API 一致），保存后<strong className="text-zinc-900 dark:text-zinc-300">重启</strong>{" "}
                  <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-black/40">pnpm dev</code>。
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                  <strong className="text-zinc-900 dark:text-zinc-300">线上：</strong>在 Vercel → Environment Variables 配置上述两项并
                  <strong className="text-zinc-900 dark:text-zinc-300"> Redeploy</strong>；仅改变量不部署不会生效。
                </p>
              </div>
            )}

            <Button
              type="button"
              className="w-full h-12 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 font-medium rounded-sm transition-colors uppercase tracking-widest text-xs"
              onClick={onWechatMock}
              disabled={busy}
            >
              WeChat Login (Coming Soon)
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="flex-shrink-0 mx-4 text-zinc-400 dark:text-zinc-600 text-[10px] font-mono uppercase tracking-[0.2em]">
                or use email
              </span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900/50 rounded-sm p-1">
                <TabsTrigger value="signin" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white text-zinc-500 dark:text-zinc-400 transition-all font-mono text-xs uppercase tracking-wider">{isZh ? "登 录" : "Sign In"}</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white text-zinc-500 dark:text-zinc-400 transition-all font-mono text-xs uppercase tracking-wider">{isZh ? "注 册" : "Sign Up"}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4 pt-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{isZh ? "邮箱" : "Email"}</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@agenticx.com"
                    className="h-11 bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 rounded-sm focus-visible:ring-1 focus-visible:ring-zinc-500 dark:focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{isZh ? "密码" : "Password"}</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-sm focus-visible:ring-1 focus-visible:ring-zinc-500 dark:focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm transition-colors"
                  />
                </div>
                <Button 
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-sm font-mono text-[11px] uppercase tracking-widest mt-2 transition-colors border border-transparent dark:border-zinc-700" 
                  disabled={busy || !supabaseReady} 
                  onClick={() => void onEmailSignIn()}
                >
                  {busy ? (isZh ? "处理中..." : "PROCESSING...") : (isZh ? "授 权 登 录" : "AUTHORIZE")}
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 pt-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="username-signup" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    {isZh ? "用户名" : "Username"}
                  </Label>
                  <Input
                    id="username-signup"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_name"
                    maxLength={64}
                    className="h-11 bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 rounded-sm focus-visible:ring-1 focus-visible:ring-zinc-500 dark:focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{isZh ? "邮箱" : "Email"}</Label>
                  <Input
                    id="email2"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@agenticx.com"
                    className="h-11 bg-white dark:bg-zinc-900/50 border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-700 rounded-sm focus-visible:ring-1 focus-visible:ring-zinc-500 dark:focus-visible:ring-white focus-visible:ring-offset-0 font-mono text-sm transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password2" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">{isZh ? "密码" : "Password"}</Label>
                  <Input
                    id="password2"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={signupPasswordMismatch}
                    className={cn(
                      "h-11 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white rounded-sm focus-visible:ring-offset-0 font-mono text-sm transition-colors",
                      signupPasswordMismatch
                        ? "border-red-500/90 focus-visible:ring-1 focus-visible:ring-red-400"
                        : "border-zinc-300 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 dark:focus-visible:ring-white"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-confirm" className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                    {isZh ? "确认密码" : "Confirm Password"}
                  </Label>
                  <Input
                    id="password-confirm"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    aria-invalid={signupPasswordMismatch}
                    className={cn(
                      "h-11 bg-white dark:bg-zinc-900/50 text-zinc-900 dark:text-white rounded-sm focus-visible:ring-offset-0 font-mono text-sm transition-colors",
                      signupPasswordMismatch
                        ? "border-red-500/90 focus-visible:ring-1 focus-visible:ring-red-400"
                        : "border-zinc-300 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-500 dark:focus-visible:ring-white"
                    )}
                  />
                  {signupPasswordMismatch ? (
                    <p className="text-[11px] font-mono text-red-500 dark:text-red-400 leading-snug" role="alert">
                      {isZh ? "两次输入的密码不一致，请检查" : "Passwords do not match, please check"}
                    </p>
                  ) : null}
                </div>
                <Button 
                  className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-sm font-mono text-[11px] uppercase tracking-widest mt-2 transition-colors border border-transparent dark:border-zinc-700" 
                  disabled={busy || !supabaseReady || signupPasswordMismatch} 
                  onClick={() => void onEmailSignUp()}
                >
                  {busy ? (isZh ? "处理中..." : "PROCESSING...") : (isZh ? "初 始 化 账 号" : "INITIALIZE ACCOUNT")}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          
          {desktop && deviceId && (
             <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/50">
               <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                 [DEVICE_BINDING_ACTIVE]<br/>
                 ID: {deviceId.split('-')[0]}***<br/>
                 {isZh ? "登录状态将自动同步至 Machi 桌面版。" : "Authentication will automatically sync to Machi Desktop."}
               </p>
             </div>
          )}

          <p className="text-center text-[10px] text-zinc-500 dark:text-zinc-600 font-mono mt-8 uppercase tracking-wide">
            {isZh ? "继续操作即表示您同意我们的 " : "By proceeding, you agree to our "}
            <Link href="/terms" className="text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 transition-colors">
              {isZh ? "服务条款" : "Terms"}
            </Link>
            {isZh ? " 和 " : " and "}
            <Link href="/privacy" className="text-zinc-700 dark:text-zinc-400 hover:text-black dark:hover:text-white underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 transition-colors">
              {isZh ? "隐私政策" : "Privacy"}
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <AgentsLocaleProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] text-zinc-500 dark:text-zinc-400 text-sm">
            加载中…
          </div>
        }
      >
        <AuthContent />
      </Suspense>
    </AgentsLocaleProvider>
  );
}
