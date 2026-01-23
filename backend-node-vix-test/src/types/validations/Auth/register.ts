import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"), // Make safe password,
  email: z.string().email("Invalid email"),
  idBrandMaster: z.number().optional(),
});

export type Tregister = z.infer<typeof registerSchema>;
