"use server";

import { EventData } from "@/types"; // Ensure the path is correct
import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import Event from "../database/models/event.model";
import { handleError } from "../utils";

// Create a new event
export const createEvent = async (eventData: EventData) => {
  try {
    await connectToDatabase();

    // Check if category exists; if not, create it
    const categoryExists = await Category.findOne({
      name: eventData.category.name,
    });
    let categoryId;

    if (!categoryExists) {
      const newCategory = await Category.create({
        name: eventData.category.name,
      });
      categoryId = newCategory._id;
    } else {
      categoryId = categoryExists._id;
    }

    const newEvent = await Event.create({ ...eventData, category: categoryId });
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
};

// Get events based on user ID and status
export const getUserEvents = async (userId: string) => {
  try {
    await connectToDatabase();
    const events = await Event.find({
      organizer: userId,
      status: { $in: ["Pending", "Overdue"] },
    });
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    handleError(error);
  }
};

// Update event status
export const updateEventStatus = async (
  eventId: string,
  newStatus: "Pending" | "Completed" | "Overdue"
) => {
  try {
    await connectToDatabase();
    await Event.findByIdAndUpdate(eventId, { status: newStatus });
  } catch (error) {
    handleError(error);
  }
};
