import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create User
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'suvreen@gmail.com' },
    update: {},
    create: {
      name: 'Suvreen',
      email: 'suvreen@gmail.com',
      // @ts-ignore
      password: hashedPassword,
      styleScore: 82,
      styleDna: {
        create: {
          uniquenessScore: 98,
          faceShape: 'Oval',
          bodyShape: 'Hourglass',
          skinTone: 'Warm Beige',
          undertone: 'Neutral',
        }
      },
      wardrobeItems: {
        create: [
          { name: "Beige Blazer", price: 4990, wornCount: 8, category: "Tops", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80" },
          { name: "White Shirt", price: 2150, wornCount: 12, category: "Tops", imageUrl: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=500&q=80" },
          { name: "Black Dress", price: 3890, wornCount: 4, category: "Dresses", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&q=80" },
          { name: "Blue Denim", price: 2490, wornCount: 15, category: "Bottoms", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80" },
          { name: "Sneakers", price: 2990, wornCount: 20, category: "Shoes", imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80" },
          { name: "Handbag", price: 3290, wornCount: 5, category: "Bags", imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80" },
          { name: "Sunglasses", price: 1990, wornCount: 18, category: "Accessories", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80" },
          { name: "Heels", price: 2290, wornCount: 2, category: "Shoes", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80" },
          { name: "Trousers", price: 2490, wornCount: 6, category: "Bottoms", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80" },
          { name: "Skirt", price: 1990, wornCount: 3, category: "Bottoms", imageUrl: "https://images.unsplash.com/photo-1583496661160-c588c4c1e855?w=500&q=80" },
        ]
      },
      recommendations: {
        create: [
          { title: "Power Dressing", subtitle: "For Work", imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80" },
          { title: "Brunch Ready", subtitle: "Weekend Looks", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" },
          { title: "Minimal Chic", subtitle: "Everyday Style", imageUrl: "https://images.unsplash.com/photo-1434389672724-4fa14fc133cc?w=800&q=80" },
          { title: "Date Night", subtitle: "Elegant Looks", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80" },
        ]
      }
    },
  });

  console.log({ user });
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
