"use client";

import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Load userEmail from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
      setUserEmail(storedEmail);
    } else {
      // If not present, you can prompt user or set a default
      const defaultEmail = "test@example.com";
      localStorage.setItem("user_email", defaultEmail);
      setUserEmail(defaultEmail);
    }
  }, []);

  // Fetch orders when userEmail is ready
  useEffect(() => {
    if (!userEmail) return;

    async function fetchOrders() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://2sh7iqam3h.execute-api.us-east-1.amazonaws.com/default/getcode?user_id=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch orders");
        }
        const data = await res.json();
        setOrders(data.items || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userEmail]);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (orders.length === 0)
    return <div className="p-6 text-gray-500">No orders found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Recent Orders</h1>
      <ul className="space-y-4">
        {orders.map((item) => (
          <li
            key={item.order_id + item.item_name} // ensure unique key
            className="bg-gray-100 p-4 rounded shadow flex flex-col space-y-2"
          >
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>Order Prefix:</strong> {item.order_id_prefix}
                </p>
                <p>
                  <strong>Item:</strong> {item.item_name}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Price:</strong> ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-gray-700 text-sm">
              <p>
                <strong>Pickup Time:</strong> {item.pickup_time}
              </p>
              <p>
                <strong>Location:</strong> {item.location}
              </p>
              <p>
                <strong>Special Request:</strong> {item.special_request}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
