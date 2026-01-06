"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PickUpPage() {
  const [code, setCode] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const orderId = sessionStorage.getItem("lastOrderId");
      if (!orderId) {
        // If no orderId, redirect back to home or cart
        router.push("/");
      } else {
        setCode(orderId.slice(0, 5)); // first 5 digits
      }
    }
  }, [router]);

  if (!code) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Pick-Up Code</h1>
        <p className="text-gray-700 mb-2">Show this code at the counter to collect your order:</p>
        <p className="text-4xl font-bold text-blue-600">{code}</p>
      </div>
    </div>
  );
}
