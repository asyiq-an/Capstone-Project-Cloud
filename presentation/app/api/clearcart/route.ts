import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const sessionId = (await cookieStore).get('sessionId')?.value;

  if (!sessionId) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  try {
    // Step 1: Validate session and get email
    const sessionRes = await fetch(
      'https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/checksession',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }
    );

    if (!sessionRes.ok) {
      return NextResponse.json({ error: 'Session check failed' }, { status: 401 });
    }

    const user = await sessionRes.json();
    const email = user.email;

    // Step 2: Call API Gateway to clear user's cart by email
    const clearRes = await fetch(
      `https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/clearcart`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: email }),
      }
    );

    if (!clearRes.ok) {
      return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error clearing cart' }, { status: 500 });
  }
}

// asyiq