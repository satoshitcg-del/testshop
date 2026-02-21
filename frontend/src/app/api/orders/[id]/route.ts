import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: user.id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...order,
      subtotal: Number(order.subtotal),
      totalAmount: Number(order.totalAmount),
      items: order.items.map((i) => ({
        ...i,
        price: Number(i.price),
        subtotal: Number(i.subtotal),
      })),
    },
  });
}