import connectMongoDB from "@/app/libs/mongoDB";
import Products from "@/app/models/products";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const products = await Products.find();
  return NextResponse.json({ products }, { status: 200 });
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

export async function POST(request) {
  const { title, description, price, tags } = await request.json();
  await connectMongoDB();
  await Products.create({
    title,
    description,
    price,
    tags: normalizeTags(tags),
  });
  return NextResponse.json(
    { message: "Product created successfully" },
    { status: 200 }
  );
}
