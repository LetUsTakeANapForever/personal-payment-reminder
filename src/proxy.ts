import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const protectedRoutes = ['/discord-server-integration', '/dashboard']
const publicRoutes = ['/auth', '/']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some(route =>
    path.startsWith(route)
  )

  const isPublicRoute = publicRoutes.some(route =>
    path.startsWith(route)
  )

  const session = await auth.api.getSession({ headers: req.headers })

  if (isProtectedRoute && !session?.user) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  if (isPublicRoute && session?.user && path === '/auth') {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}