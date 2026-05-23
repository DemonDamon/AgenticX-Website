import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, LOCALE_COOKIE, type Locale } from '@/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

function prefersEnglish(request: NextRequest): boolean {
  const accept = request.headers.get('accept-language') ?? '';
  const first = accept.split(',')[0]?.trim().toLowerCase() ?? '';
  return first.startsWith('en');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, 'en', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  if (pathname === '/' && !cookieLocale && prefersEnglish(request)) {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  const url = request.nextUrl.clone();
  url.pathname = `/zh${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set(LOCALE_COOKIE, defaultLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
