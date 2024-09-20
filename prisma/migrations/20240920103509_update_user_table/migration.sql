/*
  Warnings:

  - You are about to drop the column `categoryId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `organization_details` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `volunteer_details` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `volunteer_details` table. All the data in the column will be lost.
  - Added the required column `categoryOrganizationId` to the `organization_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationId` to the `volunteer_details` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "organization_details" DROP CONSTRAINT "organization_details_typeId_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "categoryId",
ADD COLUMN     "categoryEventId" INTEGER;

-- AlterTable
ALTER TABLE "organization_details" DROP COLUMN "typeId",
ADD COLUMN     "categoryOrganizationId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "volunteer_details" DROP COLUMN "education",
DROP COLUMN "skills",
ADD COLUMN     "educationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "educations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_skills" (
    "id" SERIAL NOT NULL,
    "volunteerDetailId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "volunteer_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "educations_name_key" ON "educations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_skills_volunteerDetailId_skillId_key" ON "volunteer_skills"("volunteerDetailId", "skillId");

-- AddForeignKey
ALTER TABLE "volunteer_details" ADD CONSTRAINT "volunteer_details_educationId_fkey" FOREIGN KEY ("educationId") REFERENCES "educations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_skills" ADD CONSTRAINT "volunteer_skills_volunteerDetailId_fkey" FOREIGN KEY ("volunteerDetailId") REFERENCES "volunteer_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_skills" ADD CONSTRAINT "volunteer_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_details" ADD CONSTRAINT "organization_details_categoryOrganizationId_fkey" FOREIGN KEY ("categoryOrganizationId") REFERENCES "category_organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryEventId_fkey" FOREIGN KEY ("categoryEventId") REFERENCES "category_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
