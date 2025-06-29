"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
//import NavBar from "../components/NavBar"; // Adjust the path if needed
//import BottomBar from "../components/BottomBar";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch cart");
        }
        const data = await res.json();

        // Assume each item already has a price field as a number
        const itemsWithPrice = (data.cart || []).map((item) => ({
          ...item,
          price: typeof item.price === "number" ? item.price : 0, // fallback price 0
          quantity: item.quantity || 1, // ensure quantity defaults to 1
        }));

        setCartItems(itemsWithPrice);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  const increaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.cart_item_id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((items) =>
      items.map((item) =>
        item.cart_item_id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    setCartItems((items) => items.filter((item) => item.cart_item_id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

const handleCheckout = async () => {
  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems }),
    });

    if (!res.ok) {
      const errData = await res.json();
      alert("Checkout failed: " + (errData.error || "Unknown error"));
      return;
    }

    const data = await res.json();
    const orderId = data.order_id;

    // 
    const clearRes = await fetch("/api/clearcart", {
      method: "POST",
    });

    if (!clearRes.ok) {
      const clearError = await clearRes.json();
      console.warn("Cart clear failed:", clearError.error || "Unknown error");
      // <3
    }

    // <3
    localStorage.setItem("order_id", orderId);

    // <3
    window.location.href = `/payment?order_id=${orderId}`;
  } catch (err) {
    alert("Checkout error: " + err.message);
  }
};


  if (loading) return <div className="p-6">Loading cart...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (cartItems.length === 0)
    return <div className="p-6 text-gray-500">Your cart is empty.</div>;

  return (
    <>
      
    <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen pt-24">
      {/* Cart content */}
    <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen">
      <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold text-black">Shopping Cart 🛒</h1>
  <Link
    href="/preference"
    className="text-base font-semibold text-blue-600 underline hover:text-blue-800"
  >
    Save your preference?
  </Link>
</div>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.cart_item_id}
              className="bg-gray-100 shadow rounded-lg p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-black">{item.name}</h2>
                  <p className="text-gray-700 text-sm">
                    Location: {item.location}
                    <br />
                    Pickup: {item.pickup_time} 
                    <br />
                    Special: {item.special_request || "None"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-700 text-sm">
                <button
                  onClick={() => decreaseQty(item.cart_item_id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  -
                </button>
                <span>Quantity: {item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.cart_item_id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  +
                </button>
                <button
                  onClick={() => deleteItem(item.cart_item_id)}
                  className="ml-auto text-red-600 hover:text-red-800"
                  aria-label={`Delete ${item.name} from cart`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-black">Order Summary</h2>
          <div className="flex justify-between text-black">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-black">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 text-black">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
    </div>

    
  </>
  );
}


