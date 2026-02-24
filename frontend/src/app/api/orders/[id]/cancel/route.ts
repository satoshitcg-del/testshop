import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// POST /api/orders/:id/cancel - ยกเลิกออเดอร์ (เฉพาะเจ้าของ)
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const order = await prisma.order.findFirst({
      where: { id: params.id, userId: user.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Can only cancel if status is PENDING or PROCESSING
    if (order.status !== "PENDING" && order.status !== "PROCESSING") {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot cancel order with status: ${order.status}`,
        },
        { status: 400 }
      );
    }

    // Can only cancel if not paid (or refund needed)
    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot cancel paid order. Please contact support for refund.",
        },
        { status: 400 }
      );
    }

    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity,
          },
        },
      });
    }

    const cancelledOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "CANCELLED",
        paymentStatus: order.paymentStatus === "PENDING" ? "FAILED" : order.paymentStatus,
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        ...cancelledOrder,
        subtotal: Number(cancelledOrder.subtotal),
        totalAmount: Number(cancelledOrder.totalAmount),
        items: cancelledOrder.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })),
      },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
