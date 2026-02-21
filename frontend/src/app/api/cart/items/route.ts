import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

function normalizeCart(cart: any) {
  if (!cart) return null;
  return {
    ...cart,
    items: cart.items.map((i: any) => ({
      ...i,
      priceAtTime: Number(i.priceAtTime),
      product: i.product
        ? {
            ...i.product,
            price: Number(i.product.price),
          }
        : null,
    })),
  };
}

export async function GET(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  const data = cart ? normalizeCart(cart) : { userId: user.id, items: [] };
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { productId, quantity } = body || {};
  if (!productId || !quantity) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }

  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        priceAtTime: product.price,
      },
    });
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ success: true, data: normalizeCart(updated) });
}

export async function PATCH(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { itemId, quantity } = body || {};
  if (!itemId || typeof quantity !== "number") {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) {
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: Math.max(1, quantity) },
  });

  const cart = await prisma.cart.findUnique({
    where: { id: updatedItem.cartId },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json({ success: true, data: normalizeCart(cart) });
}

export async function DELETE(req: Request) {
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { itemId } = body || {};
  if (!itemId) {
    return NextResponse.json({ success: false, error: "Missing itemId" }, { status: 400 });
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  const cart = await prisma.cart.findFirst({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  const data = cart ? normalizeCart(cart) : { userId: user.id, items: [] };
  return NextResponse.json({ success: true, data });
}