/*
  Warnings:

  - You are about to drop the column `isActive` on the `Habit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Habit_userId_isActive_idx";

-- AlterTable
ALTER TABLE "public"."Habit" DROP COLUMN "isActive";
