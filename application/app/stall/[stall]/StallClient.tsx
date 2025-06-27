'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCafeteria } from '../../context/CafeteriaContext';
import { MenuItem } from '../../../lib/types';


interface StallClientProps {
  stall: string;
  items: MenuItem[];
}

export default function StallClient({ stall, items }: StallClientProps) {
  const params = useSearchParams();
  const urlCafe = params.get('cafeteria');

  const { selectedCafe, setSelectedCafe } = useCafeteria();

  // Keep context in sync with URL parameter
  useEffect(() => {
    if (urlCafe && urlCafe !== selectedCafe) {
      setSelectedCafe(urlCafe);
    }
  }, [urlCafe, selectedCafe, setSelectedCafe]);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  const handlePreorderClick = (item: MenuItem) => {
    setCurrentItem(item);
    setQuantity(1);
    setPickupTime('');
    setSpecialRequest('');
    setModalOpen(true);
  };

  const addToCart = async () => {
    if (!currentItem) return;

    if (!pickupTime) {
      alert('Please select a pickup time.');
      return;
    }

    if (!selectedCafe) {
      alert('No cafeteria selected.');
      return;
    }

    const user_id = localStorage.getItem('userEmail');
    const unitPrice = parseFloat(currentItem.price.replace('$', '')) || 0;
    const price = unitPrice * quantity;

    const payload = {
      user_id,
      item_name: currentItem.name,
      quantity,
      price:unitPrice,
      location: selectedCafe,
      pickup_time: pickupTime,
      special_request: specialRequest || '',
    };

    console.log('Add to cart payload:', payload);

    try {
      const res = await fetch('/api/addtocart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Added to cart!');
        setModalOpen(false);
      } else {
        console.error(await res.text());
        alert('Failed to add to cart.');
      }
    } catch (err) {
      console.error(err);
      alert('Error: Could not add to cart.');
    }
  };

  const unitPrice = currentItem
    ? parseFloat(currentItem.price.replace('$', '')) || 0
    : 0;
  const totalPrice = unitPrice * quantity;

  const formatStallName = (slug: string) =>
    slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <main className="min-h-screen bg-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          {formatStallName(stall)}
        </h1>

        {selectedCafe && (
          <div className="text-center mb-6">
            <a
              href={`/?cafeteria=${selectedCafe}`}
              className="text-pink-600 text-sm hover:underline"
            >
              ← Back to {selectedCafe}
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all"
            >
              <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={160}
                  className="rounded-lg object-cover w-full h-40"
                />
              </div>
              <h2 className="text-xl font-semibold text-pink-600 mb-1">
                {item.name}
              </h2>
              <p className="text-gray-700 text-sm mb-1">{item.description}</p>
              <p className="text-xs text-red-500 italic mb-2">
                Allergens: {item.allergens}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-md font-medium">{item.price}</span>
                <button
                  onClick={() => handlePreorderClick(item)}
                  className="bg-pink-500 text-white text-sm px-4 py-1 rounded hover:bg-pink-600"
                >
                  Preorder
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </main>

      {modalOpen && currentItem && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">{currentItem.name}</h2>

            <label className="block mb-2">
              Quantity:
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border p-1 w-full"
              />
            </label>

            <p>Total Price: ${totalPrice.toFixed(2)}</p>

            <label className="block mb-2">
              Pickup Time (8AM - 5PM):
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                min="08:00"
                max="17:00"
                className="border p-1 w-full"
              />
            </label>

            <label className="block mb-2">
              Special Request:
              <textarea
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
                className="border p-1 w-full"
              ></textarea>
            </label>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="border px-4 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={addToCart}
                className="bg-pink-600 text-white px-4 py-1 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

