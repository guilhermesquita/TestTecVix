/*
  Warnings:

  - Added the required column `location` to the `vM` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `vM` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vM` ADD COLUMN `location` ENUM('BRAZIL_SOUTH', 'BRAZIL_SOUTHEAST', 'BRAZIL_NORTHEAST', 'US_EAST', 'US_WEST', 'EUROPE', 'ASIA') NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;
