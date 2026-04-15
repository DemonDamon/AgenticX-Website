"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AGENTS_LOCALE_STORAGE_KEY,
  agentsLocaleCopy,
  readAgentsLocale,
  type AgentsCopy,
  type AgentsLocale,
} from "@/lib/agents-locale-copy";

type AgentsLocaleContextValue = {
  locale: AgentsLocale;
  setLocale: (next: AgentsLocale) => void;
  t: AgentsCopy;
};

const AgentsLocaleContext = createContext<AgentsLocaleContextValue | null>(null);

export function AgentsLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AgentsLocale>("zh");

  useLayoutEffect(() => {
    const next = readAgentsLocale();
    setLocaleState(next);
    document.documentElement.lang = next === "en" ? "en" : "zh-CN";
  }, []);

  const setLocale = useCallback((next: AgentsLocale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(AGENTS_LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore quota */
    }
    document.documentElement.lang = next === "en" ? "en" : "zh-CN";
  }, []);

  const t = agentsLocaleCopy[locale];

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <AgentsLocaleContext.Provider value={value}>
      {children}
    </AgentsLocaleContext.Provider>
  );
}

export function useAgentsLocale(): AgentsLocaleContextValue {
  const ctx = useContext(AgentsLocaleContext);
  if (!ctx) {
    throw new Error("useAgentsLocale must be used within AgentsLocaleProvider");
  }
  return ctx;
}
