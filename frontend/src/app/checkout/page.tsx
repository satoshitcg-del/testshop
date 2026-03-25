"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";

// Icons
function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function ExclamationCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/cart/items", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCart(data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleCheckout = async () => {
    if (!token) {
      setMessage("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    if (!cart || cart.items.length === 0) {
      setMessage("ตะกร้าว่างเปล่า");
      return;
    }
    setProcessing(true);
    setMessage(null);

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setMessage(orderData.error || "สร้างออเดอร์ไม่สำเร็จ");
        setProcessing(false);
        return;
      }

      const newOrderId = orderData.data.id;
      setOrderId(newOrderId);

      const payRes = await fetch("/api/payments/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: newOrderId }),
      });
      const payData = await payRes.json();

      if (payData.success) {
        setSuccess(true);
        setMessage("ชำระเงินสำเร็จ! ขอบคุณที่สั่งซื้อ");
      } else {
        setMessage("ชำระเงินไม่สำเร็จ กรุณาลองใหม่");
      }
    } catch {
      setMessage("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setProcessing(false);
    }
  };

  const subtotal = cart ? cart.items.reduce((sum, i) => sum + i.priceAtTime * i.quantity, 0) : 0;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center animate-fade-in">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">สั่งซื้อสำเร็จ!</h1>
          <p className="text-slate-600 mb-2">{message}</p>
          {orderId && (
            <p className="text-sm text-slate-500 mb-6">
              หมายเลขคำสั่งซื้อ: <span className="font-mono font-medium">{orderId}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders" className="btn btn-primary">
              ดูคำสั่งซื้อ
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href="/products" className="btn btn-outline">
              <ShoppingBagIcon className="h-4 w-4" />
              ช้อปต่อ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <ShoppingBagIcon className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">กรุณาเข้าสู่ระบบ</h2>
          <p className="mt-2 text-slate-600">เพื่อดำเนินการชำระเงิน</p>
          <Link href="/login" className="btn btn-primary mt-6">
            เข้าสู่ระบบ
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
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
          <p className="mt-2 text-slate-600">เพิ่มสินค้าลงตะกร้าก่อนชำระเงิน</p>
          <Link href="/products" className="btn btn-primary mt-6">
            <ShoppingBagIcon className="h-4 w-4" />
            ดูสินค้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="section-title mb-6">ชำระเงิน</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Method */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">วิธีการชำระเงิน</h2>
            
            <div className="space-y-3">
              {/* Credit Card Option */}
              <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50 cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-indigo-600" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <CreditCardIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">บัตรเครดิต/เดบิต (Test Mode)</div>
                  <div className="text-xs text-slate-500">ชำระเงินแบบจำลองสำหรับการทดสอบ</div>
                </div>
              </label>

              {/* Other Options - Disabled */}
              <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" disabled className="h-4 w-4" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">โอนเงินผ่านธนาคาร</div>
                  <div className="text-xs text-slate-500">ไม่พร้อมใช้งานในโหมดทดสอบ</div>
                </div>
              </label>

              <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" disabled className="h-4 w-4" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">PromptPay / อื่นๆ</div>
                  <div className="text-xs text-slate-500">ไม่พร้อมใช้งานในโหมดทดสอบ</div>
                </div>
              </label>
            </div>
          </div>

          {/* Test Notice */}
          <div className="alert alert-info flex items-start gap-3">
            <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">โหมดทดสอบ</div>
              <div className="mt-1">
                ระบบนี้อยู่ในโหมดทดสอบ การชำระเงินจะไม่มีการตัดเงินจริง 
                ระบบจะจำลองการชำระเงินสำเร็จโดยอัตโนมัติ
              </div>
            </div>
          </div>
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

            {message && (
              <div className="mt-4 alert alert-error">
                {message}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={processing}
              className="btn btn-primary w-full mt-4"
            >
              {processing ? (
                <>
                  <div className="spinner" />
                  กำลังดำเนินการ...
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-4 w-4" />
                  ชำระเงิน (Test Mode)
                </>
              )}
            </button>

            <Link href="/cart" className="btn btn-outline w-full mt-3">
              กลับไปตะกร้าสินค้า
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
