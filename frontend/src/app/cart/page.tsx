"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";

// Icons
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

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
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const loadCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/cart/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.data);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (itemId: string, quantity: number) => {
    if (!token || quantity < 1) return;
    setUpdatingId(itemId);
    try {
      const res = await fetch("/api/cart/items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
      } else {
        alert(data.error || "อัปเดตจำนวนไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!token) return;
    if (!confirm("ต้องการลบสินค้านี้ออกจากตะกร้า?")) return;

    try {
      const res = await fetch("/api/cart/items", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCart(data.data);
      } else {
        alert(data.error || "ลบสินค้าไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <UserIcon className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">กรุณาเข้าสู่ระบบ</h2>
          <p className="mt-2 text-slate-600">เพื่อดูตะกร้าสินค้าของคุณ</p>
          <Link href="/login" className="btn btn-primary mt-6">
            เข้าสู่ระบบ
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-600">กำลังโหลดตะกร้า...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <ShoppingBagIcon className="h-10 w-10 text-slate-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">ตะกร้าว่างเปล่า</h2>
          <p className="mt-2 text-slate-600">เริ่มช้อปปิ้งเพื่อเพิ่มสินค้าลงตะกร้า</p>
          <Link href="/products" className="btn btn-primary mt-6">
            <ShoppingBagIcon className="h-4 w-4" />
            ดูสินค้า
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, i) => sum + i.priceAtTime * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="animate-fade-in">
      <h1 className="section-title mb-6">ตะกร้าสินค้า</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="card flex gap-4">
              {/* Product Image Placeholder */}
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <ShoppingBagIcon className="h-10 w-10 text-slate-300" />
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.product?.name || "สินค้า"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      ราคาต่อชิ้น: ฿{item.priceAtTime.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn btn-ghost p-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                    title="ลบสินค้า"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingId === item.id}
                      className="qty-btn h-8 w-8"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">
                      {updatingId === item.id ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      disabled={updatingId === item.id}
                      className="qty-btn h-8 w-8"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <div className="font-bold text-indigo-600">
                      ฿{(item.priceAtTime * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <Link href="/products" className="btn btn-outline w-full">
            <ShoppingBagIcon className="h-4 w-4" />
            เลือกซื้อสินค้าต่อ
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">สรุปคำสั่งซื้อ</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>ยอดรวมสินค้า ({cart.items.length} รายการ)</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ค่าจัดส่ง</span>
                <span className={shipping === 0 ? "text-emerald-600" : ""}>
                  {shipping === 0 ? "ฟรี" : `฿${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                  เพิ่มอีก ฿{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()} เพื่อรับส่งฟรี!
                </div>
              )}
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวมทั้งหมด</span>
                  <span className="text-indigo-600">฿{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="รหัสโปรโมชั่น"
                  className="input pl-9 text-sm py-2"
                />
              </div>
              <button className="btn btn-outline text-sm py-2">
                ใช้
              </button>
            </div>

            {/* Checkout Button */}
            <Link 
              href="/checkout" 
              className="btn btn-primary w-full mt-4"
            >
              ดำเนินการชำระเงิน
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <p className="mt-3 text-center text-xs text-slate-500">
              การชำระเงินที่ปลอดภัยโดย TestShop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
