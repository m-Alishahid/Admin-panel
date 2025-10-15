import { NextRequest, NextResponse } from "next/server";

// Mock data for products (shared with route.ts)
let products = [
  { id: "1", name: "Wireless Headphones", price: 99.99, category: "Electronics", stock: 50 },
  { id: "2", name: "Smart Watch", price: 199.99, category: "Electronics", stock: 30 },
  { id: "3", name: "Running Shoes", price: 79.99, category: "Sports", stock: 100 },
];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // In production, fetch from MongoDB
    // const client = await clientPromise;
    // const db = client.db("admin-panel");
    // const product = await db.collection("products").findOne({ _id: new ObjectId(id) });

    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, price, category, stock } = body;

    if (!name || !price || !category || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In production, update in MongoDB
    // const client = await clientPromise;
    // const db = client.db("admin-panel");
    // await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: { name, price: parseFloat(price), category, stock: parseInt(stock) } });

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    products[index] = {
      ...products[index],
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
    };

    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // In production, delete from MongoDB
    // const client = await clientPromise;
    // const db = client.db("admin-panel");
    // await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    products.splice(index, 1);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
