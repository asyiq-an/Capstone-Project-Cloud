"use client";

import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaTiktok,
} from "react-icons/fa6"; // TikTok is in `react-icons/fa6` (Font Awesome 6)

export default function BottomBar() {
  return (
    <footer className="bg-black text-white py-4 mt-12 pt-8 pb-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} NP Snatch. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <a
            href="/support"
            className="text-sm underline hover:text-gray-300"
          >
            Support
          </a>

          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white hover:text-pink-500 text-xl" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="text-white hover:text-blue-400 text-xl" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook className="text-white hover:text-blue-600 text-xl" />
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className="text-white hover:text-gray-300 text-xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
return (
  <div className="p-6 max-w-4xl mx-auto bg-black min-h-screen">
    <div className="bg-white rounded-lg p-6">
      
    </div>
    <BottomBar />
  </div>
);
*/


