"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  priceAtTime: number;
  product?: {
    name: string;
    price: number;
  } | null;
};

type Cart = {
  userId: string;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCart = async () => {
    if (!token) return;
    const res = await fetch("/api/cart/items", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCart(data.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (itemId: string, quantity: number) => {
    await fetch("/api/cart/items", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, quantity }),
    });
    loadCart();
  };

  const removeItem = async (itemId: string) => {
    await fetch("/api/cart/items", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId }),
    });
    loadCart();
  };

  if (!token) return <div>กรุณาเข้าสู่ระบบก่อน</div>;
  if (!cart) return <div>Loading...</div>;

  const subtotal = cart.items.reduce((sum, i) => sum + i.priceAtTime * i.quantity, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {cart.items.length === 0 ? (
        <div>ตะกร้าว่าง</div>
      ) : (
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{item.product?.name || item.productId}</div>
                <div className="text-sm text-slate-600">฿{item.priceAtTime}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-outline" onClick={() => updateQty(item.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button className="btn btn-outline" onClick={() => updateQty(item.id, item.quantity + 1)}>
                  +
                </button>
                <button className="btn btn-outline" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="font-semibold">Subtotal</div>
            <div className="font-semibold">฿{subtotal}</div>
          </div>
          <a className="btn btn-primary" href="/checkout">
            Checkout
          </a>
        </div>
      )}
    </div>
  );
}