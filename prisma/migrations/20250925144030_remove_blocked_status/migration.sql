/*
  Warnings:

  - The values [BLOCKED] on the enum `FriendshipStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."FriendshipStatus_new" AS ENUM ('PENDING', 'ACCEPTED');
ALTER TABLE "public"."Friendship" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Friendship" ALTER COLUMN "status" TYPE "public"."FriendshipStatus_new" USING ("status"::text::"public"."FriendshipStatus_new");
ALTER TYPE "public"."FriendshipStatus" RENAME TO "FriendshipStatus_old";
ALTER TYPE "public"."FriendshipStatus_new" RENAME TO "FriendshipStatus";
DROP TYPE "public"."FriendshipStatus_old";
ALTER TABLE "public"."Friendship" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
