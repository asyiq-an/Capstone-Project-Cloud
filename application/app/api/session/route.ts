// /app/api/session/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('sessionId')?.value;

  if (!sessionCookie) {
    return NextResponse.json({ message: 'No sessionId cookie found' }, { status: 401 });
  }

  return NextResponse.json({ sessionId: sessionCookie });
}
