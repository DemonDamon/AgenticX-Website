import { notFound } from 'next/navigation';
import { HomePageContent } from '@/components/home-page-content';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const t = await getDictionary(rawLocale as Locale);
  return {
    title: t.home.metadata.title,
    description: t.home.metadata.description,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  return <HomePageContent />;
}
