-- CreateTable
CREATE TABLE "packing_lists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "packing_lists_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "packing_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packingListId" TEXT NOT NULL,
    CONSTRAINT "packing_items_packingListId_fkey" FOREIGN KEY ("packingListId") REFERENCES "packing_lists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "packing_lists_tripId_key" ON "packing_lists"("tripId");

-- CreateIndex
CREATE INDEX "packing_items_packingListId_idx" ON "packing_items"("packingListId");
