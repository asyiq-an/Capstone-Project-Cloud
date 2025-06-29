// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('Setting cookie...');

  useEffect(() => {
    fetch('/api/set-cookie')
      .then(res => res.json())
      .then(data => setMessage(`Session ID set: ${data.sessionId}`))
      .catch(() => setMessage('Failed to set cookie'));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
      <p>
        Go to <Link href="/profile">/profile</Link> to read the cookie.
      </p>
    </div>
  );
}
