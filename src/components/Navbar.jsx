"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services/categoryService';

export default function Navbar() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-pink-600">FashionHub</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition duration-300">Home</Link>
            <Link href="/product" className="text-gray-700 hover:text-pink-600 transition duration-300">Shop</Link>
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/product?category=${category.name || category.category}`}
                className="text-gray-700 hover:text-pink-600 transition duration-300"
              >
                {category.name || category.category}
              </Link>
            ))}
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition duration-300">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition duration-300">Contact</Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-pink-600 transition duration-300">🔍</button>
            <button className="text-gray-700 hover:text-pink-600 transition duration-300">🛒</button>
            <button className="text-gray-700 hover:text-pink-600 transition duration-300">👤</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
