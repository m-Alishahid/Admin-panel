



'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // adjust path if needed
import Footer from "@/components/Footer";
import Image from 'next/image';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data || []);
        }

        // Fetch products
        const productsRes = await fetch('/api/products?limit=20&sort=createdAt&order=desc');
        const productsData = await productsRes.json();
        if (productsData.success) {
          setProducts(productsData.data?.products || productsData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const slides = [
    {
      video: "/video1.mp4",
      title: "It's Snuggle Season",
      subtitle: "As the nights draw in, our cosiest collections come out to play."
    }
  ];

  const newInProducts = products.slice(0, 12);
  const featuredProducts = products.slice(0, 8); // adjustable

  const reviews = [
    {
      name: "Sarah M.",
      role: "Mother of 2",
      rating: 5,
      text: "The quality of these clothes is outstanding. My kids look so stylish and the fabrics are incredibly soft. Worth every penny!"
    },
    {
      name: "James L.",
      role: "Father of 3",
      rating: 5,
      text: "Amazing customer service and beautiful designs. The winter collection kept my kids warm and fashionable all season."
    },
    {
      name: "Emma R.",
      role: "Mother of 1",
      rating: 5,
      text: "I love how Childrensalon combines luxury with comfort. The attention to detail in every piece is remarkable."
    }
  ];

  const filteredProducts = selectedCategory === "All"
    ? newInProducts
    : newInProducts.filter(product => {
        const catName = (product.category?.name || '').toLowerCase();
        if (selectedCategory === "Girls") return catName.includes("girl");
        if (selectedCategory === "Boys") return catName.includes("boy");
        if (selectedCategory === "Baby") return catName.includes("baby");
        if (selectedCategory === "Accessories") return catName.includes("accessories");
        return true;
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Video Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={slides[0].video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-28 lg:py-36 min-h-[60vh] flex items-center">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 text-gold-400">
              {slides[0].title}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto font-serif text-gray-200">
              {slides[0].subtitle}
            </p>
            <div className="flex justify-center">
              <Link href="/product">
                <a className="inline-block bg-gold-600 hover:bg-gold-700 text-white px-6 py-3 rounded-full font-serif font-semibold text-base transition transform hover:scale-105 shadow-lg">
                  Shop Now
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Scroll (mobile friendly) */}
      <section className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center text-black mb-6">
            Shop by Category
          </h2>

          <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-4 snap-x snap-mandatory">
              {/* "All" pill */}
              <button
                onClick={() => setSelectedCategory('All')}
                className={`flex-shrink-0 snap-start px-4 py-2 rounded-full border ${selectedCategory === 'All' ? 'bg-black text-white' : 'bg-white text-gray-800'} font-serif`}
              >
                All
              </button>

              {categories.map((category) => (
                <div key={category._id || category.id} className="flex-shrink-0 snap-start w-48 md:w-56 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div
                    role="button"
                    onClick={() => setSelectedCategory(category.name)}
                    className="flex flex-col items-center justify-between h-full cursor-pointer"
                  >
                    <div className="text-4xl md:text-5xl mb-2">
                      {category.name.toLowerCase().includes('girl') ? '👗' :
                        category.name.toLowerCase().includes('boy') ? '👔' :
                        category.name.toLowerCase().includes('baby') ? '🍼' :
                        category.name.toLowerCase().includes('accessories') ? '🧣' : '👕'}
                    </div>
                    <h3 className="text-sm md:text-base font-serif font-semibold text-center">{category.name}</h3>
                    <p className="text-xs text-gray-600 text-center mt-2">Discover our {category.name.toLowerCase()} collection</p>
                    <div className="mt-3 w-full">
                      <button className="w-full bg-gold-600 text-white px-3 py-2 rounded-full text-sm hover:bg-gold-700 transition">Shop</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filtered Products Section */}
      {selectedCategory !== "All" && (
        <section className="bg-gray-50 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mb-3 sm:mb-0">
                {selectedCategory} Collection
              </h2>
              <button
                className="bg-black text-white px-4 py-2 rounded font-serif text-sm"
                onClick={() => setSelectedCategory("All")}
              >
                View All Categories
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => {
                const pid = product._id || product.id;
                return (
                  <Link key={pid} href={`/product/${pid}`}>
                    <a className="block bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition">
                      <div className="w-full h-56 md:h-64 relative bg-gray-100">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            style={{ objectFit: 'cover' }}
                            priority={false}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-base font-serif font-semibold mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-[#cda434]">£{product.price}</div>
                          <div>
                            <button className="bg-gold-600 text-white px-3 py-2 rounded text-sm font-serif hover:bg-gold-700">View</button>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center text-black mb-6">Featured Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => {
              const pid = product._id || product.id;
              return (
                <Link key={pid} href={`/product/${pid}`}>
                  <a className="block bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden transition">
                    <div className="w-full h-56 md:h-64 relative bg-gray-100">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                          priority={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-serif font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold text-[#cda434]">£{product.price}</div>
                        <button className="bg-gold-600 text-white px-3 py-2 rounded text-sm font-serif hover:bg-gold-700">View</button>
                      </div>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seasonal + Reviews + Newsletter + Footer remain similar but responsive */}
      {/* Seasonal Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-serif font-bold mb-3 md:mb-4">Winter Wonderland</h2>
            <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">Discover our exclusive winter collection featuring cozy knits, festive dresses, and holiday-ready outfits for your little ones.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-5xl mb-3">❄️</div>
              <h3 className="text-xl font-serif font-semibold mb-1">Cozy Winter Wear</h3>
              <p className="text-gray-600">Warm jackets, sweaters, and boots perfect for chilly days.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-5xl mb-3">🎄</div>
              <h3 className="text-xl font-serif font-semibold mb-1">Holiday Collection</h3>
              <p className="text-gray-600">Festive outfits and party dresses for special occasions.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-5xl mb-3">🧣</div>
              <h3 className="text-xl font-serif font-semibold mb-1">Accessories</h3>
              <p className="text-gray-600">Scarves, hats, and gloves to complete the winter look.</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link href="/product?category=seasonal">
              <a className="inline-block bg-black text-white px-6 py-3 rounded font-serif">Explore Winter Collection</a>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-center mb-6">What Parents Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{"⭐".repeat(review.rating)}</div>
                  <div>
                    <h4 className="font-serif font-semibold">{review.name}</h4>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 font-serif italic">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-black text-white py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-3">Stay in Style</h2>
          <p className="text-base text-white md:text-lg mb-6 max-w-2xl mx-auto">Subscribe to our newsletter for the latest luxury kidswear updates and exclusive offers.</p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-black bg-white focus:outline-none"
              />
              <button className="bg-gold-600 text-white px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
