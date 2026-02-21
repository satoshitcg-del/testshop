import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TestShop",
  description: "Test/MVP E-Commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="container flex items-center justify-between py-4">
            <a href="/" className="text-lg font-semibold">
              TestShop
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/products" className="hover:underline">
                Products
              </a>
              <a href="/cart" className="hover:underline">
                Cart
              </a>
              <a href="/orders" className="hover:underline">
                Orders
              </a>
              <a href="/login" className="hover:underline">
                Login
              </a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
