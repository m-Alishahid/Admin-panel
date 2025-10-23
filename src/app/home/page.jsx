// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Navbar from "../../components/Navbar";

// export default function HomePage() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch categories
//         const categoriesRes = await fetch('/api/categories');
//         const categoriesData = await categoriesRes.json();
//         if (categoriesData.success) {
//           setCategories(categoriesData.data);
//         }

//         // Fetch products
//         const productsRes = await fetch('/api/products?limit=20&sort=createdAt&order=desc');
//         const productsData = await productsRes.json();
//         if (productsData.success) {
//           setProducts(productsData.data.products);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const slides = [
//     {
//       video: "/video1.mp4",
//       title: "It's Snuggle Season",
//       subtitle: "As the nights draw in, our cosiest collections come out to play."
//     }
//   ];

//   const newInProducts = products.slice(0, 5);
//   const featuredProducts = products.slice(0, 5); // Using same products for now, can be modified later

//   const reviews = [
//     {
//       name: "Sarah M.",
//       role: "Mother of 2",
//       rating: 5,
//       text: "The quality of these clothes is outstanding. My kids look so stylish and the fabrics are incredibly soft. Worth every penny!"
//     },
//     {
//       name: "James L.",
//       role: "Father of 3",
//       rating: 5,
//       text: "Amazing customer service and beautiful designs. The winter collection kept my kids warm and fashionable all season."
//     },
//     {
//       name: "Emma R.",
//       role: "Mother of 1",
//       rating: 5,
//       text: "I love how Childrensalon combines luxury with comfort. The attention to detail in every piece is remarkable."
//     }
//   ];

//   const filteredProducts = selectedCategory === "All"
//     ? newInProducts
//     : newInProducts.filter(product => {
//         if (selectedCategory === "Girls") return product.category?.name?.toLowerCase().includes("girl");
//         if (selectedCategory === "Boys") return product.category?.name?.toLowerCase().includes("boy");
//         if (selectedCategory === "Baby") return product.category?.name?.toLowerCase().includes("baby");
//         if (selectedCategory === "Accessories") return product.category?.name?.toLowerCase().includes("accessories");
//         return true;
//       });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />

//       {/* Hero Video Section */}
//       <section className="luxury-hero relative bg-black text-white overflow-hidden">
//         <video
//           className="absolute inset-0 w-full h-full object-cover"
//           autoPlay
//           muted
//           loop
//           playsInline
//           preload="metadata"
//         >
//           <source src="/video1.mp4" type="video/mp4" />
//           <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-60"></div>
//         </video>
//         <div className="relative z-10 container mx-auto text-center px-4 py-8 md:py-20 min-h-[70vh] md:min-h-screen flex items-center justify-center">
//           <div className="max-w-4xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 md:mb-6 text-gold-400 drop-shadow-lg">
//               {slides[0].title}
//             </h1>
//             <p className="text-lg sm:text-xl mb-6 md:mb-8 max-w-2xl mx-auto font-serif drop-shadow-md">
//               {slides[0].subtitle}
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
//               <button className="bg-gold-600 hover:bg-gold-700 text-white px-8 py-4 rounded-full font-serif font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
//                 Shop Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Categories Slider */}
//       <section className="luxury-categories bg-white py-12 md:py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-black mb-8 md:mb-12">
//             Shop by Category
//           </h2>
//           <div className="relative overflow-hidden">
//             <div className="flex animate-slide space-x-6 md:space-x-8">
//               {categories.concat(categories).map((category, index) => (
//                 <div key={`${category.id}-${index}`} className="flex-shrink-0 w-48 md:w-64 bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-center cursor-pointer"
//                   onClick={() => setSelectedCategory(category.name)}
//                 >
//                   <div className="text-6xl md:text-8xl mb-4">
//                     {category.name.toLowerCase().includes('girl') ? '👗' :
//                      category.name.toLowerCase().includes('boy') ? '👔' :
//                      category.name.toLowerCase().includes('baby') ? '🍼' :
//                      category.name.toLowerCase().includes('accessories') ? '🧣' : '👕'}
//                   </div>
//                   <h3 className="text-lg md:text-xl font-serif font-semibold mb-2">
//                     {category.name}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-4">
//                     Discover our {category.name.toLowerCase()} collection
//                   </p>
//                   <button className="bg-gold-600 text-white px-4 py-2 rounded hover:bg-gold-700 transition duration-300 font-serif">
//                     Shop Now
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Filtered Products Section */}
//       {selectedCategory !== "All" && (
//         <section className="luxury-filtered-products bg-gray-50">
//           <div className="container mx-auto px-4 py-12 md:py-16">
//             <div className="flex items-center justify-between mb-8 md:mb-12">
//               <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
//                 {selectedCategory} Collection
//               </h2>
//               <button
//                 className="bg-black text-white px-6 py-3 font-serif hover:bg-gray-800 transition duration-300"
//                 onClick={() => setSelectedCategory("All")}
//               >
//                 View All Categories
//               </button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//               {filteredProducts.map((product) => (
//                 <Link key={product.id} href={`/product/${product.id}`}>
//                   <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer">
//                     <div className="mb-4 text-center">
//                       <img
//                         alt={product.name}
//                         className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg mx-auto"
//                         src={product.thumbnail}
//                       />
//                     </div>

