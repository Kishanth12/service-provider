/*
  Warnings:

  - Added the required column `timeSlot` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "timeSlot" TEXT NOT NULL;
