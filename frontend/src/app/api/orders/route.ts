import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

function normalizeOrder(order: any) {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    totalAmount: Number(order.totalAmount),
    items: order.items.map((i: any) => ({
      ...i,
      price: Number(i.price),
      subtotal: Number(i.subtotal),
    })),
  };
}

export async function GET(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: { items: orders.map(normalizeOrder) } });
}

export async function POST(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: cart.items.map((i) => i.productId) } },
  });

  const items = cart.items.map((i) => {
    const product = products.find((p) => p.id === i.productId);
    return {
      productId: i.productId,
      productName: product?.name || "Unknown",
      price: i.priceAtTime,
      quantity: i.quantity,
      subtotal: i.priceAtTime * i.quantity,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "PENDING",
      paymentStatus: "PENDING",
      subtotal,
      totalAmount: subtotal,
      items: { create: items },
    },
    include: { items: true },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return NextResponse.json({ success: true, data: normalizeOrder(order) });
}