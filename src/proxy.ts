import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Mobile detection
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)

  // Redirect old PAWON routes to Anterbae equivalents
  const redirectMap: Record<string, string> = {
    '/vendors': '/mitra',
    '/vendor': '/mitra',
    '/vendor/': '/mitra',
    '/services': '/',
    '/service': '/',
    '/inkubator': '/register-courier',
    '/lapak': '/mitra',
    '/order': '/track',
  }

  // Check for exact redirects
  for (const [from, to] of Object.entries(redirectMap)) {
    if (pathname === from || pathname.startsWith(from + '/')) {
      return NextResponse.redirect(new URL(to, request.url))
    }
  }

  const response = NextResponse.next()

  // Add mobile header
  if (isMobile) {
    response.headers.set('x-is-mobile', 'true')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|hero.jpg|manifest.json|sw.js|studio).*)',
  ],
}
