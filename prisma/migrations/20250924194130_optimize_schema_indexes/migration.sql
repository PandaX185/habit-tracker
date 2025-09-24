-- CreateIndex
CREATE INDEX "Habit_userId_idx" ON "public"."Habit"("userId");

-- CreateIndex
CREATE INDEX "Habit_userId_isActive_idx" ON "public"."Habit"("userId", "isActive");

-- CreateIndex
CREATE INDEX "Habit_userId_createdAt_idx" ON "public"."Habit"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Habit_lastCompletedAt_idx" ON "public"."Habit"("lastCompletedAt");

-- CreateIndex
CREATE INDEX "Habit_streak_idx" ON "public"."Habit"("streak");

-- CreateIndex
CREATE INDEX "Habit_repetitionUnit_idx" ON "public"."Habit"("repetitionUnit");

-- CreateIndex
CREATE INDEX "HabitCompletion_habitId_idx" ON "public"."HabitCompletion"("habitId");

-- CreateIndex
CREATE INDEX "HabitCompletion_habitId_completedAt_idx" ON "public"."HabitCompletion"("habitId", "completedAt");

-- CreateIndex
CREATE INDEX "HabitCompletion_completedAt_idx" ON "public"."HabitCompletion"("completedAt");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "public"."User"("googleId");

-- CreateIndex
CREATE INDEX "User_xpPoints_idx" ON "public"."User"("xpPoints");

-- CreateIndex
CREATE INDEX "User_level_idx" ON "public"."User"("level");
