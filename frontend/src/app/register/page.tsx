"use client";

import { useState } from "react";
import Link from "next/link";

// Icons
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function LockClosedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.574-2.9m3.1-3.1A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.063 3.525M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
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

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    
    if (!agreeTerms) {
      setError("กรุณายอมรับเงื่อนไขการใช้งาน");
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setError(data.error || "สมัครสมาชิกไม่สำเร็จ");
        setLoading(false);
        return;
      }
      
      localStorage.setItem("token", data.data.accessToken);
      window.location.href = "/products";
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
            <ShoppingBagIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">สมัครสมาชิกใหม่</h1>
          <p className="mt-2 text-slate-600">สร้างบัญชีเพื่อเริ่มช้อปปิ้ง</p>
        </div>

        {/* Register Form */}
        <div className="card">
          {error && (
            <div className="alert alert-error mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ชื่อ นามสกุล"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                อีเมล
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                รหัสผ่าน
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
              </p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="text-sm text-slate-600">
                ฉันยอมรับ{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  เงื่อนไขการใช้งาน
                </a>{" "}
                และ{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  นโยบายความเป็นส่วนตัว
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={loading || !email || !password || !fullName}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  สมัครสมาชิก
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <span>สะสมแต้มได้</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <span>ติดตามออเดอร์</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <span>โปรโมชั่นพิเศษ</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
              <span>ชำระเงินง่าย</span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-slate-500">มีบัญชีอยู่แล้ว?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/login" 
            className="btn btn-outline w-full"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}
