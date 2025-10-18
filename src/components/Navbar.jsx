import Link from 'next/link';

export default function Navbar() {
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
            <Link href="/product?category=women" className="text-gray-700 hover:text-pink-600 transition duration-300">Women</Link>
            <Link href="/product?category=men" className="text-gray-700 hover:text-pink-600 transition duration-300">Men</Link>
            <Link href="/product?category=kids" className="text-gray-700 hover:text-pink-600 transition duration-300">Kids</Link>
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
