import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"), // Make safe password,
  email: z.string().email("Invalid email"),
  profileImgUrl: z.string().nullable().optional(),
  idBrandMaster: z.number().optional(),
  isActive: z.boolean().optional().default(false),
});

export type Tregister = z.infer<typeof registerSchema>;
