import { DocSidebar } from '@/components/docs/sidebar';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DocSidebar />
      <main className="ml-64 min-h-screen">
        <SecurityAdvisoryBanner align="docs" />
        <div className="mx-auto max-w-4xl px-8 py-16">
          {children}
        </div>
      </main>
    </div>
  );
}
