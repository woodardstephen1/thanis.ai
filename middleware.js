// /middleware.js
import { NextResponse } from 'next/server'
import crypto from 'crypto'

function setCookie(res, name, value, maxAgeSeconds) {
  res.cookies.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds,
  })
}

// endpoints we want open for demo + telemetry testing
const PUBLIC_API_PREFIXES = [
  '/api/analyze',
  '/api/telemetry/page'
]

export function middleware(req) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl
  const env = process.env.NEXT_PUBLIC_ENV || process.env.VERCEL_ENV || 'development'

  // ---- allow unauthenticated access on staging ----
  const isPublic = PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))
  if (env === 'staging' && isPublic) {
    let sid = req.cookies.get('sid')?.value
    if (!sid) {
      sid = crypto.randomUUID()
      setCookie(res, 'sid', sid, 60 * 60 * 24 * 365)
      setCookie(res, 'sid_is_new', '1', 60 * 10)
    }

    // persist UTM cookies if present
    const sp = req.nextUrl.searchParams
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    for (const key of utmKeys) {
      const existing = req.cookies.get(key)?.value
      const incoming = sp.get(key)
      if (!existing && incoming) setCookie(res, key, incoming, 60 * 60 * 24 * 90)
    }

    if (!req.cookies.get('lp')?.value) {
      const lp = `${pathname}${req.nextUrl.search}`.slice(0, 200)
      setCookie(res, 'lp', lp, 60 * 60 * 24 * 90)
    }

    return res
  }

  // ---- fallback: normal cookie/session setup ----
  let sid = req.cookies.get('sid')?.value
  if (!sid) {
    sid = crypto.randomUUID()
    setCookie(res, 'sid', sid, 60 * 60 * 24 * 365)
    setCookie(res, 'sid_is_new', '1', 60 * 10)
  }

  const url = req.nextUrl
  const sp = url.searchParams
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  for (const key of utmKeys) {
    const existing = req.cookies.get(key)?.value
    const incoming = sp.get(key)
    if (!existing && incoming) setCookie(res, key, incoming, 60 * 60 * 24 * 90)
  }

  if (!req.cookies.get('lp')?.value) {
    const lp = `${url.pathname}${url.search}`.slice(0, 200)
    setCookie(res, 'lp', lp, 60 * 60 * 24 * 90)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp|txt)).*)',
  ],
}
