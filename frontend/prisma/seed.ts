import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const customer = await prisma.user.create({
    data: {
      email: "customer@test.com",
      passwordHash,
      fullName: "Test Customer",
      role: "CUSTOMER",
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@test.com",
      passwordHash,
      fullName: "Test Admin",
      role: "ADMIN",
    },
  });

  const products = [] as { name: string; slug: string; description: string; price: number; stockQuantity: number }[];
  for (let i = 1; i <= 10; i += 1) {
    products.push({
      name: `Gadget ${i}`,
      slug: `gadget-${i}`,
      description: `อุปกรณ์อิเล็กทรอนิกส์รุ่น ${i}`,
      price: 990 + i * 50,
      stockQuantity: 20,
    });
  }
  for (let i = 1; i <= 10; i += 1) {
    products.push({
      name: `Fashion ${i}`,
      slug: `fashion-${i}`,
      description: `สินค้าแฟชั่นรุ่น ${i}`,
      price: 390 + i * 30,
      stockQuantity: 30,
    });
  }

  await prisma.product.createMany({ data: products });

  const cart = await prisma.cart.create({ data: { userId: customer.id } });
  const product = await prisma.product.findFirst();
  if (product) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: product.id,
        quantity: 1,
        priceAtTime: product.price,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
