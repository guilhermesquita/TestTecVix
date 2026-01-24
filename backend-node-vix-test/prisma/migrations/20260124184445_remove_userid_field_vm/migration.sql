/*
  Warnings:

  - You are about to drop the column `idUser` on the `vM` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `vM` DROP FOREIGN KEY `vM_idUser_fkey`;

-- AlterTable
ALTER TABLE `vM` DROP COLUMN `idUser`;
