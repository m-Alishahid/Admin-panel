import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';

export default function ProductsPage() {
  const dummyData = {
    hero: {
      title: "Fashion Collection",
      subtitle: "Style your life",
      description: "Discover our curated collection of trendy clothing and accessories for every occasion."
    },
    categories: [
      { id: 1, name: "Women", icon: "👩", count: 45, link: "/product?category=women" },
      { id: 2, name: "Men", icon: "👨", count: 38, link: "/product?category=men" },
      { id: 3, name: "Kids", icon: "👶", count: 22, link: "/product?category=kids" },
      { id: 4, name: "Accessories", icon: "👜", count: 31, link: "/product?category=accessories" }
    ],
    products: [
      { id: 1, name: "Floral Summer Dress", price: "$49.99", image: "👗", rating: 4.5, reviews: 128, category: "Women", description: "Beautiful floral print dress perfect for summer outings." },
      { id: 2, name: "Classic White T-Shirt", price: "$19.99", image: "👕", rating: 4.7, reviews: 89, category: "Men", description: "Essential cotton t-shirt for everyday wear." },
      { id: 3, name: "Designer Denim Jeans", price: "$79.99", image: "👖", rating: 4.3, reviews: 156, category: "Unisex", description: "Premium quality jeans with perfect fit." },
      { id: 4, name: "Leather Handbag", price: "$89.99", image: "👜", rating: 4.6, reviews: 203, category: "Accessories", description: "Elegant leather handbag for all occasions." },
      { id: 5, name: "Kids Party Dress", price: "$39.99", image: "👗", rating: 4.4, reviews: 67, category: "Kids", description: "Adorable dress for special occasions." },
      { id: 6, name: "Stylish Sneakers", price: "$69.99", image: "👟", rating: 4.2, reviews: 94, category: "Footwear", description: "Comfortable sneakers with modern design." },
      { id: 7, name: "Silk Scarf", price: "$29.99", image: "🧣", rating: 4.8, reviews: 45, category: "Accessories", description: "Luxurious silk scarf for elegant styling." },
      { id: 8, name: "Casual Hoodie", price: "$44.99", image: "🧥", rating: 4.1, reviews: 112, category: "Men", description: "Cozy hoodie perfect for casual wear." }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-20">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{dummyData.hero.title}</h1>
            <p className="text-xl mb-4">{dummyData.hero.subtitle}</p>
            <p className="text-lg max-w-2xl mx-auto">{dummyData.hero.description}</p>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {dummyData.categories.map(category => (
                <Link key={category.id} href={category.link} className="bg-gray-50 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count} items</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">All Products</h2>
              <div className="flex items-center space-x-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {dummyData.products.map(product => (
                <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                  <div className="text-8xl mb-4 text-center">{product.image}</div>
                  <div className="mb-2">
                    <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <Link href={`/product/${product.id}`} className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
