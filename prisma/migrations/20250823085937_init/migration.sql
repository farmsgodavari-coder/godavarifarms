-- CreateEnum
CREATE TYPE "public"."Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- CreateEnum
CREATE TYPE "public"."Quality" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "public"."Packing" AS ENUM ('LOOSE', 'BAG', 'BOX');

-- CreateTable
CREATE TABLE "public"."states" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mandis" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "mandis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_prices" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "stateId" INTEGER NOT NULL,
    "mandiId" INTEGER NOT NULL,
    "size" "public"."Size" NOT NULL,
    "quality" "public"."Quality" NOT NULL,
    "packing" "public"."Packing" NOT NULL,
    "minPrice" DECIMAL(10,2) NOT NULL,
    "avgPrice" DECIMAL(10,2) NOT NULL,
    "maxPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "states_name_key" ON "public"."states"("name");

-- CreateIndex
CREATE UNIQUE INDEX "mandis_name_stateId_key" ON "public"."mandis"("name", "stateId");

-- CreateIndex
CREATE INDEX "daily_prices_date_idx" ON "public"."daily_prices"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_prices_date_stateId_mandiId_size_quality_packing_key" ON "public"."daily_prices"("date", "stateId", "mandiId", "size", "quality", "packing");

-- AddForeignKey
ALTER TABLE "public"."mandis" ADD CONSTRAINT "mandis_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_prices" ADD CONSTRAINT "daily_prices_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_prices" ADD CONSTRAINT "daily_prices_mandiId_fkey" FOREIGN KEY ("mandiId") REFERENCES "public"."mandis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
