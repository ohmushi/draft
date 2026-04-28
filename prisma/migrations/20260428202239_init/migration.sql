-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "tag" TEXT,
    "time" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_slug_key" ON "Entry"("slug");
