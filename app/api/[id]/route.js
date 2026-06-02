import connectMongoDB from "@/app/libs/mongoDB";
import Products from "@/app/models/products";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const product = await Products.findOne({ _id: id });
  return NextResponse.json({ product }, { status: 200 });
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

export async function POST(request, { params }) {
  const { id } = params;
  const { title, description, price, tags } = await request.json();
  await connectMongoDB();
  await Products.findByIdAndUpdate(id, {
    title,
    description,
    price,
    tags: normalizeTags(tags),
  });
  return NextResponse.json(
    { message: "Product updated successfully" },
    { status: 200 }
  );
}

export async function DELETE(request, { params }) {
  const { id } = params;
  console.log("DELETE", id);
  await connectMongoDB();
  await Products.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Product deleted successfully" },
    { status: 200 }
  );
}
