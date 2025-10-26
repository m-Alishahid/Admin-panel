// app/api/invoices/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Invoice from '@/Models/Invoice';
import connectDB from '@/lib/mongodb';

// GET invoice by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const invoice = await Invoice.findById(id)
      .populate('vendor', 'companyName contactPerson phone address')
      .populate('createdBy', 'firstName lastName email')
      .populate('items.product', 'name images costPrice salePrice');

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE invoice
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();

    const invoice = await Invoice.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    )
    .populate('vendor', 'companyName contactPerson')
    .populate('createdBy', 'firstName lastName');

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE invoice
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}