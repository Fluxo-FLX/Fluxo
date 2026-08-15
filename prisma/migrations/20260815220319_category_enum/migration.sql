/*
  Warnings:

  - The `categories` column on the `Brand` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategorySlug" AS ENUM ('fitness', 'surf', 'casual');

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "categories",
ADD COLUMN     "categories" "CategorySlug"[];

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "category" "CategorySlug" NOT NULL;

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
