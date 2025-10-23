import Link from 'next/link';

export default function Footer() {
  return (
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
  );
}
