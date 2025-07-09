// app/api/profile/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  const res = await fetch('https://gpuobwxek8.execute-api.us-east-1.amazonaws.com/checksession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error || 'Failed to fetch user' }, { status: res.status });
  }

  return NextResponse.json(data);
}
