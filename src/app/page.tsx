"use client";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

interface Category {
  _id?: string;
  name?: string;
  category?: string;
}

interface Product {
  _id?: string;
  name?: string;
  thumbnail?: string;
  salePrice?: number;
  price?: number;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getAll({ limit: 4 }),
          categoryService.getAll()
        ]);
        setFeaturedProducts(productsResponse.data?.products || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fashion-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">FashionHub</div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link>
              <Link href="/product" className="text-gray-600 hover:text-gray-800">Shop</Link>
              <Link href="/women" className="text-gray-600 hover:text-gray-800">Women</Link>
              <Link href="/men" className="text-gray-600 hover:text-gray-800">Men</Link>
              <Link href="/kids" className="text-gray-600 hover:text-gray-800">Kids</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-800">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
            </nav>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-800">🔍</button>
              <button className="text-gray-600 hover:text-gray-800">🛒</button>
              <button className="text-gray-600 hover:text-gray-800">👤</button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="fashion-hero">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Fashion Forward
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover the latest trends in clothing and accessories. Style your life with our curated collection.
            </p>
            <Link href="/product" className="fashion-button-secondary">
              Shop Collection
            </Link>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="fashion-our-story">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At FashionHub, we believe fashion is more than just clothing—it&apos;s a way to express yourself and feel confident in your own skin. Our carefully curated collection brings together the latest trends with timeless pieces that you&apos;ll love wearing season after season.
            </p>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="fashion-categories">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {categories.length > 0 ? categories.map((category, index) => {
                const categoryIcons = ["👩", "👨", "👶", "👜"];
                const categoryLinks = ["/product?category=women", "/product?category=men", "/product?category=kids", "/product?category=accessories"];
                return (
                  <Link key={category._id || index} href={categoryLinks[index] || "/product"} className="fashion-category-card">
                    <div className="text-6xl mb-4">{categoryIcons[index] || "🏷️"}</div>
                    <h3 className="text-xl font-semibold">{category.name || category.category}</h3>
                  </Link>
                );
              }) : (
                <div className="col-span-full text-center">
                  <p className="text-gray-600">No categories available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="fashion-featured">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Featured Products</h2>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">Loading featured products...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product, index) => {
                  const productEmojis = ["👗", "👕", "👖", "👟"];
                  const productCategories = ["Women", "Men", "Unisex", "Footwear"];
                  return (
                    <div key={product._id || index} className="fashion-product-card">
                      <div className="mb-4 text-center">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.name} className="w-24 h-24 object-cover rounded-lg mx-auto" />
                        ) : (
                          <div className="text-6xl">{productEmojis[index] || "👕"}</div>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                          {productCategories[index] || "Fashion"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-4">${product.salePrice || product.price || '0.00'}</p>
                      <Link href={`/product/${product._id}`} className="fashion-button-primary w-full text-center block">
                        View Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg text-gray-600">No featured products available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="fashion-newsletter">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Stay in Style</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest fashion updates and exclusive offers.
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-l-lg text-gray-800 focus:outline-none"
              />
              <button className="bg-pink-500 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-pink-600 transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fashion-footer">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">FashionHub</h3>
              <p className="text-gray-400">Your ultimate destination for trendy fashion and style.</p>
              <div className="flex space-x-4 mt-4">
                <span className="text-2xl">📘</span>
                <span className="text-2xl">🐦</span>
                <span className="text-2xl">📷</span>
                <span className="text-2xl">💼</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/women" className="hover:text-white">Women</Link></li>
                <li><Link href="/men" className="hover:text-white">Men</Link></li>
                <li><Link href="/kids" className="hover:text-white">Kids</Link></li>
                <li><Link href="/accessories" className="hover:text-white">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/size-guide" className="hover:text-white">Size Guide</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 hello@fashionhub.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Fashion St, Style City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FashionHub. All rights reserved. Made with ❤️ for fashion lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
