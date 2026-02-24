import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/middleware/admin";

// GET /api/admin/products/:id - ดูรายละเอียดสินค้า (admin view)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: { ...product, price: Number(product.price) },
  });
}

// PUT /api/admin/products/:id - แก้ไขสินค้า
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();
    const { name, slug, description, price, stockQuantity } = body;

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Product with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(stockQuantity !== undefined && { stockQuantity }),
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...product, price: Number(product.price) },
    });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/:id - ลบสินค้า
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if product is in any cart or order
    const inCart = await prisma.cartItem.findFirst({
      where: { productId: params.id },
    });
    const inOrder = await prisma.orderItem.findFirst({
      where: { productId: params.id },
    });

    if (inCart || inOrder) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete product that is in cart or order",
        },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
