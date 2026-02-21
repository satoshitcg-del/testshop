"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => setProduct(data.data));
  }, [slug]);

  const addToCart = async () => {
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
      body: JSON.stringify({ productId: product?.id, quantity: 1 }),
    });
    alert("เพิ่มสินค้าแล้ว");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="card">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="mt-2 text-slate-600">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-semibold">฿{product.price}</div>
        <button className="btn btn-primary" onClick={addToCart}>
          Add to cart
        </button>
      </div>
    </div>
  );
}