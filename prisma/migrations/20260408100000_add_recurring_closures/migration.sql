-- CreateEnum
CREATE TYPE "RecurrenceFrequency" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "special_closures" ADD COLUMN "is_recurring" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "special_closures" ADD COLUMN "recurrence_frequency" "RecurrenceFrequency";
