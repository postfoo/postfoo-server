/*
  Warnings:

  - A unique constraint covering the columns `[portfolioId,name]` on the table `Field` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Field_portfolioId_name_key" ON "Field"("portfolioId", "name");
