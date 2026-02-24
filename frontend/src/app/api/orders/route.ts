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

  // Validate stock for all items
  const stockErrors: string[] = [];
  for (const item of cart.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      stockErrors.push(`Product not found for item ${item.productId}`);
    } else if (product.stockQuantity < item.quantity) {
      stockErrors.push(
        `${product.name}: Only ${product.stockQuantity} available, but you ordered ${item.quantity}`
      );
    }
  }

  if (stockErrors.length > 0) {
    return NextResponse.json(
      { success: false, error: "Insufficient stock", details: stockErrors },
      { status: 400 }
    );
  }

  // Build order items and deduct stock
  const items = cart.items.map((i) => {
    const product = products.find((p) => p.id === i.productId)!;
    return {
      productId: i.productId,
      productName: product.name,
      price: i.priceAtTime,
      quantity: i.quantity,
      subtotal: i.priceAtTime * i.quantity,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + Number(i.subtotal), 0);

  // Create order and deduct stock in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Deduct stock for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Create the order
    const newOrder = await tx.order.create({
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

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  return NextResponse.json({ success: true, data: normalizeOrder(order) });
}
