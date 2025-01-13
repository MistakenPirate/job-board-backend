/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Job` table. All the data in the column will be lost.
  - You are about to alter the column `salary` on the `Job` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Job` DROP COLUMN `updatedAt`,
    MODIFY `salary` VARCHAR(191) NOT NULL;
