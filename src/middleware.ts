import { NextRequest, NextResponse } from 'next/server';

const middleware = (request: NextRequest) => {
  const { pathname } = request?.nextUrl || {};

  if (pathname !== `/gameplay`) {
    return NextResponse.redirect(new URL(`/gameplay`, request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    `/((?!api|_next/static|_next/image).*)`,
  ],
};

export default middleware;
