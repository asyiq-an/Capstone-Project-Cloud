/*import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
    // Validate session and get user email
    const sessionRes = await fetch(
      "https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/checksession",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }
    );

    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Session check failed" }, { status: 401 });
    }

    const user = await sessionRes.json();
    const email = user.email;

    // Get preference answers from client request
    const body = await req.json();

    // Send to your preferences Lambda API
    const saveRes = await fetch(
      "https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/save-preferences",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...body }),
      }
    );

    if (!saveRes.ok) {
      const errText = await saveRes.text();
      return NextResponse.json({ error: "Failed to save preferences", details: errText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error", message: err.message }, { status: 500 });
  }
}
*/
// app/api/preferences/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CHECK_SESSION_URL =
  "https://lmhwf7frja.execute-api.us-east-1.amazonaws.com/default/checksession";
const SAVE_PREFS_URL =
  "https://3foh5hnal5.execute-api.us-east-1.amazonaws.com/default/savepref";

export async function POST(req: Request) {
  const c = cookies() as any;
  const store = typeof c?.get === "function" ? c : await c;
  const sessionId = store.get("sessionId")?.value;
  if (!sessionId) return NextResponse.json({ error: "No session" }, { status: 401 });

  // verify session -> email
  const s = await fetch(CHECK_SESSION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  });
  const sText = await s.text().catch(() => "");
  if (!s.ok) return NextResponse.json({ error: "Session check failed", sStatus: s.status, sText }, { status: 401 });
  const user = sText ? JSON.parse(sText) : {};
  const email = user?.email as string | undefined;
  if (!email) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  // client payload
  const prefs = await req.json();

  // call Lambda
  const up = await fetch(SAVE_PREFS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, ...prefs }), // plain JSON expected by your Lambda
    cache: "no-store",
  });

  const upText = await up.text().catch(() => "");
  if (!up.ok) {
    // <-- THIS is what we need to see in the Network panel
    return NextResponse.json(
      { error: "save-preferences failed", upstreamStatus: up.status, upstreamBody: upText },
      { status: 500 }
    );
  }

  return NextResponse.json(upText ? JSON.parse(upText) : { success: true }, { status: 200 });
}
