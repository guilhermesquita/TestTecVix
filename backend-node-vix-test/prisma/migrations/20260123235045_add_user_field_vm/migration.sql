-- DropIndex
DROP INDEX `user_email_key` ON `user`;

-- AlterTable
ALTER TABLE `user` MODIFY `isActive` BOOLEAN NULL DEFAULT true,
    MODIFY `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `vM` MODIFY `hasBackup` BOOLEAN NULL DEFAULT false,
    MODIFY `createdAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `updatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- RenameIndex
ALTER TABLE `vM` RENAME INDEX `vM_idBrandMaster_fkey` TO `VM_idBrandMaster_fkey`;

-- RenameIndex
ALTER TABLE `vM` RENAME INDEX `vM_idUser_fkey` TO `VM_idUser_fkey`;
