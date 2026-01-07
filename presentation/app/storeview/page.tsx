"use client";
import { useEffect, useState } from "react";

interface PaidItem {
  order_id: string;
  item_name: string;
  location: string;
  pickup_time: string;
  quantity: number;
  special_request?: string;
}

interface OrdersByLocation {
  [location: string]: PaidItem[];
}

export default function StoreView() {
  const [items, setItems] = useState<OrdersByLocation>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch(
          "https://gokuzm89h9.execute-api.us-east-1.amazonaws.com/default/storeview"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data: PaidItem[] = await res.json();

        // Keep only relevant fields
        const filtered = data.map((item) => ({
          order_id: item.order_id,
          item_name: item.item_name,
          location: item.location,
          pickup_time: item.pickup_time,
          quantity: item.quantity,
          special_request: item.special_request || "",
        }));

        // Group by location
        const grouped: OrdersByLocation = {};
        filtered.forEach((item) => {
          if (!grouped[item.location]) grouped[item.location] = [];
          grouped[item.location].push(item);
        });

        // Sort each group by pickup_time
        Object.keys(grouped).forEach((loc) => {
          grouped[loc].sort(
            (a, b) =>
              parseInt(a.pickup_time.replace(":", ""), 10) -
              parseInt(b.pickup_time.replace(":", ""), 10)
          );
        });

        setItems(grouped);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Today's Orders</h1>
      {Object.keys(items).map((location) => (
        <div key={location} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{location}</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Order Code</th>
                <th className="border px-2 py-1">Item</th>
                <th className="border px-2 py-1">Quantity</th>
                <th className="border px-2 py-1">Pickup Time</th>
                <th className="border px-2 py-1">Special Requests</th>
              </tr>
            </thead>
            <tbody>
              {items[location].map((item, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{item.order_id.slice(0, 5)}</td>
                  <td className="border px-2 py-1">{item.item_name}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">{item.pickup_time}</td>
                  <td className="border px-2 py-1">{item.special_request}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
