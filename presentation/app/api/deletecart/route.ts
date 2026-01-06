import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cart_item_id } = body || {};

    const cookieStore = cookies();
    const sessionId = (await cookieStore).get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Validate session and get user email
    const sessionRes = await fetch(
      "https://bk0s9xd4h6.execute-api.us-east-1.amazonaws.com/default/checksession",
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

    // Call the delete lambda (external) to remove the item
    const deleteRes = await fetch(
      "https://htnsr62sia.execute-api.us-east-1.amazonaws.com/default/deletecartitems",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_item_id, user_id: email }),
      }
    );

    const data = await deleteRes.json().catch(() => ({}));

    if (!deleteRes.ok) {
      return NextResponse.json({ error: data.error || "Delete failed" }, { status: deleteRes.status });
    }

    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    console.error("deletecart error:", err);
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
