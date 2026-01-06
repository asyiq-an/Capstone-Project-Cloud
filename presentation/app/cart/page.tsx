"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  cart_item_id: number;
  name: string;
  location: string;
  pickup_time: string;
  special_request: string | null;
  price: number;
  quantity: number;
};

export default function CartPage() {
  console.log("🚨 THIS CART PAGE IS RUNNING");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 LOAD CART
  const fetchCart = async (): Promise<void> => {
    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch cart");
      }

      const data = await res.json();
      setCartItems(data.cart || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load cart.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 UPDATE QTY (BACKEND FIRST, THEN UI)
  const updateQty = async (cartItemId: number, newQty: number): Promise<void> => {
    console.log("🔥 updateQty called:", cartItemId, newQty);

    if (newQty < 1) return;

    try {
      const res = await fetch("/api/updatecart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cart_item_id: cartItemId,
          quantity: newQty,
        }),
      });

      console.log("🔥 updatecart status:", res.status);

      if (!res.ok) {
        throw new Error("Failed to update quantity");
      }

      // 🔁 REFRESH FROM DB (SOURCE OF TRUTH)
      await fetchCart();
    } catch {
      alert("Error updating quantity");
    }
  };

  const increaseQty = (item: CartItem) => {
    updateQty(item.cart_item_id, item.quantity + 1);
  };

  const decreaseQty = (item: CartItem) => {
    updateQty(item.cart_item_id, item.quantity - 1);
  };

  const deleteItem = async (cartItemId: number): Promise<void> => {
    try {
      const res = await fetch("/api/deletecart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cart_item_id: cartItemId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchCart();
    } catch {
      alert("Error deleting item");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
    window.location.href = "/payment";
  };

  if (loading) return <div className="p-6">Loading cart…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (cartItems.length === 0)
    return <div className="p-6 text-gray-500">Your cart is empty.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen pt-24">
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart 🛒</h1>
          <Link
            href="/preference"
            className="text-blue-600 underline font-semibold"
          >
            Save your preference?
          </Link>
        </div>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cart_item_id}
              className="bg-gray-100 p-4 rounded-lg shadow"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-700">
                    Location: {item.location}
                    <br />
                    Pickup: {item.pickup_time}
                    <br />
                    Special: {item.special_request || "None"}
                  </p>
                </div>
                <div className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center mt-3 gap-4">
                <button
                  onClick={() => decreaseQty(item)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>Quantity: {item.quantity}</span>

                <button
                  onClick={() => increaseQty(item)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>

                <button
                  onClick={() => deleteItem(item.cart_item_id)}
                  className="ml-auto text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t mt-2 pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
