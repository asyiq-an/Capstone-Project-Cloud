'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCafeteria } from '../context/CafeteriaContext';

export default function SharedHeader() {
  const router = useRouter();
  const { selectedCafe, setSelectedCafe } = useCafeteria();
  const [fullName, setFullName] = useState('');
  const [sessionEmail, setSessionEmail] = useState('');

  useEffect(() => {
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
          if (data.email) {
            setSessionEmail(data.email);
            localStorage.setItem('userEmail', data.email);
          }
        })
        .catch((err) => console.error('Session fetch failed:', err));
    } else {
      localStorage.removeItem('userEmail');
    }
  }, []);

  const handleLogoClick = () => {
    setSelectedCafe('');
    router.push('/');
  };

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
      localStorage.removeItem('userEmail');
      setFullName('');
      setSessionEmail('');
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="flex items-center justify-between bg-white shadow p-4 border-b border-gray-200 text-sm">
      {/* Logo */}
      <Link
        href="/"
        onClick={handleLogoClick}
        className="flex items-center gap-2 cursor-pointer"
      >
        <Image
          src="/Np-Snatch-Logo.png"
          alt="NP Snatch Logo"
          width={40}
          height={40}
          className="rounded"
        />
        <span className="text-xl font-bold text-pink-600">NP Snatch v3</span>
      </Link>

      <div className="flex items-center gap-4">
        {fullName ? (
          <>
            <span className="text-pink-600 font-semibold">
              Welcome, {fullName}
            </span>

            <Link
              href="/cart"
              className="border border-gray-400 px-4 py-1 rounded hover:bg-gray-100"
            >
              Cart
            </Link>

            <Link
              href="/profile"
              className="border border-gray-400 px-4 py-1 rounded hover:bg-gray-100"
            >
              Account
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="border border-gray-400 px-4 py-1 rounded hover:bg-gray-100"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              className="bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
            >
              Sign up
            </Link>
          </>
        )}

        <select
          className="border border-gray-300 rounded px-3 py-1 bg-white text-gray-700 appearance-none cursor-pointer"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCafe(value);
            if (value) {
              router.push(`/?cafeteria=${encodeURIComponent(value)}`);
            }
          }}
          value={selectedCafe}
        >
          <option value="">Select Cafeteria</option>
          <option value="Makan Place">Makan Place</option>
          <option value="Food Club">Food Club</option>
          <option value="Munch">Munch</option>
          <option value="Others">Others</option>
        </select>
      </div>
    </header>
  );
}

