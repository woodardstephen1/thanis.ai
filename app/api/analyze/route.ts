// /app/api/telemetry/page/route.ts
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { Events, utmsFromCookieMap } from '@/lib/telemetry/events';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  const pathname = typeof body?.pathname === 'string' ? body.pathname : undefined;
  const title = typeof body?.title === 'string' ? body.title : undefined;

  const jar = cookies();
  const get = (n: string) => jar.get(n)?.value;
  const session_id = get('sid') || 'unknown';
  const user_id = get('uid') || undefined; // (optional) set your own hashed uid cookie on auth
  const utms = utmsFromCookieMap(get);
  const referrer = headers().get('referer') || body?.referrer || undefined;

  // Emit page_view
  Events.page_view({
    session_id,
    user_id,
    pathname,
    title,
    referrer,
    route: 'page',
    ...utms,
  });

  // If middleware created a new session, emit session_started once and clear the flag
  if (get('sid_is_new') === '1') {
    Events.session_started({
      session_id,
      user_id,
      route: 'page',
      ...utms,
    });
    // Clear the one-shot flag
    jar.set('sid_is_new', '', { path: '/', maxAge: 0 });
  }

  return new NextResponse(null, { status: 204 });
}
