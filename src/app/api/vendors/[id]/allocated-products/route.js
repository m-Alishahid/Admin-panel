// app/api/vendors/[id]/allocated-products/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import Vendor from '@/Models/Vendor';
import connectDB from '@/lib/mongodb';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession(request);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get vendor with populated products
    const vendor = await Vendor.findById(id)
      .populate({
        path: 'products.product',
        select: 'name description images costPrice salePrice category'
      });

    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Check access rights
    if (session.user.role === 'vendor' || session.user.isVendor) {
      if (vendor.user.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Filter only active products
    const activeProducts = vendor.products.filter(p => 
      p.status === 'Active' && p.currentStock > 0
    );

    return NextResponse.json({
      success: true,
      data: {
        products: activeProducts,
        totalProducts: activeProducts.length,
        totalStock: activeProducts.reduce((sum, p) => sum + p.currentStock, 0)
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}