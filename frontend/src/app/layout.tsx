import "./globals.css";
import type { Metadata } from "next";
import AuthButtons from "@/components/AuthButtons";

export const metadata: Metadata = {
  title: "TestShop - ร้านค้าออนไลน์",
  description: "ร้านค้าออนไลน์ครบวงจร สินค้าคุณภาพ ราคาคุ้มค่า",
};

// Icons as SVG components
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ClipboardListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
          <div className="container">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                  <ShoppingBagIcon className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold gradient-text">TestShop</span>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                <a href="/" className="nav-link flex items-center gap-2 px-4 py-2">
                  <HomeIcon className="h-4 w-4" />
                  <span>หน้าแรก</span>
                </a>
                <a href="/products" className="nav-link flex items-center gap-2 px-4 py-2">
                  <ShoppingBagIcon className="h-4 w-4" />
                  <span>สินค้า</span>
                </a>
                <a href="/cart" className="nav-link flex items-center gap-2 px-4 py-2">
                  <CartIcon className="h-4 w-4" />
                  <span>ตะกร้า</span>
                </a>
                <a href="/orders" className="nav-link flex items-center gap-2 px-4 py-2">
                  <ClipboardListIcon className="h-4 w-4" />
                  <span>คำสั่งซื้อ</span>
                </a>
              </nav>

              {/* Auth Buttons */}
              <AuthButtons />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden border-t border-slate-100">
            <div className="container">
              <div className="flex justify-around py-2">
                <a href="/" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-indigo-600">
                  <HomeIcon className="h-5 w-5" />
                  <span className="text-xs">หน้าแรก</span>
                </a>
                <a href="/products" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-indigo-600">
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span className="text-xs">สินค้า</span>
                </a>
                <a href="/cart" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-indigo-600">
                  <CartIcon className="h-5 w-5" />
                  <span className="text-xs">ตะกร้า</span>
                </a>
                <a href="/orders" className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-indigo-600">
                  <ClipboardListIcon className="h-5 w-5" />
                  <span className="text-xs">คำสั่งซื้อ</span>
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="container py-6 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                  <ShoppingBagIcon className="h-4 w-4" />
                </div>
                <span className="font-semibold text-slate-700">TestShop</span>
              </div>
              <p className="text-sm text-slate-500">
                © 2024 TestShop. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-slate-500">
                <a href="/products" className="hover:text-indigo-600 transition-colors">สินค้า</a>
                <a href="/cart" className="hover:text-indigo-600 transition-colors">ตะกร้า</a>
                <a href="/orders" className="hover:text-indigo-600 transition-colors">คำสั่งซื้อ</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
