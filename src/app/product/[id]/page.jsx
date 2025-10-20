import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import Link from 'next/link';

export default function ProductDetailPage({ params }) {
  const { id } = params;

  const dummyData = {
    1: { name: "Product A", price: "$10.00", description: "A great product.", details: "More details about Product A." },
    2: { name: "Product B", price: "$20.00", description: "Another great product.", details: "More details about Product B." },
    3: { name: "Product C", price: "$30.00", description: "Yet another great product.", details: "More details about Product C." }
  };

  const product = dummyData[id];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p>The product with ID {id} does not exist.</p>
          <Link href="/product" className="text-blue-500 hover:underline">
            Back to Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-2">{product.price}</p>
        <p className="mb-4">{product.description}</p>
        <p>{product.details}</p>
        <Link href="/product" className="text-blue-500 hover:underline">
          Back to Products
        </Link>
      </main>
      <Footer />
    </div>
  );
}
