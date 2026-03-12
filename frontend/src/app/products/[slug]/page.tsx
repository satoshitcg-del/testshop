"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Icons
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าในตะกร้า");
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product?.id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        alert(data.error || "เพิ่มสินค้าไม่สำเร็จ");
      }
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setAddingToCart(false);
    }
  };

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

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">ไม่พบสินค้า</h2>
          <Link href="/products" className="btn btn-primary mt-4">
            <ArrowLeftIcon className="h-4 w-4" />
            กลับไปหน้าสินค้า
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity <= 5 && product.stockQuantity > 0;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="hover:text-indigo-600 transition-colors">หน้าแรก</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-indigo-600 transition-colors">สินค้า</Link>
          </li>
          <li>/</li>
          <li className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
          <ShoppingBagIcon className="h-32 w-32 text-slate-300" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isOutOfStock ? (
              <span className="badge badge-danger">สินค้าหมด</span>
            ) : isLowStock ? (
              <span className="badge badge-warning">เหลือ {product.stockQuantity} ชิ้น</span>
            ) : (
              <span className="badge badge-success">มีสินค้า</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{product.name}</h1>
          
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-indigo-600">
              ฿{product.price.toLocaleString()}
            </span>
            <span className="text-slate-400 line-through">
              ฿{(product.price * 1.2).toFixed(0)}
            </span>
            <span className="badge badge-danger">-20%</span>
          </div>

          <p className="mt-6 text-slate-600 leading-relaxed">{product.description}</p>

          {/* Features */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <TruckIcon className="h-5 w-5 text-emerald-500" />
              <span>จัดส่งฟรีเมื่อสั่งซื้อเกิน ฿500</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />
              <span>รับประกันสินค้า 7 วัน</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <RefreshIcon className="h-5 w-5 text-emerald-500" />
              <span>สามารถคืนสินค้าได้ภายใน 14 วัน</span>
            </div>
          </div>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="mt-8">
              <label className="text-sm font-medium text-slate-700">จำนวน</label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="qty-btn"
                  disabled={quantity >= product.stockQuantity}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-500">
                  มีสินค้าทั้งหมด {product.stockQuantity} ชิ้น
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={addToCart}
              disabled={isOutOfStock || addingToCart}
              className={`btn flex-1 ${added ? 'btn-secondary' : 'btn-primary'} ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {addingToCart ? (
                <div className="spinner" />
              ) : added ? (
                <>
                  <CheckIcon className="h-5 w-5" />
                  เพิ่มแล้ว
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="h-5 w-5" />
                  {isOutOfStock ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                </>
              )}
            </button>
            <Link href="/products" className="btn btn-outline">
              <ArrowLeftIcon className="h-4 w-4" />
              กลับไปหน้าสินค้า
            </Link>
          </div>

          {/* Cart Link */}
          <div className="mt-4 text-center">
            <Link href="/cart" className="text-sm text-indigo-600 hover:underline">
              ดูตะกร้าสินค้า →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
