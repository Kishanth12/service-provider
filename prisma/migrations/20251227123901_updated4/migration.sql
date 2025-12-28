/*
  Warnings:

  - You are about to drop the column `providerId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `Provider` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `serviceId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_providerId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "providerId";

-- AlterTable
ALTER TABLE "Provider" DROP COLUMN "serviceName";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "providerId",
ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
