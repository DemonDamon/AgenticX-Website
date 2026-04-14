import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "服务条款",
  description: "AgenticX / Machi 服务条款",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12 max-w-3xl mx-auto">
      <p className="text-sm text-zinc-500 mb-6">
        <Link href="/auth" className="underline underline-offset-2">
          ← 返回登录
        </Link>
      </p>
      <h1 className="text-2xl font-bold mb-4">服务条款（摘要）</h1>
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>
          完整版法律文本请以仓库内{" "}
          <code className="text-zinc-400">docs/legal/eula.md</code>（AgenticX 主仓库）为准；线上版将随产品迭代更新。
        </p>
        <p>
          使用本网站与 Machi 相关产品即表示你理解：软件按「现状」提供；AI 输出可能存在错误；涉及本地文件与系统操作时请自行承担数据与安全风险。
        </p>
        <p>禁止将本服务用于违法、侵权或破坏他人系统安全的行为。</p>
      </div>
    </div>
  );
}
