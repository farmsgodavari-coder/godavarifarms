-- CreateTable
CREATE TABLE "public"."rate_histories" (
    "id" SERIAL NOT NULL,
    "onionRateId" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "oldValues" JSONB NOT NULL,
    "newValues" JSONB NOT NULL,

    CONSTRAINT "rate_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."market_updates" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."announcements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isTicker" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media_assets" (
    "id" SERIAL NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."site_settings" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_cache" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rate_histories_onionRateId_idx" ON "public"."rate_histories"("onionRateId");

-- CreateIndex
CREATE INDEX "market_updates_date_idx" ON "public"."market_updates"("date");

-- CreateIndex
CREATE INDEX "announcements_published_idx" ON "public"."announcements"("published");

-- CreateIndex
CREATE INDEX "announcements_isTicker_idx" ON "public"."announcements"("isTicker");

-- CreateIndex
CREATE UNIQUE INDEX "site_settings_key_key" ON "public"."site_settings"("key");

-- CreateIndex
CREATE INDEX "report_cache_name_idx" ON "public"."report_cache"("name");

-- AddForeignKey
ALTER TABLE "public"."rate_histories" ADD CONSTRAINT "rate_histories_onionRateId_fkey" FOREIGN KEY ("onionRateId") REFERENCES "public"."onion_rates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
