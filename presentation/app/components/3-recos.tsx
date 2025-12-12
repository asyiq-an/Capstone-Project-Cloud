'use client';

import { useState } from 'react';
import Image from 'next/image';

// Static data for 3 recommendations
const recosData: Record<string, { img: string; title: string; subtitle: string; price: number }[]> = {
  'Makan Place': [
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/malay-food.jpg',
      title: 'Nasi Lemak',
      subtitle: 'Malay • Halal • $3.50',
      price: 3.5,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/western-bites.jpg',
      title: 'Beef Quesadilla',
      subtitle: 'Mexican • Halal • $3.00',
      price: 3.0,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/western-bites.jpg',
      title: 'Fish & Chips',
      subtitle: 'Western • Halal • $1.20',
      price: 1.2,
    },
  ],
  'Food Club': [
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/chicken-rice.jpg',
      title: 'Ayam Penyet',
      subtitle: 'Indonesian • Halal • $5.50',
      price: 5.5,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/chicken-rice.jpg',
      title: 'Roasted Chicken Rice',
      subtitle: 'Chicken Rice • Halal • $4.50',
      price: 4.5,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/korean-food.jpg',
      title: 'Bibimbap',
      subtitle: 'Korean Food • Non-Halal • $1.80',
      price: 1.8,
    },
  ],
  'Munch': [
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/korean-food.jpg',
      title: 'Bibimbap',
      subtitle: 'Korean • Halal • $4.80',
      price: 4.8,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/chicken-rice.jpg',
      title: 'Roasted Chicken Rice',
      subtitle: 'Chicken Rice • Halal • $4.50',
      price: 4.5,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/mala.jpg',
      title: 'Mala Xiang Guo',
      subtitle: 'Mala • Halal • $6.00',
      price: 6.0,
    },
  ],
  'Others': [
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/koi-drink-stall.jpg',
      title: 'Koi Bubble Tea',
      subtitle: 'Drink Stall • Non-Halal • $3.80',
      price: 3.8,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/healthy-smoothie-bowl-stall.jpg',
      title: 'Healthy Salad Bowl',
      subtitle: 'Salad Stop • Halal • $5.50',
      price: 5.5,
    },
    {
      img: 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/prataboy-pratas.jpg',
      title: 'Prata',
      subtitle: 'Prata Boy • Halal • $4.50',
      price: 4.5,
    },
  ],
};

/* const recosData = [
  {
    img: '/chicken-shawarma-turkish-fc.jpg',
    title: 'Chicken Shawarma',
    subtitle: 'Turkish • Halal • $5.50',
  },
  {
    img: '/chicken-rice-fc.png',
    title: 'Roasted Chicken Rice',
    subtitle: 'Chicken Rice • Halal • S$4.50',
  },
  {
    img: '/plain-waffle-fluffy-duck-fc.jpg',
    title: 'Plain Waffle',
    subtitle: 'Fluffy Duck • Non-Halal • S$1.80',
  },
]; */

// Below is code that would have been used to retrieve recommendations from AI API if needed

/*
const response = await fetch("AWS AI API link")
const recos = await response.json();

return (
    <ul className="space-y-4 p-4">
        {recos.map((recos: Recos) => (
            <li
            key={recos.id}
            classname="p-4 bg-white shadow-md rounded-lg text-gray-700"
        >
            {recos.title} ({recos.subtitle})
        </li>
        ))}
    </ul>
);
*/

export default function Recos({ cafeteria }: { cafeteria: string }) {
  const data = recosData[cafeteria];
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<{ title: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');

  if (!data) return null;

  const handlePreorderClick = (item: { title: string; price: number }) => {
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

    const user_id = localStorage.getItem('userEmail');
  const unitPrice = currentItem.price;
  const totalPrice = unitPrice * quantity;

     const payload = {
    user_id,
    item_name: currentItem.title,
    quantity,
    price: unitPrice,
    location: cafeteria,
    pickup_time: pickupTime,
    special_request: specialRequest || '',
  };

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
      alert('Error adding to cart.');
    }
  };

  const totalPrice = currentItem ? currentItem.price * quantity : 0;

  return (
    <section className="flex flex-col items-center py-10 px-4">
      <h2 className="text-lg sm:text-2xl font-semibold text-center mb-8">
        Want some recommendations in {cafeteria}?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl shadow-md overflow-hidden bg-white flex flex-col items-center p-4"
          >
            <div className="w-full aspect-video relative mb-4 rounded-lg overflow-hidden">
              <Image src={item.img} alt={item.title} fill className="object-cover" />
            </div>
            <h3 className="text-lg font-bold text-black text-center">{item.title}</h3>
            <p className="text-sm text-black text-center mt-1">{item.subtitle}</p>
            <button
              onClick={() => handlePreorderClick({ title: item.title, price: item.price })}
              className="mt-3 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
            >
              Preorder
            </button>
          </div>
        ))}
      </div>

      {modalOpen && currentItem && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">{currentItem.title}</h2>

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
    </section>
  );
}

