import mongoose, { Document } from "mongoose";

// ====== MONGOOSE CACHE
export interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ====== MONGOOSE MODELS
export interface IUser extends Document {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive?: boolean; // Optional field
}

export interface ICategory extends Document {
  _id: string;
  name: string;
}

export interface IEvent extends Document {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  slots: number;
  category: { _id: string; name: string };
  organizer: { _id: string; firstName: string; lastName: string };
}

export interface IUserEvent extends Document {
  _id: string;
  user: IUser; // Reference to User ID
  event: IEvent; // Reference to Event ID
  status?: "Pending" | "Completed" | "Overdue"; // Optional field
  note?: string; // Optional field
}

// ====== CATEGORY PARAMS
export type CreateCategoryParams = {
  categoryName: string;
};

// ====== EVENT PARAMS
export interface EventData {
  title: string;
  description?: string;
  location?: string;
  imageUrl: string; // Ensure valid URL
  startDateTime: Date;
  endDateTime: Date; // Ensure it’s a future date
  price?: string;
  isFree?: boolean;
  url?: string; // Optional valid URL
  slots?: number; // Optional, defaults to 100
  category: {
    name: string; // The category name to search for or create
  };
  organizer: {
    _id: string; // ID of the user who is organizing the event
    firstName: string;
    lastName: string;
  };
}

// ====== USER PARAMS
export interface UserData {
  id: string; // User ID
  email: string; // User email
  username: string; // User's username
  firstName: string; // User's first name
  lastName: string; // User's last name
  password: string; // User's password
  isActive?: boolean; // Optional, defaults to true
}

// ====== USER-EVENT PARAMS
export interface UserEventData {
  userId: string; // Reference to the user
  eventId: string; // Reference to the event
  status?: "Pending" | "Completed" | "Overdue"; // Optional status
  note?: string; // Optional note
}

// ====== URL QUERY PARAMS
export type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type SearchParamProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
