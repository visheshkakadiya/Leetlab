/*
  Warnings:

  - You are about to drop the column `Stdout` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "Stdout",
ADD COLUMN     "stdout" TEXT;
