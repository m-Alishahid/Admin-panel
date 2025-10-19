"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { categoryService } from '@/services/categoryService';

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl md:text-2xl font-bold text-pink-600">
              FashionHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-600 transition duration-300 text-sm lg:text-base">
              Home
            </Link>
            <Link href="/product" className="text-gray-700 hover:text-pink-600 transition duration-300 text-sm lg:text-base">
              Shop
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category._id}
                href={`/product?category=${category.name || category.category}`}
                className="text-gray-700 hover:text-pink-600 transition duration-300 text-sm lg:text-base whitespace-nowrap"
              >
                {category.name || category.category}
              </Link>
            ))}
            <Link href="/about" className="text-gray-700 hover:text-pink-600 transition duration-300 text-sm lg:text-base">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-600 transition duration-300 text-sm lg:text-base">
              Contact
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button className="text-gray-700 hover:text-pink-600 transition duration-300 p-2">
              <span className="text-lg">🔍</span>
            </button>
            <button className="text-gray-700 hover:text-pink-600 transition duration-300 p-2">
              <span className="text-lg">🛒</span>
            </button>
            <button className="text-gray-700 hover:text-pink-600 transition duration-300 p-2">
              <span className="text-lg">👤</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-pink-600 transition duration-300 p-2"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              {/* Mobile Action Buttons */}
              <div className="flex justify-center space-x-6 py-2 border-b border-gray-200">
                <button className="text-gray-700 hover:text-pink-600 transition duration-300 p-2">
                  <span className="text-lg">🔍</span>
                </button>
                <button className="text-gray-700 hover:text-pink-600 transition duration-300 p-2">
                  <span className="text-lg">🛒</span>
                </button>
                <button className="text-gray-700 hover:text-pink-600 transition duration-300 p-2">
                  <span className="text-lg">👤</span>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-pink-600 transition duration-300 py-2 px-4 rounded-lg hover:bg-pink-50"
              >
                Home
              </Link>
              <Link
                href="/product"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-pink-600 transition duration-300 py-2 px-4 rounded-lg hover:bg-pink-50"
              >
                Shop
              </Link>

              {/* Mobile Categories */}
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/product?category=${category.name || category.category}`}
                  onClick={closeMobileMenu}
                  className="text-gray-700 hover:text-pink-600 transition duration-300 py-2 px-4 rounded-lg hover:bg-pink-50 ml-4"
                >
                  {category.name || category.category}
                </Link>
              ))}

              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-pink-600 transition duration-300 py-2 px-4 rounded-lg hover:bg-pink-50"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-pink-600 transition duration-300 py-2 px-4 rounded-lg hover:bg-pink-50"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
