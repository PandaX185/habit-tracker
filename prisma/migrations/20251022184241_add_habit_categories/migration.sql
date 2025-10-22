-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HabitCategory" (
    "id" TEXT NOT NULL,
    "habitId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "HabitCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "HabitCategory_habitId_idx" ON "public"."HabitCategory"("habitId");

-- CreateIndex
CREATE INDEX "HabitCategory_categoryId_idx" ON "public"."HabitCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "HabitCategory_habitId_categoryId_key" ON "public"."HabitCategory"("habitId", "categoryId");

-- AddForeignKey
ALTER TABLE "public"."HabitCategory" ADD CONSTRAINT "HabitCategory_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "public"."Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HabitCategory" ADD CONSTRAINT "HabitCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
