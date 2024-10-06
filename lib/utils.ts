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

export const formatDateTimeNoCompare = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
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
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const formatDateTime = (inputDate: Date, otherDate?: Date) => {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // two-digit month (e.g., '10')
    day: "2-digit", // two-digit day (e.g., '04')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit", // two-digit hour (e.g., '08' or '20')
    minute: "2-digit", // two-digit minute (e.g., '30')
    hour12: false, // use 24-hour clock
  };

  const formattedDate: string = new Date(inputDate).toLocaleDateString(
    "en-CA", // Using en-CA locale to get 'YYYY/MM/DD' format
    dateOptions
  );

  const formattedTime: string = new Date(inputDate).toLocaleTimeString(
    "en-GB", // Using en-GB locale to ensure 24-hour format
    timeOptions
  );

  const getTimeDifferenceInDays = (d1: Date, d2: Date) => {
    const diffMs = Math.abs(d1.getTime() - d2.getTime()); // Difference in milliseconds
    return diffMs / (1000 * 60 * 60 * 24); // Convert to days
  };

  return {
    dateTime: otherDate
      ? getTimeDifferenceInDays(new Date(inputDate), new Date(otherDate)) < 1
        ? formattedTime // If only hours differ, show time only
        : formattedDate // If days differ, show date only
      : (() => {
          throw new Error("otherDate parameter is required for dateTime");
        })(),
    dateOnly: formattedDate, // e.g., '2023/10/04'
    timeOnly: formattedTime, // e.g., '20:30'
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
