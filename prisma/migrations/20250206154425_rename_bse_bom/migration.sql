/*
  Warnings:

  - The values [BSE] on the enum `Exchange` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Exchange_new" AS ENUM ('BOM', 'NSE', 'NYSE', 'LSE', 'NASDAQ');
ALTER TABLE "Stock" ALTER COLUMN "exchange" TYPE "Exchange_new" USING ("exchange"::text::"Exchange_new");
ALTER TYPE "Exchange" RENAME TO "Exchange_old";
ALTER TYPE "Exchange_new" RENAME TO "Exchange";
DROP TYPE "Exchange_old";
COMMIT;
