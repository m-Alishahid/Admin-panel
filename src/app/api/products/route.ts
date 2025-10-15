import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Mock data for products
let products = [
  { id: "1", name: "Wireless Headphones", price: 99.99, category: "Electronics", stock: 50 },
  { id: "2", name: "Smart Watch", price: 199.99, category: "Electronics", stock: 30 },
  { id: "3", name: "Running Shoes", price: 79.99, category: "Sports", stock: 100 },
];

export async function GET() {
  try {
    // In production, fetch from MongoDB
    // const client = await clientPromise;
    // const db = client.db("admin-panel");
    // const products = await db.collection("products").find({}).toArray();

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, category, stock } = body;

    if (!name || !price || !category || stock === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = {
      id: (products.length + 1).toString(),
      name,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
    };

    products.push(newProduct);

    // In production, save to MongoDB
    // const client = await clientPromise;
    // const db = client.db("admin-panel");
    // await db.collection("products").insertOne(newProduct);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
