/*
  Warnings:

  - You are about to drop the column `shareToken` on the `shared_trips` table. All the data in the column will be lost.
  - The required column `shareId` was added to the `shared_trips` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_shared_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shareId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "shared_trips_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_shared_trips" ("createdAt", "expiresAt", "id", "isPublic", "tripId", "views") SELECT "createdAt", "expiresAt", "id", "isPublic", "tripId", "views" FROM "shared_trips";
DROP TABLE "shared_trips";
ALTER TABLE "new_shared_trips" RENAME TO "shared_trips";
CREATE UNIQUE INDEX "shared_trips_shareId_key" ON "shared_trips"("shareId");
CREATE UNIQUE INDEX "shared_trips_tripId_key" ON "shared_trips"("tripId");
CREATE INDEX "shared_trips_shareId_idx" ON "shared_trips"("shareId");
CREATE INDEX "shared_trips_tripId_idx" ON "shared_trips"("tripId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
