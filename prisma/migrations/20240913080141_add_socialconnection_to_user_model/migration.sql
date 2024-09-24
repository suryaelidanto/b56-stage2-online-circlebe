-- CreateEnum
CREATE TYPE "SocialConnection" AS ENUM ('GOOGLE', 'FACEBOOK', 'GITHUB');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "socialConnection" "SocialConnection",
ALTER COLUMN "password" DROP NOT NULL;
