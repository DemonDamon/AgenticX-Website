import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inspector } from 'react-dev-inspector';
import { LocaleProvider } from '@/i18n/locale-context';
import { htmlLang, isLocale, locales, openGraphLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }
  const locale = rawLocale as Locale;
  const t = await getDictionary(locale);

  return {
    metadataBase: new URL('https://agenticx.dev'),
    title: {
      default: t.site.metadata.titleDefault,
      template: t.site.metadata.titleTemplate,
    },
    description: t.site.metadata.description,
    openGraph: {
      locale: openGraphLocale(locale),
    },
    alternates: {
      languages: {
        'zh-CN': locale === 'zh' ? '/' : '/',
        en: '/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const dictionary = await getDictionary(locale);
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang={htmlLang(locale)} className="dark">
      <body className="antialiased bg-black text-white">
        {isDev && <Inspector />}
        <LocaleProvider locale={locale} dictionary={dictionary}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
