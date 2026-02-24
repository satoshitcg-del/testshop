import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/middleware/admin";

// GET /api/admin/products - ดูสินค้าทั้งหมด (พร้อมสต็อก)
export async function GET(req: Request) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    success: true,
    data: {
      items: products.map((p) => ({
        ...p,
        price: Number(p.price),
      })),
    },
  });
}

// POST /api/admin/products - สร้างสินค้าใหม่
export async function POST(req: Request) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();
    const { name, slug, description, price, stockQuantity } = body;

    // Validate required fields
    if (!name || !slug || !description || price === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { success: false, error: "Slug must contain only lowercase letters, numbers, and hyphens" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Product with this slug already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stockQuantity: stockQuantity || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...product, price: Number(product.price) },
    });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    );
  }
}
