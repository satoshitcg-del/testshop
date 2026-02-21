"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleCheckout = async () => {
    if (!token) {
      setMessage("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    setLoading(true);
    setMessage(null);

    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const orderData = await orderRes.json();
    if (!orderData.success) {
      setMessage(orderData.error || "สร้างออเดอร์ไม่สำเร็จ");
      setLoading(false);
      return;
    }

    const orderId = orderData.data.id;
    const payRes = await fetch("/api/payments/intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });
    const payData = await payRes.json();

    if (payData.success) {
      setMessage(`ชำระเงินสำเร็จ (Test) - ${payData.data.clientSecret}`);
    } else {
      setMessage("ชำระเงินไม่สำเร็จ");
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <p className="mt-2 text-slate-600">นี่คือโหมดทดสอบ (Test mode)</p>
      <button className="btn btn-primary mt-4" onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>
      {message && <div className="mt-3 text-sm">{message}</div>}
    </div>
  );
}