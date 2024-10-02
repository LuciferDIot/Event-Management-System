import { z } from "zod";

export const userEventSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  event: z.string().min(1, "Event ID is required"),
  status: z.enum(["Pending", "Completed", "Overdue"]).optional(),
  note: z.string().optional(),
});

export type UserEvent = z.infer<typeof userEventSchema>;
