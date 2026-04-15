"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export const AGENTS_UI_THEME_STORAGE_KEY = "machi-agents-ui-theme";

export type AgentsUiTheme = "system" | "dark" | "light";

const listeners = new Set<() => void>();

export function readAgentsUiTheme(): AgentsUiTheme {
  if (typeof window === "undefined") return "light";
  try {
    const v = window.localStorage.getItem(AGENTS_UI_THEME_STORAGE_KEY);
    if (v === "dark" || v === "light" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "light";
}

function effectiveIsDark(theme: AgentsUiTheme): boolean {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyAgentsUiTheme(theme: AgentsUiTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (effectiveIsDark(theme)) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function setAgentsUiTheme(next: AgentsUiTheme): void {
  try {
    window.localStorage.setItem(AGENTS_UI_THEME_STORAGE_KEY, next);
  } catch {
    /* ignore quota */
  }
  applyAgentsUiTheme(next);
  listeners.forEach((fn) => fn());
}

export function subscribeAgentsUiTheme(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useAgentsUiTheme(): {
  theme: AgentsUiTheme;
  setTheme: (next: AgentsUiTheme) => void;
} {
  const [theme, setThemeState] = useState<AgentsUiTheme>("light");

  useLayoutEffect(() => {
    const t = readAgentsUiTheme();
    setThemeState(t);
    applyAgentsUiTheme(t);
  }, []);

  useEffect(() => {
    const sync = () => setThemeState(readAgentsUiTheme());
    return subscribeAgentsUiTheme(sync);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyAgentsUiTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((next: AgentsUiTheme) => {
    setThemeState(next);
    setAgentsUiTheme(next);
  }, []);

  return { theme, setTheme };
}
