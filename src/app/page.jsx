"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getAll({ limit: 4 }),
          categoryService.getAll(),
        ]);
        setFeaturedProducts(productsResponse.data?.products || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Use the responsive Navbar component */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="fashion-hero">
          <div className="container mx-auto text-center px-4 py-12 md:py-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6">
              Fashion Forward
            </h1>
            <p className="text-lg sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Discover the latest trends in clothing and accessories. Style your life with our curated collection.
            </p>
            <Link href="/product" className="fashion-button-secondary inline-block">
              Shop Collection
            </Link>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="fashion-our-story">
          <div className="container mx-auto px-4 py-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">Our Story</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              At FashionHub, we believe fashion is more than just clothing—it&apos;s a way to express yourself and feel confident in your own skin. Our carefully curated collection brings together the latest trends with timeless pieces that you&apos;ll love wearing season after season.
            </p>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="fashion-categories">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {categories.length > 0 ? (
                categories.slice(0, 4).map((category, index) => {
                  const categoryIcons = ["👩", "👨", "👶", "👜"];
                  const categoryLinks = [
                    "/product?category=women",
                    "/product?category=men",
                    "/product?category=kids",
                    "/product?category=accessories",
                  ];
                  return (
                    <Link
                      key={category._id || index}
                      href={categoryLinks[index] || "/product"}
                      className="fashion-category-card"
                    >
                      <div className="text-4xl md:text-6xl mb-2 md:mb-4">{categoryIcons[index] || "🏷️"}</div>
                      <h3 className="text-lg md:text-xl font-semibold">
                        {category.name || category.category}
                      </h3>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full text-center">
                  <p className="text-gray-600">No categories available</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="fashion-featured">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">Featured Products</h2>
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-base md:text-lg text-gray-600">Loading featured products...</p>
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {featuredProducts.map((product, index) => {
                  const productEmojis = ["👗", "👕", "👖", "👟"];
                  const productCategories = ["Women", "Men", "Unisex", "Footwear"];
                  return (
                    <div key={product._id || index} className="fashion-product-card">
                      <div className="mb-4 text-center">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg mx-auto"
                          />
                        ) : (
                          <div className="text-4xl md:text-6xl">{productEmojis[index] || "👕"}</div>
                        )}
                      </div>
                      <div className="mb-2">
                        <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                          {productCategories[index] || "Fashion"}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-2">{product.name}</h3>
                      <p className="text-xl md:text-2xl font-bold text-green-600 mb-4">
                        ${product.salePrice || product.price || "0.00"}
                      </p>
                      <Link
                        href={`/product/${product._id}`}
                        className="fashion-button-primary w-full text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-base md:text-lg text-gray-600">No featured products available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="fashion-newsletter">
          <div className="container mx-auto px-4 py-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in Style</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Subscribe to our newsletter for the latest fashion updates and exclusive offers.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-800 focus:outline-none mb-3 sm:mb-0"
                />
                <button className="bg-pink-500 text-white px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none font-semibold hover:bg-pink-600 transition duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fashion-footer">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">FashionHub</h3>
              <p className="text-gray-400 text-sm md:text-base">Your ultimate destination for trendy fashion and style.</p>
              <div className="flex space-x-3 md:space-x-4 mt-4">
                <span className="text-xl md:text-2xl">📘</span>
                <span className="text-xl md:text-2xl">🐦</span>
                <span className="text-xl md:text-2xl">📷</span>
                <span className="text-xl md:text-2xl">💼</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><Link href="/women" className="hover:text-white">Women</Link></li>
                <li><Link href="/men" className="hover:text-white">Men</Link></li>
                <li><Link href="/kids" className="hover:text-white">Kids</Link></li>
                <li><Link href="/accessories" className="hover:text-white">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li><Link href="/size-guide" className="hover:text-white">Size Guide</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                <li>📧 hello@fashionhub.com</li>
                <li>📞 +1 (555) 123-4567</li>
                <li>📍 123 Fashion St, Style City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
            <p className="text-sm md:text-base">&copy; 2024 FashionHub. All rights reserved. Made with ❤️ for fashion lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
