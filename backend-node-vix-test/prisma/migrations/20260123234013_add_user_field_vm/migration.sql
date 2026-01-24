/*
  Warnings:

  - Added the required column `idUser` to the `vM` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vM` ADD COLUMN `idUser` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `vM` ADD CONSTRAINT `vM_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE RESTRICT ON UPDATE CASCADE;
