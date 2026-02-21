"use client";

import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data.items);
        setLoading(false);
      })
      .catch(() => {
        setError("โหลดสินค้าไม่สำเร็จ");
        setLoading(false);
      });
  }, []);

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      return;
    }
    await fetch("/api/cart/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    alert("เพิ่มสินค้าแล้ว");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((p) => (
          <div key={p.id} className="card">
            <h2 className="font-semibold">
              <a className="hover:underline" href={`/products/${p.slug}`}>
                {p.name}
              </a>
            </h2>
            <p className="text-sm text-slate-600">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-medium">฿{p.price}</div>
              <button className="btn btn-primary" onClick={() => addToCart(p.id)}>
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}