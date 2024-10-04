import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z
    .string()
    .url("Invalid URL format")
    .min(1, "Image URL is required"),
  startDateTime: z.date(),
  endDateTime: z.date().refine((date) => date > new Date(), {
    message: "End date must be in the future",
  }),
  price: z.string().optional(),
  isFree: z.boolean().optional(),
  url: z.string().url("Invalid URL format").optional(),
  slots: z.number().min(1, "Slots must be at least 1").default(100),
  category: z.object({
    name: z.string(), // Only the name is required for event creation
  }),
  organizer: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  status: z.enum(["Pending", "Completed", "Overdue"]).optional(),
  note: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;

// ====== CREATE EVENT SCHEMA

export const createEventSchema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .nonempty("Image URL is required"),
  startDateTime: z.date(),
  endDateTime: z.date(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url().optional(),
  slots: z.number().int().positive("Must be a positive number"),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
});
