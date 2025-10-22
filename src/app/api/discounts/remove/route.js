// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Discount from '@/Models/Discount';
// import Product from '@/Models/Product';

// export async function DELETE(request) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const discountId = searchParams.get('discountId');

//     // Get discount details
//     const discount = await Discount.findById(discountId);
//     if (!discount) {
//       return NextResponse.json(
//         { success: false, error: 'Discount not found' },
//         { status: 404 }
//       );
//     }

//     // Remove discount from products
//     let filter = {};
//     switch (discount.scope) {
//       case 'all':
//         filter = { discountedPrice: { $gt: 0 } };
//         break;
//       case 'category':
//         filter = { category: discount.category, discountedPrice: { $gt: 0 } };
//         break;
//       case 'selected':
//         filter = { _id: { $in: discount.products }, discountedPrice: { $gt: 0 } };
//         break;
//     }

//     // Reset discounted prices
//     await Product.updateMany(filter, {
//       $set: {
//         discountedPrice: 0,
//         discountPercentage: 0
//       }
//     });

//     // Update discount status
//     await Discount.findByIdAndUpdate(discountId, {
//       status: 'Inactive'
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Discount removed successfully'
//     });

//   } catch (error) {
//     console.error('Remove Discount Error:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to remove discount' },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Discount from '@/Models/Discount';

export async function POST(request) {
  try {
    await connectDB();
    const { discountId } = await request.json();

    if (!discountId) {
      return NextResponse.json(
        { success: false, error: 'Discount ID is required' },
        { status: 400 }
      );
    }

    const discount = await Discount.findById(discountId);
    if (!discount) {
      return NextResponse.json(
        { success: false, error: 'Discount not found' },
        { status: 404 }
      );
    }

    // ✅ Remove discount and restore original prices
    await discount.manualRemove();

    return NextResponse.json({
      success: true,
      message: 'Discount removed successfully and original prices restored'
    });

  } catch (error) {
    console.error('Remove Discount Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove discount' },
      { status: 500 }
    );
  }
}