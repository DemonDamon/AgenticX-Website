import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策",
  description: "AgenticX / Machi 隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-12 max-w-3xl mx-auto">
      <p className="text-sm text-zinc-500 mb-6">
        <Link href="/auth" className="underline underline-offset-2">
          ← 返回登录
        </Link>
      </p>
      <h1 className="text-2xl font-bold mb-4">隐私政策（摘要）</h1>
      <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
        <p>
          完整版请以仓库内 <code className="text-zinc-400">docs/legal/privacy_policy.md</code>（AgenticX 主仓库）为准。
        </p>
        <p>
          本网站登录使用 Supabase Auth；为完成 Machi 桌面端绑定，我们可能在短时间内暂存与你的设备 ID 关联的会话令牌，并在桌面端成功拉取后删除该记录。
        </p>
        <p>对话与本地工作区数据默认保留在你的设备上；调用第三方大模型时，相关内容将发往你所选择的模型服务商。</p>
      </div>
    </div>
  );
}
