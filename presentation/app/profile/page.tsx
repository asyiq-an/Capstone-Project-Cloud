import { cookies } from 'next/headers';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton'; // adjust path as needed

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold">You are not logged in.</h1>
      </div>
    );
  }

  try {
    const res = await fetch('https://gpuobwxek8.execute-api.us-east-1.amazonaws.com/checksession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }

    const user = await res.json();

    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <p><strong>Full Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Created At:</strong> {user.createdAt}</p>

        <div className="flex gap-4 mt-6">
          <LogoutButton email={user.email} />
          <Link href="/">
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Home
            </button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user info:', error);
    return (
      <div className="p-4">
        <h1 className="text-xl font-semibold text-red-600">Error loading profile.</h1>
      </div>
    );
  }
}

