import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export function requireAdmin(req: Request) {
  const user = getUserFromRequest(req);
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }
  
  return user;
}
