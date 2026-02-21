import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { orderId } = body || {};
  if (!orderId) {
    return NextResponse.json({ success: false, error: "Missing orderId" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: user.id },
  });
  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentStatus: "PAID", status: "PAID" },
  });

  return NextResponse.json({
    success: true,
    data: { clientSecret: `test_${orderId}` },
  });
}