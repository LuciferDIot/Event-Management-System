import {
  IResponse,
  RemoveUrlQueryParams,
  ResponseStatus,
  UrlQueryParams,
} from "@/types";
import { clsx, type ClassValue } from "clsx";
import { Error } from "mongoose";
import qs from "query-string";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "long", // full weekday name (e.g., 'Monday')
    month: "long", // full month name (e.g., 'October')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long", // full weekday name (e.g., 'Monday')
    month: "long", // full month name (e.g., 'October')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime, // e.g., 'Date & Time: Mon, Oct 25, 8:30 PM'
    dateOnly: formattedDate, // e.g., 'Date: Monday, October 25, 2023'
    timeOnly: formattedTime, // e.g., 'Time: 8:30 PM'
  };
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const formatPrice = (price: string) => {
  const amount = parseFloat(price);
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

  return formattedPrice;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

import mongoose from "mongoose";

export const handleError = (error: unknown): IResponse<string> => {
  console.error(error); // Log the actual error for debugging purposes

  // Handle Mongoose validation errors (e.g., schema validation errors)
  if (error instanceof mongoose.Error.ValidationError) {
    return {
      status: ResponseStatus.Error,
      message: "Validation error. Please check the provided data.",
      field: Object.keys(error.errors)[0],
    };
  }

  if (error instanceof Error) {
    // MongoDB duplicate key error
    interface MongoError extends Error {
      code: number;
      keyValue: Record<string, unknown>;
    }

    if ((error as MongoError).code === 11000) {
      const duplicateField = Object.keys((error as MongoError).keyValue)[0];
      return {
        status: ResponseStatus.Error,
        message: `${duplicateField} already exists. Please use a different one.`,
        field: duplicateField,
        code: 11000,
      };
    }

    // Handle network-related errors (e.g., Axios or Fetch errors)
    if (
      error.message.includes("Network Error") ||
      error.message.includes("ECONNREFUSED")
    ) {
      return {
        status: ResponseStatus.Error,
        message: "Network error. Please check your connection and try again.",
      };
    }

    // Handle authorization or authentication errors
    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("403")
    ) {
      return {
        status: ResponseStatus.Error,
        message:
          "Authorization error. You do not have permission to perform this action.",
      };
    }

    // Handle not found errors (e.g., 404)
    if (error.message.includes("Not Found") || error.message.includes("404")) {
      return {
        status: ResponseStatus.Error,
        message: "The requested resource could not be found.",
      };
    }

    // Handle bad request errors (e.g., 400)
    if (
      error.message.includes("Bad Request") ||
      error.message.includes("400")
    ) {
      return {
        status: ResponseStatus.Error,
        message: "Bad request. Please verify your input and try again.",
      };
    }

    // Handle MongoDB connection errors using class check
    if (error instanceof mongoose.Error.MongooseServerSelectionError) {
      return {
        status: ResponseStatus.Error,
        message:
          "Could not connect to MongoDB. Ensure your IP is whitelisted and check your connection.",
      };
    }
  }

  // Handle general unexpected errors
  return {
    status: ResponseStatus.Error,
    message: "An unexpected error occurred. Please try again.",
  };
};
