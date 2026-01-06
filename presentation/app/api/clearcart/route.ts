import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // ✅ MUST await cookies()
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session" },
        { status: 401 }
      );
    }

    // 1️⃣ Validate session
    const sessionRes = await fetch(
      "https://bk0s9xd4h6.execute-api.us-east-1.amazonaws.com/default/checksession",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }
    );

    if (!sessionRes.ok) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const user = await sessionRes.json();
    const email = user.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email missing from session" },
        { status: 400 }
      );
    }

    // 2️⃣ Call AWS clearcart Lambda
    const clearRes = await fetch(
      "https://2ekmhh3bs3.execute-api.us-east-1.amazonaws.com/default/clearcart",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email }),
      }
    );

    if (!clearRes.ok) {
      const text = await clearRes.text();
      console.error("Clearcart Lambda error:", text);
      return NextResponse.json(
        { error: "Failed to clear cart" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Clearcart API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

