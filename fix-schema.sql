-- Fix phoneNumber column to be optional
ALTER TABLE "VoteToken" ALTER COLUMN "phoneNumber" DROP NOT NULL;
