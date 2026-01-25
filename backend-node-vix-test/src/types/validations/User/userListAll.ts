import { z } from "zod";
import { ERole } from "@prisma/client";

export const userListAllSchema = z.object({
  query: z.object({
    idUser: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : undefined))
      .refine((val) => val === undefined || !isNaN(val), {
        message: "idUser must be a valid number",
      }),
    username: z.string().min(1).max(255).optional(),
    email: z.string().email().optional(),
    role: z
      .string()
      .optional()
      .transform((val) => (val ? (val.toUpperCase() as ERole) : undefined))
      .refine(
        (val) =>
          val === undefined || Object.values(ERole).includes(val as ERole),
        {
          message: `Role must be one of: ${Object.values(ERole).join(", ")}`,
        },
      ),
    isActive: z
      .string()
      .optional()
      .transform((val) =>
        val === "true" ? true : val === "false" ? false : undefined,
      ),
    lastLoginDate: z.coerce.date().optional(),
    idBrandMaster: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "idBrandMaster must be a valid positive number",
      })
      .optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1))
      .refine((val) => !isNaN(val) && val > 0, {
        message: "page must be a valid positive number",
      }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10))
      .refine((val) => !isNaN(val) && val > 0 && val <= 100, {
        message: "limit must be a valid number between 1 and 100",
      }),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

export type TUserListAll = z.infer<typeof userListAllSchema>;
