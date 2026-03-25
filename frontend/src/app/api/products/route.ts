import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@prisma/client";

function normalizeProduct(p: Product) {
  return {
    ...p,
    price: Number(p.price),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").toLowerCase();

    const items = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: { items: items.map(normalizeProduct) },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}