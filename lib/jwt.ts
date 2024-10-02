"use server";
import { IResponse, ResponseStatus } from "@/types";
import jwt from "jsonwebtoken";

// Utility to verify JWT
export const verifyToken = async (
  token: string
): Promise<IResponse<string | jwt.JwtPayload>> => {
  if (!token) {
    return {
      status: ResponseStatus.Error,
      message: "No token provided",
      code: 401,
      field: "Unauthorized",
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return {
      status: ResponseStatus.Success,
      message: "Token verified",
      code: 200,
      field: decoded,
    };
  } catch (error) {
    return {
      status: ResponseStatus.Error,
      message:
        error instanceof Error ? error.message : "Invalid or expired token",
      code: 401,
      field: "Unauthorized",
    };
  }
};
