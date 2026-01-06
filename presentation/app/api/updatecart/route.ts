import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Read sessionId from cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // 2️⃣ Validate session → get user email
    const sessionRes = await fetch(
      "https://bk0s9xd4h6.execute-api.us-east-1.amazonaws.com/default/checksession",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }
    );

    if (!sessionRes.ok) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await sessionRes.json();
    const email = user.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email missing from session" },
        { status: 400 }
      );
    }

    // 3️⃣ Read request body
    const { cart_item_id, quantity } = await req.json();

    if (!cart_item_id || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    // 4️⃣ Call updatecart Lambda (MATCH TABLE CASE EXACTLY)
    const res = await fetch(
      "https://dc45aj7x56.execute-api.us-east-1.amazonaws.com/default/updatecart",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: email,            // ✅ FIXED
          CartItemID: cart_item_id, // ✅ FIXED
          Quantity: quantity,       // ✅ FIXED
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("updatecart Lambda error:", text);
      return NextResponse.json(
        { error: "Failed to update cart" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("updatecart API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

