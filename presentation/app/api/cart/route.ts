
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();  // await here!
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
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

    const cartRes = await fetch(
      `https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/getcart?user_id=${email}`
    );

    if (!cartRes.ok) {
      return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
    }

    const cartJson = await cartRes.json();
    const cartData = typeof cartJson.body === "string" ? JSON.parse(cartJson.body) : cartJson;

    return NextResponse.json({ cart: cartData.cart || [] });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

// asyiq 
