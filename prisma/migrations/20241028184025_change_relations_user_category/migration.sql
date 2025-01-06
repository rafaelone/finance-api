/*
  Warnings:

  - You are about to drop the column `categoryId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_user_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "categoryId",
DROP COLUMN "user_id",
ADD COLUMN     "category_id" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
