import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/middleware/admin";

// GET /api/admin/orders - ดูออเดอร์ทั้งหมด (ของทุก user)
export async function GET(req: Request) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      items: orders.map((order) => ({
        ...order,
        subtotal: Number(order.subtotal),
        totalAmount: Number(order.totalAmount),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}
