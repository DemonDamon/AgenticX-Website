import { EnterpriseDocSidebar } from '@/components/enterprise-docs/sidebar';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';

export default function EnterpriseDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <EnterpriseDocSidebar />
      <main className="ml-64 min-h-screen">
        <SecurityAdvisoryBanner align="docs" />
        <div className="mx-auto max-w-4xl px-8 py-16">{children}</div>
      </main>
    </div>
  );
}
