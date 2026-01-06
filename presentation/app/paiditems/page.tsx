"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PaidItem = {
  item_id: string; // order_id from DynamoDB
  name: string;
  price: number;
  quantity: number;
};

export default function PaidItemsPage() {
  const [paidItems, setPaidItems] = useState<PaidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPaidItems = async () => {
      try {
        // 1️⃣ Get the last order ID from sessionStorage
        const lastOrderId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("lastOrderId")
            : null;

        if (!lastOrderId) {
          setPaidItems([]);
          return;
        }

        // 2️⃣ Fetch paid items from Lambda
        const res = await fetch("/api/paid", { cache: "no-store" });
        const data = await res.json();

        // 3️⃣ Filter only items from last order
        const items = Array.isArray(data.items)
          ? data.items
              .filter((item: any) => item.order_id === lastOrderId)
              .map((item: any) => ({
                item_id: item.order_id,
                name: item.item_name,
                price: Number(item.price),
                quantity: Number(item.quantity),
              }))
          : [];

        setPaidItems(items);
      } catch (err) {
        console.error("Failed to fetch paid items:", err);
        setPaidItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaidItems();
  }, []);

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Paid Items</h1>
      {loading ? (
        <p>Loading paid items...</p>
      ) : paidItems.length === 0 ? (
        <p>No paid items found for your latest order.</p>
      ) : (
        <ul className="space-y-2">
          {paidItems.map((item) => (
            <li key={item.item_id} className="border p-2 rounded">
              <p className="font-medium">{item.name}</p>
              <p>
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
              <button
                onClick={() => router.push(`/pickup/${item.item_id}`)}
                className="text-blue-600 underline mt-1"
              >
                Pick-Up Code
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
