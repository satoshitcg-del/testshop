"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("customer@test.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error || "Login failed");
      return;
    }
    localStorage.setItem("token", data.data.accessToken);
    window.location.href = "/products";
  };

  return (
    <div className="card max-w-md">
      <h1 className="text-2xl font-semibold">Login</h1>
      <div className="mt-4 space-y-3">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="btn btn-primary w-full" onClick={handleLogin}>
          Login
        </button>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <a className="text-sm underline" href="/register">
          สมัครสมาชิก
        </a>
      </div>
    </div>
  );
}