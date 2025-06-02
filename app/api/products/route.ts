import { NextResponse } from "next/server";
import { connectDB, getProductById, getProducts } from "@/lib/db-service";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      const products = await getProducts();
      return NextResponse.json(products, { status: 200 });
    } else {
      const product = await getProductById(productId);
      return NextResponse.json(product, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
