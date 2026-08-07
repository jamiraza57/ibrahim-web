import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
(async () => {
  const categories = await prisma.category.count();
  const products = await prisma.product.count();
  const catList = await prisma.category.findMany({ select: { name: true, slug: true, imageUrl: true, bannerUrl: true, parentId: true } });
  const prodSample = await prisma.product.findMany({ take: 5, select: { name: true, price: true, status: true, isNewArrival: true, isBestSeller: true } });
  console.log(JSON.stringify({ categories, products, catList, prodSample }, null, 2));
  await prisma.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
