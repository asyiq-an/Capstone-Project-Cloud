import { v4 as uuidv4 } from 'uuid';
import { serialize } from 'cookie';

export async function POST(req: Request) {
  const body = await req.json();

  // Generate sessionId
  const sessionId = uuidv4();

  // Call Lambda with credentials and the new sessionId
  const lambdaResponse = await fetch('https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: body.email,
      password: body.password,
      sessionId, // pass generated sessionId to Lambda
    }),
  });

  const data = await lambdaResponse.json();

  const headers = new Headers({ 'Content-Type': 'application/json' });

  // Only set cookie if login was successful
  if (lambdaResponse.ok) {
    const cookie = serialize('sessionId', sessionId, {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
    });

    headers.append('Set-Cookie', cookie);
  }

  return new Response(JSON.stringify(data), {
    status: lambdaResponse.status,
    headers,
  });
}
