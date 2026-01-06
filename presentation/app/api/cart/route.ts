import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
    // Check session and get user email
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

    // Get cart from Lambda
    const cartRes = await fetch(
      `https://mmrzcdgval.execute-api.us-east-1.amazonaws.com/default/getcart?user_id=${email}`
    );

    if (!cartRes.ok) {
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }

    const cartJson = await cartRes.json();
    const cartData = typeof cartJson.body === "string" ? JSON.parse(cartJson.body) : cartJson;

    // **Pass through Lambda data directly**
    return NextResponse.json({ cart: cartData.cart });
  } catch (err) {
    console.error("Failed to load cart:", err);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}
