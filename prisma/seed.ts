import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedBrands, seedCoupons, seedProducts, seedUsers } from "../src/server/seed-data";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const user of seedUsers()) {
    const { addresses, ...rest } = user;
    await prisma.user.create({
      data: { ...rest, addresses: { create: addresses } },
    });
  }

  for (const brand of seedBrands()) {
    await prisma.brand.create({ data: brand });
  }

  // Products reference brands via brandSlug, so brands must exist first.
  for (const product of seedProducts()) {
    await prisma.product.create({
      data: {
        ...product,
        colors: product.colors,
        sizeGuideRows: product.sizeGuideRows ?? undefined,
      },
    });
  }

  for (const coupon of seedCoupons()) {
    await prisma.coupon.create({ data: coupon });
  }

  await prisma.settings.create({
    data: { id: 1, freeShippingThreshold: 299.9, whatsappNumber: "5584999999999" },
  });

  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
