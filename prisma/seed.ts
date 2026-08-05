import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ownerEmail = process.env.SEED_ADMIN_EMAIL;
  const ownerPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!ownerEmail || !ownerPassword) {
    throw new Error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD env vars before seeding (never hardcode credentials)."
    );
  }

  const passwordHash = await bcrypt.hash(ownerPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      passwordHash,
      name: "Store Owner",
      role: "OWNER",
    },
  });

  const existingBar = await prisma.announcementBar.findFirst();
  if (!existingBar) {
    await prisma.announcementBar.create({
      data: {
        text: "Complimentary shipping on all orders",
        isActive: true,
        bgColor: "#D4AF37",
        textColor: "#050505",
        type: "FREE_SHIPPING",
      },
    });
  }

  const existingSections = await prisma.homepageSection.count();
  if (existingSections === 0) {
    await prisma.homepageSection.createMany({
      data: [
        {
          type: "HERO",
          order: 0,
          isVisible: true,
          config: {
            heading: "Timeless Elegance, Handcrafted",
            subheading: "Fine jewelry designed to be worn for a lifetime and passed down for generations.",
            ctaLabel: "Shop New Arrivals",
            ctaHref: "/search",
          },
        },
        {
          type: "FEATURED_PRODUCTS",
          order: 1,
          isVisible: true,
          config: { heading: "Featured Pieces", tag: "isFeatured", limit: 8 },
        },
        {
          type: "TESTIMONIALS",
          order: 2,
          isVisible: true,
          config: {},
        },
        {
          type: "NEWSLETTER",
          order: 3,
          isVisible: true,
          config: {},
        },
      ],
    });
  }

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Ayesha K.",
          rating: 5,
          content: "The craftsmanship exceeded every expectation — this will be an heirloom in our family.",
          isVisible: true,
          order: 0,
        },
        {
          name: "Bilal R.",
          rating: 5,
          content: "Ordered a custom ring and the communication throughout was excellent. Arrived exactly as described.",
          isVisible: true,
          order: 1,
        },
        {
          name: "Fatima S.",
          rating: 5,
          content: "Beautiful packaging, beautiful piece. Cash on delivery made it an easy, trustworthy first purchase.",
          isVisible: true,
          order: 2,
        },
      ],
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
