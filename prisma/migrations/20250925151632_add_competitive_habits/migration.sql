/*
  Warnings:

  - A unique constraint covering the columns `[habitId,userId,completedAt]` on the table `HabitCompletion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `HabitCompletion` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."HabitParticipantStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'REMOVED');

-- DropIndex
DROP INDEX "public"."Habit_lastCompletedAt_idx";

-- DropIndex
DROP INDEX "public"."Habit_repetitionUnit_idx";

-- DropIndex
DROP INDEX "public"."Habit_streak_idx";

-- DropIndex
DROP INDEX "public"."HabitCompletion_habitId_completedAt_key";

-- AlterTable
ALTER TABLE "public"."Habit" ADD COLUMN     "isCompetitive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxParticipants" INTEGER;

-- AlterTable
ALTER TABLE "public"."HabitCompletion" ADD COLUMN     "participantId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."HabitParticipant" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."HabitParticipantStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3),
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HabitParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HabitParticipant_habitId_idx" ON "public"."HabitParticipant"("habitId");

-- CreateIndex
CREATE INDEX "HabitParticipant_userId_idx" ON "public"."HabitParticipant"("userId");

-- CreateIndex
CREATE INDEX "HabitParticipant_habitId_status_idx" ON "public"."HabitParticipant"("habitId", "status");

-- CreateIndex
CREATE INDEX "HabitParticipant_status_idx" ON "public"."HabitParticipant"("status");

-- CreateIndex
CREATE UNIQUE INDEX "HabitParticipant_habitId_userId_key" ON "public"."HabitParticipant"("habitId", "userId");

-- CreateIndex
CREATE INDEX "Habit_isCompetitive_idx" ON "public"."Habit"("isCompetitive");

-- CreateIndex
CREATE INDEX "HabitCompletion_userId_idx" ON "public"."HabitCompletion"("userId");

-- CreateIndex
CREATE INDEX "HabitCompletion_participantId_idx" ON "public"."HabitCompletion"("participantId");

-- CreateIndex
CREATE INDEX "HabitCompletion_userId_completedAt_idx" ON "public"."HabitCompletion"("userId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HabitCompletion_habitId_userId_completedAt_key" ON "public"."HabitCompletion"("habitId", "userId", "completedAt");

-- AddForeignKey
ALTER TABLE "public"."HabitParticipant" ADD CONSTRAINT "HabitParticipant_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitParticipant" ADD CONSTRAINT "HabitParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitCompletion" ADD CONSTRAINT "HabitCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitCompletion" ADD CONSTRAINT "HabitCompletion_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."HabitParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
