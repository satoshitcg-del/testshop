export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-2xl font-semibold">TestShop MVP</h1>
        <p className="mt-2 text-slate-600">
          เว็บทดสอบ E-Commerce สำหรับ Flow หลัก: ดูสินค้า → ตะกร้า → Checkout → Order
        </p>
        <div className="mt-4 flex gap-3">
          <a className="btn btn-primary" href="/products">
            ดูสินค้า
          </a>
          <a className="btn btn-outline" href="/login">
            เข้าสู่ระบบ
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="font-semibold">Auth</h2>
          <p className="text-sm text-slate-600">สมัคร/เข้าสู่ระบบด้วยอีเมล</p>
        </div>
        <div className="card">
          <h2 className="font-semibold">Cart</h2>
          <p className="text-sm text-slate-600">เพิ่มสินค้าและแก้จำนวน</p>
        </div>
        <div className="card">
          <h2 className="font-semibold">Checkout</h2>
          <p className="text-sm text-slate-600">ชำระแบบทดสอบ</p>
        </div>
      </section>
    </div>
  );
}
