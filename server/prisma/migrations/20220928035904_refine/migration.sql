/*
  Warnings:

  - You are about to drop the column `html` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_messageId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "html",
ADD COLUMN     "date" TIMESTAMP(3);

-- DropTable
DROP TABLE "Attachment";
