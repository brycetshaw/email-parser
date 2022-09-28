/*
  Warnings:

  - You are about to drop the column `body` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `headers` on the `Message` table. All the data in the column will be lost.
  - Added the required column `html` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "body",
DROP COLUMN "headers",
ADD COLUMN     "html" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT,
ADD COLUMN     "text" TEXT NOT NULL;
