"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Icons
function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: string;
};

const statusLabels: Record<string, string> = {
  PENDING: "รอดำเนินการ",
  PROCESSING: "กำลังจัดเตรียม",
  SHIPPED: "จัดส่งแล้ว",
  DELIVERED: "จัดส่งสำเร็จ",
  CANCELLED: "ยกเลิก",
};

const statusColors: Record<string, string> = {
  PENDING: "badge-warning",
  PROCESSING: "badge-info",
  SHIPPED: "badge-success",
  DELIVERED: "badge-success",
  CANCELLED: "badge-danger",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "รอชำระ",
  PAID: "ชำระแล้ว",
  FAILED: "ชำระไม่สำเร็จ",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    fetch("/api/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.items)) {
          setOrders(data.data.items);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return o.status !== "CANCELLED" && o.status !== "DELIVERED";
    if (filter === "completed") return o.status === "DELIVERED";
    if (filter === "cancelled") return o.status === "CANCELLED";
    return true;
  });

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <UserIcon className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">กรุณาเข้าสู่ระบบ</h2>
          <p className="mt-2 text-slate-600">เพื่อดูประวัติคำสั่งซื้อของคุณ</p>
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
          <p className="text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">คำสั่งซื้อของฉัน</h1>
          <p className="mt-1 text-slate-600">
            คำสั่งซื้อทั้งหมด: <span className="font-semibold text-indigo-600">{orders.length}</span> รายการ
          </p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "ทั้งหมด" },
            { key: "active", label: "ดำเนินการ" },
            { key: "completed", label: "สำเร็จ" },
            { key: "cancelled", label: "ยกเลิก" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ClipboardListIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">ไม่มีคำสั่งซื้อ</h3>
          <p className="text-slate-500">
            {filter === "all" 
              ? "คุณยังไม่มีคำสั่งซื้อ เริ่มช้อปปิ้งกันเลย!" 
              : "ไม่มีคำสั่งซื้อในหมวดหมู่นี้"}
          </p>
          {filter === "all" && (
            <Link href="/products" className="btn btn-primary mt-4">
              <ShoppingBagIcon className="h-4 w-4" />
              ดูสินค้า
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Order Info */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    <PackageIcon className="h-6 w-6 text-slate-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">
                        ออเดอร์ #{order.id.slice(-8)}
                      </span>
                      <span className={`badge ${statusColors[order.status] || "badge-neutral"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      วันที่: {new Date(order.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="text-slate-600">
                        การชำระ: {" "}
                        <span className={order.paymentStatus === "PAID" ? "text-emerald-600 font-medium" : "text-amber-600"}>
                          {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                  <div className="text-right">
                    <div className="text-lg font-bold text-indigo-600">
                      ฿{order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="btn btn-outline text-sm py-2"
                  >
                    ดูรายละเอียด
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Progress Bar for Active Orders */}
              {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className={order.status === "PENDING" ? "font-medium text-indigo-600" : ""}>รอดำเนินการ</span>
                    <span className={order.status === "PROCESSING" ? "font-medium text-indigo-600" : ""}>จัดเตรียม</span>
                    <span className={order.status === "SHIPPED" ? "font-medium text-indigo-600" : ""}>จัดส่ง</span>
                    <span>สำเร็จ</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                      style={{
                        width: order.status === "PENDING" ? "25%" : 
                               order.status === "PROCESSING" ? "50%" : 
                               order.status === "SHIPPED" ? "75%" : "100%"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Completed Badge */}
              {order.status === "DELIVERED" && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-700">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">จัดส่งสำเร็จแล้ว</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
