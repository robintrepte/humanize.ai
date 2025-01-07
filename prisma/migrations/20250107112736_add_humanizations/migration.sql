-- CreateTable
CREATE TABLE "Humanization" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "inputText" TEXT NOT NULL,
    "outputText" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Humanization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Humanization" ADD CONSTRAINT "Humanization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
