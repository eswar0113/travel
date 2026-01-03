-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "coverImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "trips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "order" INTEGER NOT NULL,
    "notes" TEXT,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "stops_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "duration" INTEGER,
    "cost" REAL NOT NULL DEFAULT 0,
    "location" TEXT,
    "imageUrl" TEXT,
    "bookingUrl" TEXT,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "stopId" TEXT NOT NULL,
    CONSTRAINT "activities_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "stops" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "expenses_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "shared_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareToken" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "shared_trips_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "saved_cities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cityName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "saved_cities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "costIndex" REAL NOT NULL DEFAULT 50,
    "popularity" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "activity_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "estimatedCost" REAL NOT NULL DEFAULT 0,
    "estimatedDuration" INTEGER,
    "imageUrl" TEXT,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "cityName" TEXT,
    "country" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "trips_userId_idx" ON "trips"("userId");

-- CreateIndex
CREATE INDEX "stops_tripId_idx" ON "stops"("tripId");

-- CreateIndex
CREATE INDEX "activities_stopId_idx" ON "activities"("stopId");

-- CreateIndex
CREATE INDEX "activities_date_idx" ON "activities"("date");

-- CreateIndex
CREATE INDEX "expenses_tripId_idx" ON "expenses"("tripId");

-- CreateIndex
CREATE INDEX "expenses_category_idx" ON "expenses"("category");

-- CreateIndex
CREATE UNIQUE INDEX "shared_trips_shareToken_key" ON "shared_trips"("shareToken");

-- CreateIndex
CREATE INDEX "shared_trips_shareToken_idx" ON "shared_trips"("shareToken");

-- CreateIndex
CREATE INDEX "shared_trips_tripId_idx" ON "shared_trips"("tripId");

-- CreateIndex
CREATE INDEX "saved_cities_userId_idx" ON "saved_cities"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_cities_userId_cityName_country_key" ON "saved_cities"("userId", "cityName", "country");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_country_key" ON "cities"("name", "country");

-- CreateIndex
CREATE INDEX "activity_templates_category_idx" ON "activity_templates"("category");

-- CreateIndex
CREATE INDEX "activity_templates_cityName_idx" ON "activity_templates"("cityName");
