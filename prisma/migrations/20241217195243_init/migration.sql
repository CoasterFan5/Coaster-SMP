-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "discordId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
