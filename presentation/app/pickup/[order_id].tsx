"use client";

import { useParams } from "next/navigation";

export default function PickupPage() {
  const { order_id } = useParams() as { order_id: string };

  const pickupCode = order_id ? order_id.slice(0, 5) : "N/A";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Pick-Up Code</h1>
        <div className="text-4xl font-bold text-blue-600 tracking-widest">
          {pickupCode}
        </div>
        <p className="mt-2 text-gray-500 text-sm">
          Show this code at the counter to pick up your order.
        </p>
      </div>
    </div>
  );
}
