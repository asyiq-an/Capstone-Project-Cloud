"use client";

import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full bg-black shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-white rounded-full p-1">
            <Image
              src="/Np-Snatch-Logo.png"
              alt="NP Snatch Logo"
              width={40}
              height={40}
              priority
            />
          </div>
          <span className="text-white font-bold text-xl hidden sm:inline">
            NP SNATCH v1
          </span>
        </Link>

        {/* Add your nav links here */}
        <div className="space-x-4 text-white font-medium hidden sm:block">
          <Link href="/menu" className="hover:text-orange-400 transition">Menu</Link>
          <Link href="/cart" className="hover:text-orange-400 transition">Cart</Link>
          <Link href="/profile" className="hover:text-orange-400 transition">Account</Link>
        </div>
      </div>
    </nav>
  );
}

/* How to use it
return (
    <>
        <NavBar />
        <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen pt-24">
            
        </div>
    </>
);
*/ 
// asyiq
