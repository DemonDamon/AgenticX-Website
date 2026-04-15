import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "用户协议 — Machi",
  description: "Machi 用户服务协议",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 px-6 py-12">
      <article className="mx-auto max-w-3xl">
        <p className="text-sm text-zinc-500 mb-8">
          <Link href="/auth" className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            ← 返回登录
          </Link>
        </p>

        <h1 className="text-3xl font-bold mb-2">Machi 用户服务协议</h1>
        <p className="text-sm text-zinc-500 mb-10">生效日期：2025 年 4 月 15 日 ｜ 最后更新：2025 年 4 月 15 日</p>

        <div className="space-y-8 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">一、协议主体与适用范围</h2>
            <p>Machi 是基于开源框架 AgenticX 构建的多智能体 AI 助手产品（以下简称「本产品」或「Machi」），由独立开发者 Damon Li（以下简称「我们」）开发和运营。</p>
            <p className="mt-2">本协议适用于您通过网页端（agxbuilder.com）、桌面客户端或其他官方渠道使用 Machi 的全部场景。使用本产品即表示您已阅读、理解并同意接受本协议的全部条款。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">二、服务说明</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Machi 以大语言模型为基础，向用户提供对话、深度研究、多智能体协作等 AI 服务。用户的输入经模型推理后生成相应的输出内容。</li>
              <li>本产品主要面向具备完全民事行为能力的成年人。未成年人应在监护人同意和指导下使用。</li>
              <li><strong className="text-zinc-900 dark:text-zinc-100">风险提示：</strong>AI 输出基于概率生成，可能存在不准确、不完整或过时的情况。输出内容不构成医疗、法律、金融等专业建议，请您自行判断其准确性和适用性。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">三、账号与使用规范</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>您可以通过邮箱注册 Machi 账号。您应确保注册信息真实、准确，并妥善保管账号及密码。</li>
              <li>您对账号下的所有行为承担法律责任，不得将账号转让、出借或提供给他人使用。</li>
              <li>您有权随时注销账号。账号注销后，相关数据将按照隐私政策处理。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">四、用户行为准则</h2>
            <p>您在使用本产品时，应当遵守适用的法律法规，不得将 Machi 用于以下用途：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>制作、传播违法信息或有害内容；</li>
              <li>侵犯他人知识产权、隐私权或其他合法权益；</li>
              <li>对本服务进行反向工程、反编译或尝试提取模型参数；</li>
              <li>通过自动化脚本、爬虫等方式批量、高频调用服务；</li>
              <li>任何可能危害网络安全或干扰服务正常运行的行为。</li>
            </ul>
            <p className="mt-2">如您违反上述规定，我们有权视情况采取警告、限制功能、暂停或终止服务等措施。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">五、知识产权</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Machi 的软件、技术、界面设计、商标等知识产权归开发者所有。AgenticX 框架部分遵循其开源许可证。</li>
              <li>在不侵犯他人权利的前提下，您对自己的输入内容享有权利并承担相应责任。由于 AI 生成的概率性特征，不同用户的输出可能存在相似或重复。</li>
              <li>为持续优化服务，您同意我们在经过匿名化、去标识化处理后，将输入输出内容用于模型改进。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">六、免责声明</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong className="text-zinc-900 dark:text-zinc-100">本产品按「现状」（AS IS）提供，不作任何明示或暗示的保证。</strong></li>
              <li>AI 输出可能存在错误、偏差或遗漏，我们不保证输出的准确性、完整性、时效性或适用于特定目的。</li>
              <li>因不可抗力、第三方服务故障、网络中断等非我们可控的原因导致的服务中断或数据损失，我们不承担责任。</li>
              <li>Machi 可能调用第三方大模型服务（如 OpenAI、DeepSeek 等），相关内容的处理同时受第三方服务条款约束。</li>
              <li>涉及本地文件读写或系统操作时，请您自行评估风险并做好数据备份。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">七、服务变更与终止</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>我们保留根据业务需要修改、暂停或终止部分或全部服务的权利。重大变更将通过产品内通知或网站公告的方式告知。</li>
              <li>您可以随时停止使用本产品。</li>
              <li>本协议可能不定期更新。继续使用本产品即视为您同意更新后的协议内容。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">八、法律适用与争议解决</h2>
            <p>本协议的订立、生效、解释及争议解决均适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任一方可向开发者所在地有管辖权的人民法院提起诉讼。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">九、联系方式</h2>
            <p>如您对本协议有任何疑问、建议或投诉，请通过以下方式联系我们：</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>邮箱：<a href="mailto:bingzhenli@hotmail.com" className="text-sky-600 dark:text-sky-400 underline underline-offset-2">bingzhenli@hotmail.com</a></li>
              <li>产品内置反馈功能</li>
              <li>GitHub：<a href="https://github.com/DemonDamon/AgenticX" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 underline underline-offset-2">DemonDamon/AgenticX</a></li>
            </ul>
          </section>

        </div>
      </article>
    </div>
  );
}
