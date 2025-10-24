
import { notFound } from 'next/navigation';
import CategoryProductsClient from './CategoryProductsClient';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';

// ✅ Static params generation for SSG (optional)
export async function generateStaticParams() {
  try {
    const categories = await categoryService.getAll();
    if (categories?.data?.length > 0) {
      return categories.data.map((cat) => ({ categoryId: cat._id.toString() }));
    }
    return [];
  } catch (err) {
    console.error('Error generating static params:', err);
    return [];
  }
}

// ✅ Main Server Component
export default async function CategoryPage({ params }) {
  const { categoryId } = params;

  try {
    if (!categoryId) notFound();

    // 🧱 Fetch Category Details via Service
    const categoryRes = await categoryService.getById(categoryId);

    if (!categoryRes?.success || !categoryRes?.data) notFound();

    const category = categoryRes.data;

    // 🧱 Fetch Products via Service
    const productRes = await productService.getByCategory(categoryId, {
      page: 1,
      limit: 12,
      sort: 'createdAt',
      order: 'desc',
    });

    const initialProducts = productRes?.data?.products || [];
    const initialPagination = productRes?.data?.pagination || {};

    // 🧱 SEO Metadata
    const metadata = {
      title: `${category.name} - TinyFashion`,
      description:
        category.description ||
        `Discover our exclusive range of ${category.name.toLowerCase()} apparel and accessories — premium quality, timeless style.`,
    };

    return (
      <>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        {category.image && <meta property="og:image" content={category.image} />}

        <CategoryProductsClient
          categoryId={categoryId}
          initialCategory={category}
          initialProducts={initialProducts}
          initialPagination={initialPagination}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
