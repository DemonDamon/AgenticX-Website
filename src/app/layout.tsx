import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://agenticx.dev'),
  title: {
    default: 'AgenticX | Unified Multi-Agent Framework',
    template: '%s | AgenticX',
  },
  description:
    'A unified, scalable, production-ready multi-agent application development framework. Build everything from simple automation assistants to complex collaborative intelligent agent systems.',
  keywords: [
    'AgenticX',
    'Multi-Agent',
    'AI Framework',
    'Agent Framework',
    'LLM',
    'Automation',
    'Python',
    'OpenAI',
    'Agent Orchestration',
    'Agent Communication',
  ],
  authors: [{ name: 'AgenticX Team', url: 'https://github.com/DemonDamon/AgenticX' }],
  generator: 'AgenticX',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'AgenticX | Unified Multi-Agent Framework',
    description:
      'A unified, scalable, production-ready multi-agent application development framework. Build everything from simple automation assistants to complex collaborative intelligent agent systems.',
    url: 'https://agenticx.dev',
    siteName: 'AgenticX',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'AgenticX - Unified Multi-Agent Framework',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgenticX | Unified Multi-Agent Framework',
    description:
      'Build everything from simple automation assistants to complex collaborative intelligent agent systems.',
    images: ['/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="en" className="dark">
      <body className={`antialiased bg-black text-white`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
