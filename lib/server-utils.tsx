"use server";
import { IResponse, ResponseStatus } from "@/types";
import { MongoServerError } from "mongodb";

export const handleServerError = (error: unknown): IResponse<string> | null => {
  if (error instanceof MongoServerError) {
    // MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return {
        status: ResponseStatus.Error,
        message: `${duplicateField} already exists. Please use a different one.`,
        field: duplicateField,
        code: 11000,
      };
    } else {
      return null;
    }
  }

  return null;
};
