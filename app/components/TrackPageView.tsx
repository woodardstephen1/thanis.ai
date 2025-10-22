'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function TrackPageView() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const send = async () => {
      try {
        await fetch('/api/telemetry/page', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            pathname: `${pathname || ''}${search?.toString() ? `?${search?.toString()}` : ''}`,
            title: document?.title,
            referrer: document?.referrer,
          }),
          keepalive: true,
        });
      } catch {}
    };
    send();
  }, [pathname, search?.toString()]);

  return null;
}
