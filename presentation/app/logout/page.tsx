'use client';

import { useState } from 'react';

export default function LogoutPage() {
  const email = 'khoojiaxiang1@gmail.com'; // or get dynamically

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Logout failed');
      }

      setMessage('Logout successful! Session deleted.');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Logout Test</h1>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
