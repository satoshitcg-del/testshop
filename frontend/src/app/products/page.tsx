"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Icons
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

function ExclamationCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data.items);
        setFilteredItems(data.data.items);
        setLoading(false);
      })
      .catch(() => {
        setError("โหลดสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = items.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า");
      return;
    }
    
    setAddingId(productId);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ เพิ่มสินค้าลงตะกร้าแล้ว");
      } else {
        alert(data.error || "เพิ่มสินค้าไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-600">กำลังโหลดสินค้า...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">เกิดข้อผิดพลาด</h2>
          <p className="mt-1 text-slate-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary mt-4"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="section-title">สินค้าทั้งหมด</h1>
          <p className="mt-1 text-slate-600">
            มีสินค้าทั้งหมด <span className="font-semibold text-indigo-600">{filteredItems.length}</span> รายการ
          </p>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <PackageIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">ไม่พบสินค้า</h3>
          <p className="text-slate-500">ลองค้นหาด้วยคำอื่นหรือดูสินค้าทั้งหมด</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")} 
              className="btn btn-outline mt-4"
            >
              ล้างการค้นหา
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((product) => (
            <div key={product.id} className="product-card flex flex-col">
              {/* Product Image Placeholder */}
              <Link href={`/products/${product.slug}`} className="product-image group">
                <div className="relative flex h-full w-full items-center justify-center">
                  <ShoppingBagIcon className="h-16 w-16 text-slate-300 transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>

              {/* Product Info */}
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-slate-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {product.description}
                </p>

                {/* Stock Badge */}
                <div className="mt-2">
                  {product.stockQuantity > 10 ? (
                    <span className="badge badge-success">มีสินค้า</span>
                  ) : product.stockQuantity > 0 ? (
                    <span className="badge badge-warning">เหลือ {product.stockQuantity} ชิ้น</span>
                  ) : (
                    <span className="badge badge-danger">สินค้าหมด</span>
                  )}
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="price-tag">฿{product.price.toLocaleString()}</div>
                    {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                      <div className="text-xs text-amber-600">ใกล้หมดแล้ว!</div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link 
                      href={`/products/${product.slug}`}
                      className="btn btn-ghost p-2"
                      title="ดูรายละเอียด"
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stockQuantity === 0 || addingId === product.id}
                      className="btn btn-primary p-2"
                      title="เพิ่มลงตะกร้า"
                    >
                      {addingId === product.id ? (
                        <div className="spinner" />
                      ) : (
                        <PlusIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
