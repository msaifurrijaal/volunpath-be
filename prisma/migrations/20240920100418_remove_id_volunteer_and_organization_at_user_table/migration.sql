/*
  Warnings:

  - You are about to drop the column `organizationDetailId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerDetailId` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_organizationDetailId_key";

-- DropIndex
DROP INDEX "users_volunteerDetailId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "organizationDetailId",
DROP COLUMN "volunteerDetailId";
