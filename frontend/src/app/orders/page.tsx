"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setOrders(data.data.items || []));
  }, []);

  if (!token) return <div>กรุณาเข้าสู่ระบบก่อน</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      {orders.length === 0 ? (
        <div>ยังไม่มีคำสั่งซื้อ</div>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="card">
            <div className="font-medium">Order: {o.id}</div>
            <div className="text-sm text-slate-600">Status: {o.status}</div>
            <div className="text-sm text-slate-600">Payment: {o.paymentStatus}</div>
            <div className="text-sm text-slate-600">Total: ฿{o.totalAmount}</div>
          </div>
        ))
      )}
    </div>
  );
}