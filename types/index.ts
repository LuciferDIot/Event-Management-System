import mongoose, { Document } from "mongoose";

// ====== MONGOOSE CACHE
export interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ====== MONGOOSE MODELS
export enum UserRole {
  User = "User",
  Admin = "Admin",
}

export enum UserStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface IUser extends Document {
  _id: string;
  role: UserRole;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  isActive: boolean;
  token?: string;
}

// ====== USER PARAMS
export interface UserData {
  _id?: string; // User ID
  role: UserRole;
  email: string; // User email
  username: string; // User's username
  firstName: string; // User's first name
  lastName: string; // User's last name
  password: string; // User's password
  isActive?: boolean; // Optional, defaults to true
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
  category: ICategory;
  organizer: IUser;
}

export interface IUserEvent extends Document {
  _id: string;
  user: IUser; // Reference to User ID
  event: IEvent; // Reference to Event ID
  status?: UserEventStatus; // Optional field
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
  category: ICategory;
  organizer: IUser;
}

// ====== USER-EVENT PARAMS
export enum UserEventStatus {
  Pending = "Pending",
  Completed = "Completed",
  Overdue = "Overdue",
}

export interface EventDue {
  userId: string; // Reference to the user
  eventId: string; // Reference to the event
  status?: UserEventStatus; // Optional status
  note?: string; // Optional note
}

// ====== RESPONSE HANDLING
export enum ResponseStatus {
  Success = "success",
  Error = "error",
}

export interface IResponse<T> {
  status: ResponseStatus;
  message: string;
  code?: number;
  field?: T;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

// ====== LOGIN RESPONSE
export interface ILoginResponse {
  token: string;
  user: IUser;
}

// ====== JWT TOKEN
export interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole[];
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

// ====== TABLE TYPES
