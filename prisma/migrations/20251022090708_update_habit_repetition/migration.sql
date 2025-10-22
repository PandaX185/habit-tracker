/*
  Warnings:

  - You are about to drop the column `repetitionInterval` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `repetitionUnit` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `repetitionDays` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Habit" DROP COLUMN "repetitionInterval",
DROP COLUMN "repetitionUnit",
ADD COLUMN     "repetitionDays" INTEGER NOT NULL;
