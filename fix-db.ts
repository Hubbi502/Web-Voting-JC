import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function fixDatabase() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // Make phoneNumber optional
    await pool.query('ALTER TABLE "VoteToken" ALTER COLUMN "phoneNumber" DROP NOT NULL');
    console.log("✅ Successfully made phoneNumber optional");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

fixDatabase();
