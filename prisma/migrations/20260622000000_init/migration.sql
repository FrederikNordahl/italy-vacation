-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserIdentityName" AS ENUM ('Anja', 'Per', 'Sarah', 'Frederik', 'Joan', 'Jane', 'Soren', 'Esther');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('Wine', 'Food', 'Sightseeing', 'Nature', 'Swimming', 'Historic', 'Event', 'Relaxation', 'Other');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Idea', 'Planned', 'Booked', 'Completed');

-- CreateTable
CREATE TABLE "UserIdentity" (
    "id" TEXT NOT NULL,
    "name" "UserIdentityName" NOT NULL,

    CONSTRAINT "UserIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "category" "ActivityCategory" NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'Idea',
    "driveTimeMinutes" INTEGER,
    "distanceKm" DOUBLE PRECISION,
    "estimatedDurationHours" DOUBLE PRECISION,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "scheduledDate" DATE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "aiSummary" TEXT,
    "aiDescription" TEXT,
    "aiTips" TEXT,
    "aiHighlights" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityImage" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLink" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ActivityLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "userName" "UserIdentityName" NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "userName" "UserIdentityName" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserIdentity_name_key" ON "UserIdentity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_activityId_userName_key" ON "Vote"("activityId", "userName");

-- AddForeignKey
ALTER TABLE "ActivityImage" ADD CONSTRAINT "ActivityImage_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLink" ADD CONSTRAINT "ActivityLink_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
