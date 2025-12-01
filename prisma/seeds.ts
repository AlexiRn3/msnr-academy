// File: prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding...");

  const courses = [
    {
      title: "Starter Pack",
      description: "The fundamentals to understand market structure and SnR zones. Includes: Introduction to MSNR, Understanding SnR (A-Shape, V-Shape), Fresh vs Unfresh Zones.",
      price: 97,
      isPublished: true,
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop", // Trading ambience
    },
    {
      title: "MSNR Emperor",
      description: "The complete strategy to pass Prop Firm challenges and become profitable. Includes: Storyline (Weekly/Daily), Advanced Setups (Engulfing, Breakout), Risk Management, Psychology.",
      price: 197,
      isPublished: true,
      image: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2064&auto=format&fit=crop", // Gold/Blue Chart
    },
    {
      title: "Order Flow Mastery",
      description: "For traders who want to see what institutions actually see. Includes: Cumulative Delta (CVD), Footprint & Heatmap, Group Mentoring.",
      price: 297,
      isPublished: true,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Complex Data
    },
  ];

  for (const course of courses) {
    // Check if course already exists to avoid duplicates
    const existing = await prisma.course.findFirst({
        where: { title: course.title }
    });

    if (!existing) {
        await prisma.course.create({
            data: course
        });
        console.log(`✅ Course created: ${course.title}`);
    } else {
        console.log(`ℹ️ Course already exists: ${course.title}`);
    }
  }

  console.log("✅ Seeding completed successfully.");
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