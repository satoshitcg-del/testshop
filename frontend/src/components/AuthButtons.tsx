"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

export default function AuthButtons() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <UserIcon className="h-4 w-4" />
        <span>ออกจากระบบ</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="hidden sm:flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <UserIcon className="h-4 w-4" />
        <span>เข้าสู่ระบบ</span>
      </Link>
      <Link href="/register" className="btn btn-primary text-sm">
        <ShoppingBagIcon className="h-4 w-4" />
        สมัครสมาชิก
      </Link>
    </div>
  );
}