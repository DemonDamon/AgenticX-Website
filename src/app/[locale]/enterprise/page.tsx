import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { EnterprisePageContent } from '@/components/enterprise-page-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const t = await getDictionary(rawLocale as Locale);
  return {
    title: t.enterprisePage.metadata.title,
    description: t.enterprisePage.metadata.description,
  };
}

export default async function EnterprisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <EnterprisePageContent />;
}
