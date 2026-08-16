-- CreateEnum
CREATE TYPE "SaleChannel" AS ENUM ('online', 'presencial', 'whatsapp');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "channel" "SaleChannel" NOT NULL DEFAULT 'online',
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ALTER COLUMN "userEmail" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;
