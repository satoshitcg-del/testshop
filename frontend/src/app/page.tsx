import Link from "next/link";

// Icon Components
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <section className="hero">
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4" />
              ระบบ E-Commerce ครบวงจร
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            TestShop MVP
          </h1>
          <p className="mt-4 max-w-xl text-lg text-indigo-100">
            เว็บทดสอบ E-Commerce สำหรับ Flow หลัก: ดูสินค้า → ตะกร้า → Checkout → Order
            พร้อมระบบจัดการที่ครบครัน
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link 
              href="/products" 
              className="btn btn-primary bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
            >
              <ShoppingBagIcon className="h-4 w-4" />
              ดูสินค้าทั้งหมด
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link 
              href="/register" 
              className="btn bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <UserPlusIcon className="h-4 w-4" />
              สมัครสมาชิก
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-md">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">100+</div>
              <div className="text-sm text-indigo-200">สินค้า</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">24/7</div>
              <div className="text-sm text-indigo-200">บริการ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">100%</div>
              <div className="text-sm text-indigo-200">ความพึงพอใจ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="section-title">ฟีเจอร์หลัก</h2>
          <p className="mt-2 text-slate-600">ระบบร้านค้าออนไลน์ที่ครบครันด้วยฟีเจอร์มากมาย</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="card card-hover group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
              <UserPlusIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">ระบบสมาชิก</h3>
            <p className="mt-2 text-sm text-slate-600">
              สมัครสมาชิกและเข้าสู่ระบบด้วยอีเมลได้อย่างง่ายดาย พร้อมระบบจัดการโปรไฟล์
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card card-hover group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">ตะกร้าสินค้า</h3>
            <p className="mt-2 text-sm text-slate-600">
              เพิ่มสินค้าในตะกร้า ปรับแต่งจำนวน และจัดการสินค้าได้ตามต้องการ
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card card-hover group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">ชำระเงิน</h3>
            <p className="mt-2 text-sm text-slate-600">
              ระบบชำระเงินแบบทดสอบ พร้อมติดตามสถานะคำสั่งซื้อแบบ real-time
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card card-hover group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">ความปลอดภัย</h3>
            <p className="mt-2 text-sm text-slate-600">
              ระบบ Authentication ด้วย JWT และการเข้ารหัสรหัสผ่านด้วย bcrypt
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card card-hover group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-500 group-hover:text-white">
              <TruckIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">จัดการคำสั่งซื้อ</h3>
            <p className="mt-2 text-sm text-slate-600">
              ติดตามสถานะคำสั่งซื้อจาก Pending จนถึง Delivered หรือยกเลิกได้ตลอด
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card card-hover group">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 transition-colors group-hover:bg-rose-500 group-hover:text-white">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Admin Dashboard</h3>
            <p className="mt-2 text-sm text-slate-600">
              ระบบจัดการสินค้า คำสั่งซื้อ และดูสถิติสำหรับผู้ดูแลระบบ
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">วิธีการใช้งาน</h2>
          <p className="mt-2 text-slate-400">เริ่มต้นใช้งานได้ใน 4 ขั้นตอนง่ายๆ</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "1", title: "สมัครสมาชิก", desc: "สร้างบัญชีผู้ใช้งานใหม่" },
            { step: "2", title: "เลือกสินค้า", desc: "ดูและเลือกสินค้าที่ต้องการ" },
            { step: "3", title: "เพิ่มตะกร้า", desc: "เพิ่มสินค้าในตะกร้า" },
            { step: "4", title: "ชำระเงิน", desc: "ทำการสั่งซื้อและชำระเงิน" },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-bold shadow-lg shadow-indigo-500/30">
                {item.step}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="card bg-gradient-to-r from-indigo-50 to-violet-50 border-indigo-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">พร้อมเริ่มช้อปปิ้งแล้วหรือยัง?</h2>
            <p className="mt-1 text-slate-600">สมัครสมาชิกวันนี้เพื่อรับประสบการณ์ช้อปปิ้งที่ดีที่สุด</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="btn btn-primary">
              เริ่มช้อปเลย
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-6">
          <h2 className="section-title">รีวิวจากผู้ใช้งาน</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "คุณสมชาย", role: "ลูกค้าประจำ", text: "ระบบใช้งานง่าย สั่งซื้อสะดวกมากครับ" },
            { name: "คุณสมหญิง", role: "นักช้อปออนไลน์", text: "ชอบการออกแบบที่สวยงามและใช้งานง่าย" },
            { name: "คุณประเสริฐ", role: "ผู้ใช้ทั่วไป", text: "ชำระเงินรวดเร็ว ติดตามออเดอร์ได้สะดวก" },
          ].map((review, i) => (
            <div key={i} className="card">
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, j) => (
                  <StarIcon key={j} className="h-4 w-4" />
                ))}
              </div>
              <p className="text-slate-600 text-sm mb-4">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-medium text-sm">
                  {review.name[2]}
                </div>
                <div>
                  <div className="font-medium text-slate-900 text-sm">{review.name}</div>
                  <div className="text-xs text-slate-500">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
