import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { issueToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, fullName } = body || {};
  if (!email || !password || !fullName) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: "CUSTOMER",
    },
  });

  const accessToken = issueToken({
    id: user.id,
    email: user.email,
    role: user.role as "CUSTOMER" | "ADMIN",
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
