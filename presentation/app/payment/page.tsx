'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type PaidItem = {
  item_id: string;
  name: string;
  price: number;
  quantity: number;
};

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('order_id');

  const [orderId, setOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'paynow'>('card');
  const [paidItems, setPaidItems] = useState<PaidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (orderIdFromUrl) {
      localStorage.setItem('order_id', orderIdFromUrl);
      setOrderId(orderIdFromUrl);
    } else {
      const storedOrderId = localStorage.getItem('order_id');
      setOrderId(storedOrderId);
    }
  }, [orderIdFromUrl]);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/paid?order_id=${encodeURIComponent(orderId)}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPaidItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error('Error loading paid items:', err);
        setPaidItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const subtotal = paidItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!paidItems.length) {
      setMessage("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const cartItems = paidItems.map(i => ({
        item_id: i.item_id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity),
      }));

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, order_id: orderId }),
      });

      const text = await res.text();
      console.log('checkout response:', res.status, text);
      if (!res.ok) {
        let err: any;
        try { err = JSON.parse(text); } catch { err = { error: text }; }
        setMessage(err.error || `Payment failed (${res.status}).`);
        return;
      }

      const data = JSON.parse(text);
      // TODO: handle success—e.g., show receipt, redirect, clear localStorage, etc.
      setMessage("Payment created ✅");
    } catch (err: any) {
      console.error(err);
      setMessage("Something went wrong while creating the payment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Payment Page</h1>

        {loading ? (
          <p className="text-center">Loading payment details...</p>
        ) : (
          <>
            {/* Order Summary */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
              <table className="w-full text-left border-collapse mb-4">
                <thead>
                  <tr>
                    <th className="pb-2 border-b">Item</th>
                    <th className="pb-2 border-b">Qty</th>
                    <th className="pb-2 border-b">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {paidItems.map((item) => (
                    <tr key={item.item_id} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-4 font-semibold" colSpan={2}>Subtotal</td>
                    <td className="pt-4 font-semibold">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="pt-1 font-semibold" colSpan={2}>Tax (8%)</td>
                    <td className="pt-1 font-semibold">${tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="pt-1 font-bold text-lg" colSpan={2}>Total</td>
                    <td className="pt-1 font-bold text-lg">${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 border-b">
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-2 text-center font-medium ${activeTab === 'card' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                Credit/Debit Card
              </button>
              <button
                onClick={() => setActiveTab('paynow')}
                className={`flex-1 py-2 text-center font-medium ${activeTab === 'paynow' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
              >
                PayNow QR
              </button>
            </div>

            {/* Payment Forms */}
            {activeTab === 'card' && (
              <form onSubmit={handlePay}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                    <input type="text" placeholder="123" className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {message && (
                  <p className={`mb-3 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Processing…' : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            )}

            {activeTab === 'paynow' && (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600 mb-4">
                  Scan the QR code using your banking app to pay ${total.toFixed(2)}
                </p>
                <img
                  src="https://image.spreadshirtmedia.net/image-server/v1/compositions/T1155A77PA2483PT17X54Y46D302918259W14458H17350/views/1,width=550,height=550,appearanceId=77,backgroundColor=F7EBCD,noPt=true/qr-cat-meme-qr-code-cat-mum-cat-lovers-drawstring-bag.jpg"
                  alt="PayNow QR Code"
                  className="w-48 h-48 border rounded-md mb-4"
                />
                <a
                  href="/images/paynow-qr.jpg"
                  download="paynow-qr.jpg"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700"
                >
                  Download QR
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading Payment Page...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
