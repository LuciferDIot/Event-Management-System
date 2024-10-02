import { z } from "zod";

export const userSchema = z.object({
  id: z.string().min(1, "ID is required"),
  email: z.string().email("Invalid email format"),
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  isActive: z.boolean().optional(),
});

export type User = z.infer<typeof userSchema>;
