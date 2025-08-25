-- CreateTable
CREATE TABLE "public"."onion_rates" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "stateId" INTEGER NOT NULL,
    "mandiId" INTEGER NOT NULL,
    "quality" "public"."Quality" NOT NULL,
    "sizeMm" INTEGER NOT NULL,
    "packing" "public"."Packing" NOT NULL,
    "pricePerKg" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onion_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "onion_rates_date_idx" ON "public"."onion_rates"("date");

-- CreateIndex
CREATE UNIQUE INDEX "onion_rates_date_stateId_mandiId_quality_sizeMm_packing_key" ON "public"."onion_rates"("date", "stateId", "mandiId", "quality", "sizeMm", "packing");

-- AddForeignKey
ALTER TABLE "public"."onion_rates" ADD CONSTRAINT "onion_rates_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."states"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."onion_rates" ADD CONSTRAINT "onion_rates_mandiId_fkey" FOREIGN KEY ("mandiId") REFERENCES "public"."mandis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
