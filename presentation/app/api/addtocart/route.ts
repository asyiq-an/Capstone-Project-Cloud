import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const payload = {
    user_id: body.userId,
    item_name: body.itemName,
    quantity: body.quantity,
    price: body.price,
    location: body.location,
    pickup_time: body.pickupTime,
    special_request: body.specialRequest ?? '',
  };

  const res = await fetch(
    'https://dkl5un5qc9.execute-api.us-east-1.amazonaws.com/default/addtocart',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
