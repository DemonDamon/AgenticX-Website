"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  ChevronUp,
  Clock,
  Info,
  Languages,
  LayoutPanelLeft,
  MessageSquare,
  MessageSquarePlus,
  Microscope,
  LogOut,
  Settings,
  Sun,
} from "lucide-react";

import { ChatWorkspace } from "@/components/agents/ChatWorkspace";
import { FeedbackDialog } from "@/components/agents/FeedbackDialog";
import { SettingsPanel } from "@/components/agents/settings/SettingsPanel";
import { MachiAvatar } from "@/components/branding/MachiAvatar";
import { AgentsLocaleProvider, useAgentsLocale } from "@/contexts/agents-locale-context";
import { useAgentsUiTheme } from "@/hooks/use-agents-ui-theme";
import { agxMarketingUrls } from "@/lib/agx-marketing-urls";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

/** 侧栏展示名：优先注册时写入的 username / display_name（user_metadata） */
function pickProfileDisplayName(user: User): string {
  const m = user.user_metadata as Record<string, unknown> | null | undefined;
  if (!m) return "";
  const keys = ["username", "display_name", "full_name", "name", "preferred_username"] as const;
  for (const k of keys) {
    const v = m[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

/** Sonner 在 React 19 首屏可能与父树时序冲突；挂载后再渲染 Toaster，避免 “state update before mount”。 */
function AgentsToaster() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <Toaster position="top-center" theme="dark" closeButton={false} offset={16} />;
}

type SessionItem = { id: string; title: string };
const NAV_AUTO_COLLAPSE_BREAKPOINT = 1180;

function AgentsHomePageInner() {
  const router = useRouter();
  const { t, locale, setLocale } = useAgentsLocale();
  const { theme: uiTheme, setTheme: setUiTheme } = useAgentsUiTheme();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  /** Supabase user_metadata 中的展示名（与邮箱独立） */
  const [profileName, setProfileName] = useState("");
  const [workspace, setWorkspace] = useState<"chat" | "settings">("chat");
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deepResearch, setDeepResearch] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const autoCollapseStateRef = useRef<boolean | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileDialog, setProfileDialog] = useState<null | "feedback" | "upgrade">(null);

  const marketingUrls = agxMarketingUrls();

  const displayName =
    profileName.trim() ||
    (email
      ? email.includes("@")
        ? email.split("@")[0] || email
        : email
      : t.userFallback);

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
        if (!cancelled) {
          setEmail(u.email ?? u.phone ?? "");
          setProfileName(pickProfileDisplayName(u));
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

  /** 登录态或 user_metadata 变更时同步侧栏名称 */
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) return;
      const u = session.user;
      setEmail(u.email ?? u.phone ?? "");
      setProfileName(pickProfileDisplayName(u));
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const applyAutoCollapse = () => {
      const shouldCollapse = window.innerWidth < NAV_AUTO_COLLAPSE_BREAKPOINT;
      if (autoCollapseStateRef.current === shouldCollapse) return;
      autoCollapseStateRef.current = shouldCollapse;
      setNavCollapsed(shouldCollapse);
    };

    applyAutoCollapse();
    window.addEventListener("resize", applyAutoCollapse);
    return () => window.removeEventListener("resize", applyAutoCollapse);
  }, []);

  const onNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    setSessions((s) => [{ id, title: t.newSessionTitle }, ...s]);
    setActiveId(id);
    setWorkspace("chat");
  }, [t.newSessionTitle]);

  const onSignOut = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/auth");
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] text-zinc-500 text-sm">
        {t.checkingAuth}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50 text-zinc-900 dark:bg-[#0a0a0a] dark:text-zinc-100 overflow-hidden">
      <aside
        className={cn(
          "w-full md:w-[260px] shrink-0 border-b md:border-b-0 md:border-r border-zinc-200/60 dark:border-zinc-800/50 flex flex-col bg-gray-100 dark:bg-[#141414] min-h-0 transition-[width,opacity] duration-200",
          navCollapsed && "hidden"
        )}
      >
        <div className="p-3 flex items-center justify-between gap-2 border-b border-zinc-200/70 dark:border-zinc-800/60">
          <div className="flex items-center min-w-0">
            <Image
              src="/app-icon.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-lg object-cover"
              priority
            />
          </div>
          <Tooltip delayDuration={280}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setNavCollapsed(true)}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  "bg-gray-200 border-zinc-300/85 text-zinc-500 dark:bg-[#121212] dark:border-zinc-800/85 dark:text-zinc-400",
                  "hover:bg-gray-300 hover:border-zinc-400 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                )}
                aria-label={t.collapseNav}
              >
                <LayoutPanelLeft className="size-4 stroke-[1.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              hideArrow
              side="right"
              sideOffset={8}
              className="border border-zinc-600/70 bg-zinc-700 px-3 py-2 text-sm text-zinc-50 shadow-lg"
            >
              {t.collapseNav}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="p-2">
          <button
            type="button"
            onClick={onNewChat}
            className="w-full flex items-center justify-between gap-2 rounded-xl border border-zinc-300/80 bg-white/70 hover:bg-white dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80 px-3 py-2.5 text-sm text-zinc-800 dark:text-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <MessageSquarePlus className="size-4" />
              {t.newChat}
            </span>
            <kbd className="hidden sm:inline text-[10px] text-zinc-500 dark:text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="px-2 pb-1">
          <button
            type="button"
            onClick={() => setDeepResearch((v) => !v)}
            className={cn(
              "w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
              deepResearch
                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700/70 dark:text-zinc-100"
                : "text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
            )}
          >
            <Microscope className="size-4 shrink-0" />
            {t.deepResearch}
          </button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-2 pb-2">
          <div className="flex items-center gap-1.5 px-2 py-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Clock className="size-3.5" />
            {t.historySessions}
          </div>
          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
            {sessions.length === 0 ? (
              <p className="px-2 py-3 text-xs text-zinc-400 dark:text-zinc-600">{t.noHistory}</p>
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
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-500 hover:bg-zinc-200/80 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                  )}
                >
                  {s.title}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="p-2 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
            <div
              className={cn(
                "flex items-center gap-1 rounded-2xl border px-1.5 py-1 transition-colors",
                userMenuOpen
                  ? "border-zinc-300/70 bg-zinc-100 dark:border-zinc-600/70 dark:bg-zinc-800/70"
                  : "border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-[#1a1a1a] hover:border-zinc-300/80 hover:bg-gray-50 dark:hover:border-zinc-700/80 dark:hover:bg-zinc-800/50"
              )}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-xl py-1 pl-0.5 pr-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-[#141414]"
                >
                  <div className="size-8 shrink-0">
                    <MachiAvatar size={32} className="h-8 w-8" />
                  </div>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {displayName}
                  </span>
                  <ChevronUp
                    className={cn(
                      "size-4 shrink-0 text-zinc-500 transition-transform duration-200",
                      userMenuOpen ? "rotate-0" : "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={8}
              className="min-w-[228px] w-[min(244px,calc(100vw-2rem))] border-zinc-200/80 bg-white p-1.5 text-zinc-900 shadow-xl dark:border-zinc-700/80 dark:bg-[#1c1c1c] dark:text-zinc-100"
            >
              <DropdownMenuItem
                className="gap-2.5 rounded-lg py-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                onSelect={() => setWorkspace("settings")}
              >
                <Settings className="size-4 text-zinc-400" />
                {t.menuSettings}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5 rounded-lg py-2 text-sm text-zinc-700 focus:bg-gray-100 data-[state=open]:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800 dark:focus:text-zinc-50 [&_svg:last-child]:text-zinc-400 dark:[&_svg:last-child]:text-zinc-500">
                  <Sun className="size-4 text-zinc-400" />
                  {t.menuInterfaceTheme}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  sideOffset={6}
                  className="min-w-[160px] border-zinc-200/80 bg-white p-1.5 text-zinc-900 shadow-xl dark:border-zinc-700/80 dark:bg-[#1c1c1c] dark:text-zinc-100"
                >
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between gap-6 rounded-lg py-2 pr-2 pl-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    onSelect={() => setUiTheme("system")}
                  >
                    <span>{t.settingsGeneralThemeSystem}</span>
                    {uiTheme === "system" && <Check className="size-4 shrink-0 text-sky-500" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between gap-6 rounded-lg py-2 pr-2 pl-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    onSelect={() => setUiTheme("dark")}
                  >
                    <span>{t.settingsGeneralThemeDark}</span>
                    {uiTheme === "dark" && <Check className="size-4 shrink-0 text-sky-500" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between gap-6 rounded-lg py-2 pr-2 pl-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    onSelect={() => setUiTheme("light")}
                  >
                    <span>{t.settingsGeneralThemeLight}</span>
                    {uiTheme === "light" && <Check className="size-4 shrink-0 text-sky-500" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5 rounded-lg py-2 text-sm text-zinc-700 focus:bg-gray-100 data-[state=open]:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800 dark:focus:text-zinc-50 [&_svg:last-child]:text-zinc-400 dark:[&_svg:last-child]:text-zinc-500">
                  <Languages className="size-4 text-zinc-400" />
                  {t.menuLanguage}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  sideOffset={6}
                  className="min-w-[160px] border-zinc-200/80 bg-white p-1.5 text-zinc-900 shadow-xl dark:border-zinc-700/80 dark:bg-[#1c1c1c] dark:text-zinc-100"
                >
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between gap-6 rounded-lg py-2 pr-2 pl-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    onSelect={() => setLocale("zh")}
                  >
                    <span>{t.langZh}</span>
                    {locale === "zh" && <Check className="size-4 shrink-0 text-sky-500" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center justify-between gap-6 rounded-lg py-2 pr-2 pl-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    onSelect={() => setLocale("en")}
                  >
                    <span>{t.langEn}</span>
                    {locale === "en" && <Check className="size-4 shrink-0 text-sky-500" strokeWidth={2.5} />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="gap-2.5 rounded-lg py-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                onSelect={() => setProfileDialog("feedback")}
              >
                <MessageSquare className="size-4 text-zinc-400" />
                {t.menuFeedback}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="gap-2.5 rounded-lg py-2 text-sm text-zinc-700 focus:bg-gray-100 data-[state=open]:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800 dark:focus:text-zinc-50 [&_svg:last-child]:text-zinc-400 dark:[&_svg:last-child]:text-zinc-500">
                  <Info className="size-4 text-zinc-400" />
                  {t.menuAbout}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent
                  sideOffset={6}
                  className="min-w-[200px] border-zinc-200/80 bg-white p-1.5 text-zinc-900 shadow-xl dark:border-zinc-700/80 dark:bg-[#1c1c1c] dark:text-zinc-100"
                >
                  <DropdownMenuItem asChild className="rounded-lg p-0 focus:bg-transparent">
                    <a
                      href={marketingUrls.home}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    >
                      {t.aboutOfficialHome}
                      <ArrowUpRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg p-0 focus:bg-transparent">
                    <a
                      href={marketingUrls.terms}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    >
                      {t.aboutUserAgreement}
                      <ArrowUpRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg p-0 focus:bg-transparent">
                    <a
                      href={marketingUrls.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 outline-none hover:bg-gray-100 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                    >
                      {t.aboutPrivacyPolicy}
                      <ArrowUpRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="gap-2.5 rounded-lg py-2 text-sm text-zinc-700 focus:bg-gray-100 focus:text-zinc-900 dark:text-zinc-200 dark:focus:bg-zinc-800 dark:focus:text-zinc-50"
                onSelect={() => void onSignOut()}
              >
                <LogOut className="size-4 text-zinc-400" />
                {t.menuSignOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="relative flex-1 flex flex-col min-w-0 min-h-0 bg-gray-50 dark:bg-[#0a0a0a]">
        {navCollapsed && (
          <Tooltip delayDuration={280}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setNavCollapsed(false)}
                className={cn(
                  "absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shadow-md",
                  "bg-zinc-500/25 border-zinc-300/55 text-zinc-100",
                  "hover:bg-zinc-500/35 hover:border-zinc-200/70 hover:text-white"
                )}
                aria-label={t.expandNav}
              >
                <LayoutPanelLeft className="size-4 stroke-[1.5]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              hideArrow
              side="right"
              sideOffset={8}
              className="border border-zinc-600/70 bg-zinc-700 px-3 py-2 text-sm text-zinc-50 shadow-lg"
            >
              {t.expandNav}
            </TooltipContent>
          </Tooltip>
        )}
        {workspace === "settings" ? (
          <>
            <header className="shrink-0 flex items-center px-4 md:px-6 h-12 border-b border-zinc-200/80 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={() => setWorkspace("chat")}
                className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                {t.backToChat}
              </button>
            </header>
            <SettingsPanel className="flex-1 overflow-hidden" />
          </>
        ) : (
          <ChatWorkspace
            deepResearch={deepResearch}
            onDeepResearchDismiss={() => setDeepResearch(false)}
            className="flex-1"
          />
        )}
      </main>

      <AgentsToaster />

      <FeedbackDialog
        open={profileDialog === "feedback"}
        onOpenChange={(open) => {
          if (!open) setProfileDialog(null);
        }}
      />

      <Dialog
        open={profileDialog === "upgrade"}
        onOpenChange={(open) => {
          if (!open) setProfileDialog(null);
        }}
      >
        <DialogContent className="border-zinc-700 bg-zinc-950 text-zinc-100 sm:max-w-md">
          {profileDialog === "upgrade" && (
            <>
              <DialogHeader>
                <DialogTitle>{t.dialogUpgradeTitle}</DialogTitle>
                <DialogDescription className="text-zinc-400">{t.dialogUpgradeBody}</DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AgentsHomePage() {
  return (
    <AgentsLocaleProvider>
      <AgentsHomePageInner />
    </AgentsLocaleProvider>
  );
}
