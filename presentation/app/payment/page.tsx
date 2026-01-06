"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PaidItem = {
  item_id: string;   // order_id
  name: string;
  price: number;
  quantity: number;
};

function PaymentPageContent() {
  const [paidItems, setPaidItems] = useState<PaidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"card" | "paynow">("card");

  const router = useRouter();

  // 1️⃣ Load cart items (user resolved via session cookie in /api/paid)
  useEffect(() => {
    const fetchPaidItems = async () => {
      try {
        const res = await fetch("/api/paid", {
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setPaidItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error("Failed to load items:", err);
        setPaidItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaidItems();
  }, []);

  const subtotal = paidItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // 2️⃣ Handle payment
  async function handlePay(e: React.FormEvent) {
    e.preventDefault();

    if (!paidItems.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      // Checkout (browser → Next.js → AWS)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cartItems: paidItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Payment failed.");
        return;
      }

      setMessage("Payment succeeded ✅");

      // Clear cart (browser → Next.js → AWS)
      await fetch("/api/clearcart", {
        method: "POST",
        credentials: "include",
      });

      // Extract order ID
      const orderId =
        data.order_id ||
        (Array.isArray(data.order_ids) ? data.order_ids[0] : null);

      if (!orderId) {
        setMessage("Payment succeeded but no order ID returned.");
        return;
      }

      // Save order ID for pickup page
      sessionStorage.setItem("lastOrderId", orderId);

      // Redirect
      router.push("/pickup");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong during payment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-black">
        <h1 className="mb-6 text-center text-2xl font-bold">Payment Page</h1>

        {loading ? (
          <p className="text-center">Loading payment details…</p>
        ) : (
          <>
            {/* Order Summary */}
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Order Summary</h2>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="border-b pb-2">Item</th>
                    <th className="border-b pb-2">Qty</th>
                    <th className="border-b pb-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {paidItems.map((item, index) => (
                    <tr
                      key={`${item.item_id}-${index}`}   // ✅ UNIQUE KEY
                      className="border-b"
                    >
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="pt-4 font-semibold">
                      Subtotal
                    </td>
                    <td className="pt-4 font-semibold">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="font-semibold">
                      Tax (8%)
                    </td>
                    <td className="font-semibold">${tax.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="text-lg font-bold">
                      Total
                    </td>
                    <td className="text-lg font-bold">${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex border-b">
              <button
                onClick={() => setActiveTab("card")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "card"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setActiveTab("paynow")}
                className={`flex-1 py-2 text-center font-medium ${
                  activeTab === "paynow"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                PayNow
              </button>
            </div>

            {/* Card Payment */}
            {activeTab === "card" && (
              <form onSubmit={handlePay}>
                <input
                  placeholder="Card Number"
                  className="mb-3 w-full rounded border px-3 py-2"
                />
                <div className="mb-4 flex gap-3">
                  <input
                    placeholder="MM/YY"
                    className="w-1/2 rounded border px-3 py-2"
                  />
                  <input
                    placeholder="CVC"
                    className="w-1/2 rounded border px-3 py-2"
                  />
                </div>

                {message && (
                  <p
                    className={`mb-3 text-sm ${
                      message.includes("succeeded")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Processing…" : `Pay $${total.toFixed(2)}`}
                </button>
              </form>
            )}

            {/* PayNow */}
            {activeTab === "paynow" && (
              <div className="flex flex-col items-center">
                <p className="mb-4 text-sm text-gray-600">
                  Scan QR to pay ${total.toFixed(2)}
                </p>
                <img
                  src="https://image.spreadshirtmedia.net/image-server/v1/compositions/T1155A77PA2483PT17X54Y46D302918259W14458H17350/views/1,width=550,height=550,appearanceId=77,backgroundColor=F7EBCD,noPt=true/qr-cat-meme-qr-code-cat-mum-cat-lovers-drawstring-bag.jpg"
                  className="h-48 w-48 rounded border"
                  alt="PayNow QR"
                />
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
    <Suspense fallback={<div>Loading…</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}

