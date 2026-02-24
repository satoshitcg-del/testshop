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

  if (quantity < 1) {
    return NextResponse.json({ success: false, error: "Quantity must be at least 1" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  }

  // Check stock availability
  if (product.stockQuantity < quantity) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}` 
      }, 
      { status: 400 }
    );
  }

  // Find or create cart
  let cart = await prisma.cart.findFirst({
    where: { userId: user.id },
  });
  
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  // Calculate total quantity after update
  const totalQuantity = existing ? existing.quantity + quantity : quantity;
  
  // Check if total quantity exceeds stock
  if (totalQuantity > product.stockQuantity) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Cannot add ${quantity} more. You already have ${existing?.quantity || 0} in cart. Available stock: ${product.stockQuantity}` 
      }, 
      { status: 400 }
    );
  }

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: totalQuantity },
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

  if (quantity < 1) {
    return NextResponse.json({ success: false, error: "Quantity must be at least 1" }, { status: 400 });
  }

  const item = await prisma.cartItem.findUnique({ 
    where: { id: itemId },
    include: { product: true }
  });
  
  if (!item) {
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  }

  // Check stock availability
  if (quantity > item.product.stockQuantity) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Insufficient stock. Available: ${item.product.stockQuantity}, Requested: ${quantity}` 
      }, 
      { status: 400 }
    );
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
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
