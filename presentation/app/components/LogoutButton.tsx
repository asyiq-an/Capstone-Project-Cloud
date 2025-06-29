'use client';

import { useState } from 'react';

function LogoutButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error(`Logout failed: ${res.statusText}`);
      }

      document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      window.location.href = '/login'; // or wherever
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default LogoutButton;
