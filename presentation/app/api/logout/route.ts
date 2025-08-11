// app/api/logout/route.ts (or /pages/api/logout.ts if using pages dir)

import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const response = await fetch('https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
