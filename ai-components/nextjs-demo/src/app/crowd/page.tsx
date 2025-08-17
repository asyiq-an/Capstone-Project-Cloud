'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('https://8697e75197d0.ngrok-free.app//analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setPercentage(data.percentage);
    } catch (error) {
      alert('Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">Food Court Occupancy Estimator</h1>
        
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setPercentage(null);
          }}
          className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>

        {percentage !== null && (
          <div className="mt-4 text-center">
            <p className="text-lg text-gray-700 font-medium">
              Estimated occupancy:
              <span className="text-blue-600 font-bold ml-2">{percentage}%</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
