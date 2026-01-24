import { ETaskLocation } from "@prisma/client";
import { z } from "zod";

const EVMStatus = z.enum(["RUNNING", "STOPPED", "PAUSED"]);
// Password validation regex
export const passwordRegex = {
  numbers: /(?=.*\d.*\d)/,
  lowercase: /(?=.*[a-z].*[a-z])/,
  uppercase: /(?=.*[A-Z].*[A-Z])/,
  special:
    /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
};

export const vMCreatedSchema = z.object({
  vmName: z.string().optional(),
  vCPU: z.number().min(1, "vCPU must be at least 1").max(16, "vCPU must be at most 16"),
  ram: z.number().min(1, "RAM must be at least 1 GB").max(128, "RAM must be at most 128 GB"),
  disk: z.number().min(20, "Disk must be at least 20 GBs").max(2048, "Disk must be at most 2048 GBs"),
  hasBackup: z.boolean().optional().default(false),
  location: z.nativeEnum(ETaskLocation),
  pass: z
    .string()
    .regex(passwordRegex.numbers, "Password must contain at least 2 numbers")
    .regex(passwordRegex.lowercase, "Password must contain at least 2 lowercase letters")
    .regex(passwordRegex.uppercase, "Password must contain at least 2 uppercase letters")
    .regex(passwordRegex.special, "Password must contain at least 2 special characters"),
  idBrandMaster: z.number().nullable().optional(),
  status: EVMStatus.optional(),
  os: z.string().optional(),
});

export type TVMCreate = z.infer<typeof vMCreatedSchema>;
