import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

export type AuthUser = {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  fullName: string;
};

export function issueToken(payload: AuthUser) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function getUserFromRequest(req: Request): AuthUser | null {
  const auth = req.headers.get("authorization");
  const token = auth?.replace("Bearer ", "");
  if (!token) return null;
  try {
    return jwt.verify(token, getJwtSecret()) as AuthUser;
  } catch {
    return null;
  }
}

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Generic API error handler
export function handleApiError(error: unknown, fallbackMessage: string = "An error occurred"): NextResponse {
  console.error("API Error:", error);
  return NextResponse.json(
    { success: false, error: fallbackMessage },
    { status: 500 }
  );
}
