import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers"; // optional import if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cartItems = body.cartItems;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid." },
        { status: 400 }
      );
    }

    // Forward to your lambda API gateway URL
    const apiUrl = "https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/checkout";

    const apiRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems }),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to process checkout." },
        { status: apiRes.status }
      );
    }

    const responseData = await apiRes.json();

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// asyiq