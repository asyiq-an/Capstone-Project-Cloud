import { cookies } from "next/headers";
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
      "https://gpuobwxek8.execute-api.us-east-1.amazonaws.com/checksession",
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
      "https://gpuobwxek8.execute-api.us-east-1.amazonaws.com/save_preferences",
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
