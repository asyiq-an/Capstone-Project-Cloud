'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Recos from "./components/3-recos";

function PageContent() {
  const [selectedCafe, setSelectedCafe] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [sessionEmail, setSessionEmail] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const cafeteriaParam = searchParams.get('cafeteria');

  useEffect(() => {
    if (cafeteriaParam) {
      setSelectedCafe(cafeteriaParam);
    }

    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      fetch('/api/checksession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        cache: 'no-store',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.fullName) setFullName(data.fullName);
          if (data.email) setSessionEmail(data.email);
        })
        .catch((err) => console.error('Session fetch failed:', err));
    }
  }, [cafeteriaParam]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: sessionEmail }),
      });

      if (!res.ok) throw new Error('Logout failed');

      localStorage.removeItem('sessionId');
      localStorage.removeItem('fullName');
      setFullName('');
      setSessionEmail('');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const stalls: Record<string, string[]> = {
    'Makan Place': ['Mexican Food', 'Drinks Stall', 'Malay Food', 'Western Bites', 'Noodle Express', 'Dessert Haven'],
    'Food Club': ['Indonesian Food', 'Chicken Rice', 'Korean Food', 'Vietnamese Cuisine', 'Fusion Grill', 'Sushi Corner'],
    'Munch': ['Korean Food', 'Chicken Rice', 'Mala', 'Thai Delight', 'Burger Joint', 'Rice Bowl Bar'],
    'Others': ['PrataBoy (Pratas)', 'Koi (Drink Stall)', 'Healthy Smoothie Bowl Stall', 'Salad Stop', 'Fried Snacks Corner', 'Wraps n Rolls']
  };

  const stallImages: Record<string, string> = {
    'Mexican Food': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/mexican-food.jpg',
    'Drinks Stall': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/drinks-stall.jpg',
    'Malay Food': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/malay-food.jpg',
    'Western Bites': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/western-bites.jpg',
    'Noodle Express': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/western-bites.jpg',
    'Dessert Haven': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/dessert-haven.jpg',
    'Indonesian Food': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/indonesian-food.jpg',
    'Chicken Rice': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/chicken-rice.jpg',
    'Korean Food': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/korean-food.jpg',
    'Vietnamese Cuisine': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/vietnamese-cuisine.jpg',
    'Fusion Grill': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/fusion-grill.jpg',
    'Sushi Corner': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/sushi-corner.jpg',
    'Mala': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/mala.jpg',
    'Thai Delight': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/thai-delight.jpg',
    'Burger Joint': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/burger-joint.jpg',
    'Rice Bowl Bar': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/rice-bowl-bar.jpg',
    'PrataBoy (Pratas)': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/prataboy-pratas.jpg',
    'Koi (Drink Stall)': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/koi-drink-stall.jpg',
    'Healthy Smoothie Bowl Stall': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/healthy-smoothie-bowl-stall.jpg',
    'Salad Stop': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/salad-stop.jpg',
    'Fried Snacks Corner': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/fried-snacks-corner.jpg',
    'Wraps n Rolls': 'https://np-snatch-image2.s3.us-east-1.amazonaws.com/wraps-rolls.jpg'
  };

  return (
    <main className="min-h-screen bg-pink-50 px-4 pt-6 pb-28 font-sans">
      <div className="max-w-6xl mx-auto">
        {!selectedCafe && (
          <>
            <h1 className="text-4xl font-bold text-center mb-10 text-pink-600">
              Order From Campus Cafeterias
            </h1>
            <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto">
              Enjoy delicious meals delivered right from your school’s top food spots.
              Choose your Cafeteria options at the header.
            </p>
          </>
        )}

        {selectedCafe && (
          <>
            <Recos cafeteria={selectedCafe} />

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-semibold text-pink-600 mb-4">
                Stores in {selectedCafe}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {stalls[selectedCafe]?.map((store, index) => (
                  <Link
                    key={index}
                    href={{
                      pathname: `/stall/${store.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/[^a-z0-9-]/gi, '')}`,
                      query: { cafeteria: selectedCafe }
                    }}
                  >
                    <div className="flex flex-col items-start justify-start border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer bg-white w-full">
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-base">
                        <Image
                          src={stallImages[store]}
                          alt={store}
                          width={300}
                          height={128}
                          className="w-full h-32 object-cover rounded-t-xl"
                        />
                      </div>
                      <p className="text-md text-pink-600 font-semibold px-3 py-2">
                        {store}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
