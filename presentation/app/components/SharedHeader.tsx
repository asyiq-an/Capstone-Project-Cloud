'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCafeteria } from '../context/CafeteriaContext';
import { useAuth } from '../context/AuthContext';
 
export default function SharedHeader() {
  const router = useRouter();
  const { selectedCafe, setSelectedCafe } = useCafeteria();
  const { user, logout } = useAuth();
 
  const handleLogoClick = () => {
    setSelectedCafe('');
    router.push('/');
  };
 
  return (
<header className="flex items-center justify-between bg-white shadow p-4 border-b border-gray-200 text-sm">
<Link href="/">
<div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
<Image src="/Np-Snatch-Logo.png" alt="NP Snatch Logo" width={40} height={40} className="rounded" />
<span className="text-xl font-bold text-pink-600">NP Snatch v3</span>
</div>
</Link>
 
      <div className="flex items-center gap-4">
        {user?.fullName ? (
<>
<span className="text-pink-600 font-semibold">Welcome, {user.fullName}</span>
<Link href="/cart"><button className="border px-4 py-1 rounded">Cart</button></Link>
<Link href="/profile"><button className="border px-4 py-1 rounded">Account</button></Link>
<button onClick={logout} className="px-4 py-1 bg-red-500 text-white rounded">Logout</button>
</>
        ) : (
<>
<Link href="/login"><button className="border px-4 py-1 rounded">Log in</button></Link>
<Link href="/signup"><button className="bg-pink-600 text-white px-4 py-1 rounded">Sign up</button></Link>
</>
        )}
 
        <select
          className="border rounded px-3 py-1 bg-white text-gray-700"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCafe(value);
            if (value) router.push(`/?cafeteria=${encodeURIComponent(value)}`);
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
