import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding operating hours...");

  // Tres Jolie hours:
  // Tue-Sun: Breakfast 9:00-11:30, Lunch 12:00-17:30
  // Fri-Sat: Dinner 18:00-22:00
  // Monday: Closed (dayOfWeek 0)

  const defaultHours = [
    // Tuesday (1) - Sunday (6): Breakfast & Lunch
    ...[1, 2, 3, 4, 5, 6].flatMap((day) => [
      {
        dayOfWeek: day,
        mealPeriod: "BREAKFAST" as const,
        openTime: "09:00",
        closeTime: "11:30",
        maxCovers: 200,
      },
      {
        dayOfWeek: day,
        mealPeriod: "LUNCH" as const,
        openTime: "12:00",
        closeTime: "17:30",
        maxCovers: 300,
      },
    ]),
    // Friday (4) & Saturday (5): Dinner
    ...[4, 5].map((day) => ({
      dayOfWeek: day,
      mealPeriod: "DINNER" as const,
      openTime: "18:00",
      closeTime: "22:00",
      maxCovers: 200,
    })),
  ];

  for (const h of defaultHours) {
    await prisma.operatingHours.upsert({
      where: {
        dayOfWeek_mealPeriod: {
          dayOfWeek: h.dayOfWeek,
          mealPeriod: h.mealPeriod,
        },
      },
      update: {},
      create: h,
    });
  }

  console.log(`Seeded ${defaultHours.length} operating hour entries.`);

  // Seed default sections
  const sections = [
    { name: "Indoor", capacity: 150 },
    { name: "Outdoor / Garden", capacity: 200 },
    { name: "Patio", capacity: 50 },
  ];

  for (const s of sections) {
    const existing = await prisma.section.findFirst({
      where: { name: s.name },
    });
    if (!existing) {
      await prisma.section.create({ data: s });
    }
  }

  console.log(`Seeded ${sections.length} sections.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
