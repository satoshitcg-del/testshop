import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueToken, isValidEmail } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // Rate limiting
  const ip = getClientIP(req);
  const { allowed, remaining, resetIn } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later.", resetIn },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body || {};
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
    }

    // Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const role = user.role === "ADMIN" ? "ADMIN" : "CUSTOMER";

    const accessToken = issueToken({
      id: user.id,
      email: user.email,
      role,
      fullName: user.fullName,
    });

    return NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, fullName: user.fullName, role },
        accessToken,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}
