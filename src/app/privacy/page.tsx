import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策 — Machi",
  description: "Machi 隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 px-6 py-12">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-zinc-500 mb-8">
          <Link href="/auth" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            ← 返回登录
          </Link>
        </p>

        <h1 className="text-3xl font-bold mb-2">Machi 隐私政策</h1>
        <p className="text-sm text-zinc-500 mb-10">生效日期：2025 年 4 月 15 日 ｜ 最后更新：2025 年 4 月 15 日</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">一、引言</h2>
            <p>Machi 是基于开源框架 AgenticX 构建的多智能体 AI 助手产品，由独立开发者 Damon Li（以下简称「我们」）开发和运营。我们深知个人信息对您的重要性，并将严格遵守适用的法律法规保护您的隐私。</p>
            <p className="mt-2">本隐私政策说明我们在您使用 Machi（包括网页端、桌面客户端及其他官方渠道）时如何收集、使用、存储和保护您的个人信息。使用本产品即表示您已阅读并理解本政策。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">二、我们收集的信息</h2>
            <p>我们遵循最小必要原则，仅收集为提供服务所需的信息：</p>

            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-2">2.1 您主动提供的信息</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>账号信息：</strong>注册时提供的邮箱地址，用于创建和管理您的账号。</li>
              <li><strong>对话内容：</strong>您在使用 Machi 时输入的文字、上传的文件等内容，用于生成 AI 响应。</li>
              <li><strong>反馈信息：</strong>您通过反馈功能提交的文字和截图。</li>
            </ul>

            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-2">2.2 自动收集的信息</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>设备与浏览器信息：</strong>操作系统类型、浏览器类型、屏幕分辨率等基本信息，用于保障服务兼容性。</li>
              <li><strong>日志信息：</strong>访问时间、IP 地址等，用于安全防护和问题排查。</li>
              <li><strong>Cookie 和本地存储：</strong>用于维持登录态、记忆您的偏好设置（如语言、主题）。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">三、信息的使用方式</h2>
            <p>我们收集的信息仅用于以下目的：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>提供、维护和改进 Machi 的核心功能；</li>
              <li>处理您的请求和反馈；</li>
              <li>保障服务安全，防范异常访问和滥用行为；</li>
              <li>在经过匿名化、去标识化处理后，用于服务优化和模型改进；</li>
              <li>履行法律法规规定的义务。</li>
            </ul>
            <p className="mt-2"><strong className="text-zinc-900 dark:text-zinc-100">我们不会将您的个人信息出售给任何第三方。</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">四、数据存储与安全</h2>

            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-2">4.1 本地优先</h3>
            <p>Machi 桌面端的对话数据和工作区配置默认存储在您的本地设备上，不会自动上传至云端。</p>

            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-2">4.2 云端数据</h3>
            <p>网页端的账号认证通过 Supabase Auth 服务处理。为完成桌面端绑定，我们可能在短时间内暂存与您的设备 ID 关联的会话令牌，并在桌面端成功拉取后删除该记录。</p>

            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mt-4 mb-2">4.3 安全措施</h3>
            <p>我们采用传输加密（HTTPS）、访问控制等业界通行的技术手段保护您的数据。但由于互联网的开放性，任何安全措施均无法做到绝对安全，请您妥善保管账号信息。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">五、第三方服务</h2>
            <p>使用 Machi 的过程中，您的对话内容可能被发送至您所选择的第三方大模型服务商（如 OpenAI、Anthropic、DeepSeek、MiniMax 等）进行推理处理。这些内容的处理同时受该第三方服务商的隐私政策约束，建议您在使用前了解相关条款。</p>
            <p className="mt-2">我们不对第三方服务的数据处理行为承担责任。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">六、您的权利</h2>
            <p>根据适用的法律法规，您享有以下权利：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>查阅与更正：</strong>您可以在产品设置中查看和修改您的账号信息。</li>
              <li><strong>删除：</strong>您可以删除历史对话记录。注销账号后，我们将在合理期限内删除或匿名化处理您的个人信息（法律法规另有规定的除外）。</li>
              <li><strong>撤回同意：</strong>您可以随时停止使用本产品或注销账号以撤回对本政策的同意。</li>
              <li><strong>数据导出：</strong>您可以通过设置中的导出功能获取您的数据副本。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">七、未成年人保护</h2>
            <p>本产品主要面向成年人。如果您是未满 18 周岁的未成年人，请在监护人的同意和指导下使用本产品。如果我们发现在未经监护人同意的情况下收集了未成年人的个人信息，将尽快予以删除。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">八、Cookie 的使用</h2>
            <p>我们使用 Cookie 和本地存储（localStorage）来：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>维持您的登录状态；</li>
              <li>记忆您的语言、界面主题等偏好设置；</li>
              <li>保障服务安全。</li>
            </ul>
            <p className="mt-2">您可以通过浏览器设置管理或禁用 Cookie，但这可能影响部分功能的正常使用。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">九、政策更新</h2>
            <p>我们可能根据产品发展和法律要求不定期更新本隐私政策。重大变更将通过产品内通知或网站公告的方式告知。继续使用本产品即视为您同意更新后的政策内容。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">十、联系我们</h2>
            <p>如您对本隐私政策有任何疑问、建议或投诉，或希望行使您的个人信息权利，请通过以下方式联系我们：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>邮箱：<a href="mailto:bingzhenli@hotmail.com" className="text-sky-600 dark:text-sky-400 underline underline-offset-2">bingzhenli@hotmail.com</a></li>
              <li>产品内置反馈功能</li>
              <li>GitHub：<a href="https://github.com/DemonDamon/AgenticX" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 underline underline-offset-2">DemonDamon/AgenticX</a></li>
            </ul>
            <p className="mt-3">我们将在收到您的请求后 15 个工作日内予以回复。</p>
          </section>

        </div>
      </article>
    </div>
  );
}
