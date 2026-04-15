/** 官网营销站根地址（与 NEXT_PUBLIC_SITE_URL 一致，默认 agxbuilder） */
export function getAgxMarketingOrigin(): string {
  const raw =
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL.trim()
      : "https://www.agxbuilder.com";
  return raw.replace(/\/$/, "");
}

export function agxMarketingUrls() {
  const origin = getAgxMarketingOrigin();
  return {
    home: `${origin}/`,
    terms: `${origin}/terms`,
    privacy: `${origin}/privacy`,
  } as const;
}
