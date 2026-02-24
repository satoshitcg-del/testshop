import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/middleware/admin";

// GET /api/admin/stats - ดูสถิติร้านค้า
export async function GET(req: Request) {
  const admin = requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d"; // 7d, 30d, 90d, 1y

  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  
  switch (period) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
    case "1y":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    // Total users
    prisma.user.count(),

    // Total products
    prisma.product.count(),

    // Total orders
    prisma.order.count({
      where: { createdAt: { gte: startDate } },
    }),

    // Total revenue
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
      _sum: {
        totalAmount: true,
      },
    }),

    // Orders by status
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PROCESSING" } }),
    prisma.order.count({ where: { status: "SHIPPED" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),

    // Low stock products (less than 10)
    prisma.product.count({
      where: { stockQuantity: { lt: 10 } },
    }),

    // Recent orders (last 5)
    prisma.order.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        items: true,
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        lowStockProducts,
      },
      ordersByStatus: {
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      recentOrders: recentOrders.map((order) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        items: order.items.map((item) => ({
          ...item,
          price: Number(item.price),
          subtotal: Number(item.subtotal),
        })),
      })),
    },
  });
}
