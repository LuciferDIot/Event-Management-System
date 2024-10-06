import { UserEventStatus } from "@/types";

export const ROUTES = {
  LOGIN: "/login",
  USERS: "/users",
  EVENTS: "/",
  ABOUT: "/about",
  CREATE_EVENT: "/events/create",
  USER_EVENTS: "/events",
  VIEW_EVENT: "/events/view",
};

export const userEventStatusStyles = {
  [UserEventStatus.Pending]: "bg-yellow-500 bg-opacity-50 text-yellow-800",
  [UserEventStatus.Completed]: "bg-green-100 text-green-800",
  [UserEventStatus.Overdue]: "bg-red-100 text-red-800",
};
