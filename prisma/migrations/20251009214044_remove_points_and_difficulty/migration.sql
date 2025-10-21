/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Habit` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."BadgeType" ADD VALUE 'COMPETITIVE';

-- AlterTable
ALTER TABLE "public"."Habit" DROP COLUMN "difficulty",
DROP COLUMN "points";
