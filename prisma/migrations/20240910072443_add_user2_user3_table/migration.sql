-- CreateTable
CREATE TABLE "users2" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "users2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users3" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "users3_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users2_email_key" ON "users2"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users3_email_key" ON "users3"("email");