//                     <h3 className="text-lg md:text-xl font-serif font-semibold mb-2 text-center">
//                       {product.name}
//                     </h3>
//                     <p className="text-sm text-gray-600 mb-2 text-center">
//                       {product.description}
//                     </p>
//                     <p className="text-xl md:text-2xl font-bold text-[#cda434] mb-4 text-center">
//                       £{product.price}
//                     </p>
//                     <button className="bg-gold-600 text-white px-4 py-2 rounded hover:bg-gold-700 transition duration-300 block text-center font-serif w-full">
//                       View Details
//                     </button>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Featured Products */}
//       <section className="luxury-featured bg-gray-50">
//         <div className="container mx-auto px-4 py-12 md:py-16">
//           <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-black mb-8 md:mb-12">
//             Featured Products
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//             {featuredProducts.map((product) => (
//               <Link key={product._id} href={`/product/${product._id}`}>
//                 <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer">
//                   <div className="mb-4 text-center">
//                     <img
//                       alt={product.name}
//                       className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg mx-auto"
//                       src={product.thumbnail}
//                     />
//                   </div>

//                   <h3 className="text-lg md:text-xl font-serif font-semibold mb-2 text-center">
//                     {product.name}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-2 text-center">
//                     {product.description}
//                   </p>
//                   <p className="text-xl md:text-2xl font-bold text-[#cda434] mb-4 text-center">
//                     £{product.price}
//                   </p>
//                   <button className="bg-gold-600 text-white px-4 py-2 rounded hover:bg-gold-700 transition duration-300 block text-center font-serif w-full">
//                     View Details
//                   </button>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Best Sellers */}
//       <section className="luxury-best-sellers bg-white">
//         <div className="container mx-auto px-4 py-12 md:py-16">
//           <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-black mb-8 md:mb-12">
//             Best Sellers
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//             {/* Best sellers would go here */}
//           </div>
//         </div>
//       </section>

