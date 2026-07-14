import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client/client.ts";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL é obrigatória para executar o seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed(): Promise<void> {
  try {
    const household = await prisma.household.upsert({
      where: { id: "0194f2d8-5c40-7000-8000-000000000001" },
      update: { name: "Casa do Rafael" },
      create: {
        id: "0194f2d8-5c40-7000-8000-000000000001",
        name: "Casa do Rafael",
      },
    });

    const user = await prisma.user.upsert({
      where: { email: "rafael@example.test" },
      update: { name: "Rafael" },
      create: {
        id: "0194f2d8-5c40-7000-8000-000000000002",
        email: "rafael@example.test",
        name: "Rafael",
      },
    });

    await prisma.householdMember.upsert({
      where: {
        householdId_userId: {
          householdId: household.id,
          userId: user.id,
        },
      },
      update: { role: "OWNER" },
      create: {
        householdId: household.id,
        userId: user.id,
        role: "OWNER",
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

void seed();
