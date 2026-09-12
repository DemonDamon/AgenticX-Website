import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { NearPageContent } from '@/components/near-page-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const t = await getDictionary(rawLocale as Locale);
  return {
    title: t.nearPage.metadata.title,
    description: t.nearPage.metadata.description,
  };
}

export default async function NearPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <NearPageContent />;
}
