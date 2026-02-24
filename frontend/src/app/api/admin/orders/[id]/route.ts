import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/middleware/admin";

// GET /api/admin/orders/:id - ดูรายละเอียดออเดอร์
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json(
      { success: false, error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      ...order,
      subtotal: Number(order.subtotal),
      totalAmount: Number(order.totalAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        subtotal: Number(item.subtotal),
      })),
    },
  });
}

// PATCH /api/admin/orders/:id - อัพเดทสถานะออเดอร์
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();
    const { status, paymentStatus } = body;

    // Validate status
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const validPaymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { success: false, error: `Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
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
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedOrder,
        subtotal: Number(updatedOrder.subtotal),
        totalAmount: Number(updatedOrder.totalAmount),
        items: updatedOrder.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })),
      },
    });
  } catch (error) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