//       {/* Seasonal Section */}
//       <section className="luxury-seasonal bg-gradient-to-r from-pink-50 to-purple-50">
//         <div className="container mx-auto px-4 py-12 md:py-16">
//           <div className="text-center mb-8 md:mb-12">
//             <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
//               Winter Wonderland
//             </h2>
//             <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-serif">
//               Discover our exclusive winter collection featuring cozy knits, festive dresses, and holiday-ready outfits for your little ones.
//             </p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//             <div className="text-center">
//               <div className="text-6xl md:text-8xl mb-4">❄️</div>
//               <h3 className="text-xl md:text-2xl font-serif font-semibold mb-2">Cozy Winter Wear</h3>
//               <p className="text-gray-600 font-serif">Warm jackets, sweaters, and boots perfect for chilly days.</p>
//             </div>
//             <div className="text-center">
//               <div className="text-6xl md:text-8xl mb-4">🎄</div>
//               <h3 className="text-xl md:text-2xl font-serif font-semibold mb-2">Holiday Collection</h3>
//               <p className="text-gray-600 font-serif">Festive outfits and party dresses for special occasions.</p>
//             </div>
//             <div className="text-center">
//               <div className="text-6xl md:text-8xl mb-4">🧣</div>
//               <h3 className="text-xl md:text-2xl font-serif font-semibold mb-2">Accessories</h3>
//               <p className="text-gray-600 font-serif">Scarves, hats, and gloves to complete the winter look.</p>
//             </div>
//           </div>
//           <div className="text-center mt-8 md:mt-12">
//             <a className="bg-black text-white px-8 py-3 font-serif hover:bg-gray-800 transition duration-300 inline-block" href="/product?category=seasonal">
//               Explore Winter Collection
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Reviews Section */}
//       <section className="luxury-reviews bg-white">
//         <div className="container mx-auto px-4 py-12 md:py-16">
//           <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-black mb-8 md:mb-12">
//             What Parents Say
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//             {reviews.map((review, index) => (
//               <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
//                 <div className="flex items-center mb-4">
//                   <div className="text-4xl mr-4">
//                     {"⭐".repeat(review.rating)}
//                   </div>
//                   <div>
//                     <h4 className="font-serif font-semibold">{review.name}</h4>
//                     <p className="text-sm text-gray-600">{review.role}</p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 font-serif italic">
//                   "{review.text}"
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Newsletter */}
//       <section className="luxury-newsletter bg-black text-white">
//         <div className="container mx-auto px-4 py-12 md:py-16 text-center">
//           <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//             Stay in Style
//           </h2>
//           <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4 font-serif">
//             Subscribe to our newsletter for the latest luxury kidswear updates and exclusive offers.
//           </p>
//           <div className="max-w-md mx-auto">
//             <div className="flex flex-col sm:flex-row">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-800 focus:outline-none mb-3 sm:mb-0"
//               />
//               <button className="bg-gold-600 text-white px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none font-serif hover:bg-gold-700 transition duration-300">
//                 Subscribe
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="luxury-footer bg-black text-white">
//         <div className="container mx-auto px-4 py-8 md:py-12">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
//             <div>
//               <h3 className="text-xl md:text-2xl font-serif font-bold mb-4 text-gold-600">
//                 Childrensalon Clone
//               </h3>
//               <p className="text-gray-300 text-sm md:text-base font-serif">
//                 Luxury kidswear for the discerning child.
//               </p>
//               <div className="flex space-x-3 md:space-x-4 mt-4">
//                 <span className="text-xl md:text-2xl">📘</span>
//                 <span className="text-xl md:text-2xl">🐦</span>
//                 <span className="text-xl md:text-2xl">📷</span>
//                 <span className="text-xl md:text-2xl">💼</span>
//               </div>
//             </div>
//             <div>
//               <h4 className="text-lg font-serif font-semibold mb-4">Shop</h4>
//               <ul className="space-y-2 text-gray-300 text-sm md:text-base font-serif">
//                 <li><a className="hover:text-gold-600" href="/product?category=girls">Girls</a></li>
//                 <li><a className="hover:text-gold-600" href="/product?category=boys">Boys</a></li>
//                 <li><a className="hover:text-gold-600" href="/product?category=new-in">New In</a></li>
//                 <li><a className="hover:text-gold-600" href="/product?category=designers">Designers</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-serif font-semibold mb-4">Support</h4>
//               <ul className="space-y-2 text-gray-300 text-sm md:text-base font-serif">
//                 <li><a className="hover:text-gold-600" href="/size-guide">Size Guide</a></li>
//                 <li><a className="hover:text-gold-600" href="/shipping">Shipping Info</a></li>
//                 <li><a className="hover:text-gold-600" href="/returns">Returns</a></li>
//                 <li><a className="hover:text-gold-600" href="/faq">FAQ</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-lg font-serif font-semibold mb-4">Contact</h4>
//               <ul className="space-y-2 text-gray-300 text-sm md:text-base font-serif">
//                 <li>📧 hello@childrensalon.com</li>
//                 <li>📞 +44 (20) 123-4567</li>
//                 <li>📍 123 Luxury St, London</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400">
//             <p className="text-sm md:text-base font-serif">
//               © 2024 Childrensalon Clone. All rights reserved. Made with ❤️ for luxury kidswear.
//             </p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // adjust path if needed
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
          <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto">Subscribe to our newsletter for the latest luxury kidswear updates and exclusive offers.</p>
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-800"
              />
              <button className="bg-gold-600 text-white px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-gold-600 mb-2">Childrensalon Clone</h3>
              <p className="text-gray-300 text-sm">Luxury kidswear for the discerning child.</p>
            </div>
            <div>
              <h4 className="text-sm font-serif font-semibold mb-2">Shop</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><Link href="/product?category=girls"><a>Girls</a></Link></li>
                <li><Link href="/product?category=boys"><a>Boys</a></Link></li>
                <li><Link href="/product?category=new-in"><a>New In</a></Link></li>
                <li><Link href="/product?category=designers"><a>Designers</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-serif font-semibold mb-2">Support</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li><Link href="/size-guide"><a>Size Guide</a></Link></li>
                <li><Link href="/shipping"><a>Shipping Info</a></Link></li>
                <li><Link href="/returns"><a>Returns</a></Link></li>
                <li><Link href="/faq"><a>FAQ</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-serif font-semibold mb-2">Contact</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>📧 hello@childrensalon.com</li>
                <li>📞 +44 (20) 123-4567</li>
                <li>📍 123 Luxury St, London</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p className="text-sm">© 2025 Childrensalon Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
