import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('order_id');

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
  }

  try {
    const apiUrl = `https://tkzemxdoli.execute-api.us-east-1.amazonaws.com/default/payment?order_id=${orderId}`; // Replace with your actual endpoint

    const lambdaResponse = await fetch(apiUrl);

    if (!lambdaResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Lambda' },
        { status: lambdaResponse.status }
      );
    }

    const data = await lambdaResponse.json();
    return NextResponse.json({ items: data.items });
  } catch (error) {
    console.error('Error fetching paid items from Lambda:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// asyiq