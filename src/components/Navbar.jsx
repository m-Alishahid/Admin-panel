"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Globe, Heart, ShoppingBag, User, Search } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <header className="w-full bg-white border-b shadow-sm">
      {/* --- Top Reward Bar --- */}
      <div className="bg-gradient-to-b from-[#f8f4eb] to-[#fffdf9] text-xs text-center text-gray-600 py-1 border-b">
        Join Childrensalon Rewards and unlock exclusive treats as you shop.
        <span className="font-semibold"> NEW REWARD </span> — Convert your
        points into vouchers.
      </div>

      {/* --- Main Navbar --- */}
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Left Side Buttons */}
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <button className="border border-[#d4b26e] rounded-full px-3 py-1 flex items-center gap-1 hover:bg-[#f8f4eb]">
            👑 Rewards
          </button>
          <button className="border border-[#d4b26e] rounded-full px-3 py-1 flex items-center gap-1 hover:bg-[#f8f4eb]">
            <User size={14} /> Sign In
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex flex-col items-center">
          <Image
            src="/logo-coat.png"
            alt="Childrensalon Logo"
            width={80}
            height={60}
            className="object-contain"
          />
          <h1 className="font-bold text-[22px] tracking-[3px]">
            <span className="text-[#cda434]">C</span>
            <span className="text-[#f07b7b]">H</span>
            <span className="text-[#8cc5c0]">I</span>
            <span className="text-[#dca8b6]">L</span>
            <span className="text-[#b7b3d0]">D</span>
            <span className="text-[#f1b74a]">R</span>
            <span className="text-[#f07b7b]">E</span>
            <span className="text-[#8cc5c0]">N</span>
            <span className="text-[#dca8b6]">S</span>
            <span className="text-[#b7b3d0]">A</span>
            <span className="text-[#f1b74a]">L</span>
            <span className="text-[#cda434]">O</span>
            <span className="text-[#f07b7b]">N</span>
          </h1>
        </div>

        {/* Right Options */}
        <div className="flex items-center gap-4 text-sm">
          <select className="border-none bg-transparent text-gray-700">
            <option>English</option>
            <option>Arabic</option>
            <option>Urdu</option>
          </select>
          <select className="border-none bg-transparent text-gray-700">
            <option>£ GBP</option>
            <option>$ USD</option>
            <option>PKR</option>
          </select>
          <select className="border-none bg-transparent text-gray-700">
            <option>🇵🇰 Pakistan</option>
            <option>🇬🇧 UK</option>
            <option>🇺🇸 USA</option>
          </select>
        </div>
      </div>

      {/* --- Navigation Menu --- */}
      <nav className="flex justify-center gap-6 text-[15px] font-medium tracking-wide text-gray-800 border-t py-2 uppercase">
        {categories.map((category) => (
          <Link key={category.id} href={`/product?category=${category.name.toLowerCase().replace(" ", "-")}`}>
            {category.name}
          </Link>
        ))}
      </nav>

      {/* --- Utility Icons --- */}
      <div className="absolute right-6 top-[72px] flex items-center gap-4 text-gray-600">
        <button className="flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50">
          <Search size={16} /> Search
        </button>
        <Link href="/account" className="flex items-center gap-1">
          <User size={18} /> Account
        </Link>
        <Link href="/wishlist" className="flex items-center gap-1">
          <Heart size={18} /> Wishlist
        </Link>
        <Link href="/cart" className="flex items-center gap-1">
          <ShoppingBag size={18} /> Bag
        </Link>
      </div>
    </header>
  );
}
