/*
  Warnings:

  - Added the required column `provinceId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `regencyId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "provinceId" INTEGER NOT NULL,
ADD COLUMN     "regencyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "regencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
