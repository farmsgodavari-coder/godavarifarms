/*
  Warnings:

  - A unique constraint covering the columns `[rateType,date,stateId,mandiId,country,quality,sizeMm,packing]` on the table `onion_rates` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."RateType" AS ENUM ('DOMESTIC', 'EXPORT');

-- DropIndex
DROP INDEX "public"."onion_rates_date_stateId_mandiId_quality_sizeMm_packing_key";

-- AlterTable
ALTER TABLE "public"."onion_rates" ADD COLUMN     "country" TEXT,
ADD COLUMN     "rateType" "public"."RateType" NOT NULL DEFAULT 'DOMESTIC',
ALTER COLUMN "stateId" DROP NOT NULL,
ALTER COLUMN "mandiId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "onion_rates_rateType_date_stateId_mandiId_country_quality_s_key" ON "public"."onion_rates"("rateType", "date", "stateId", "mandiId", "country", "quality", "sizeMm", "packing");
