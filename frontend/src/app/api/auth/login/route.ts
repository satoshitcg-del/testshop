import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body || {};
  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
  }

  const accessToken = issueToken({
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  return NextResponse.json({
    success: true,
    data: {
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      accessToken,
      expiresIn: 3600,
    },
  });
}
