"use server";
import { DecodedToken, IResponse, ResponseStatus, UserRole } from "@/types";
import jwt from "jsonwebtoken";

// Utility function to check user roles
export const hasRole = (userRoles: string[], allowedRoles: string[]) => {
  return allowedRoles.some((role) => userRoles.includes(role));
};

// Utility to generate JWT
export const generateToken = (payload: jwt.JwtPayload) => {
  const output = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return output;
};

// Common method to verify token and check user roles
export const verifyToken = async (
  token: string,
  allowedRoles: UserRole[]
): Promise<IResponse<string | DecodedToken>> => {
  try {
    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // Ensure userRoles is an array
    const userRoles = Array.isArray(decoded.role)
      ? decoded.role
      : [decoded.role];

    // Check if user has the required role
    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
      return {
        status: ResponseStatus.Error,
        message:
          "Forbidden: You do not have permission to perform this action.",
        code: 403,
        field: "Forbidden",
      };
    }

    return {
      status: ResponseStatus.Success,
      message: "Token is valid and role is authorized.",
      code: 200,
      field: decoded, // Return the decoded token
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: ResponseStatus.Error,
        message: error.message,
        code: 401,
        field: "Unauthorized",
      };
    } else {
      return {
        status: ResponseStatus.Error,
        message: "Invalid token",
        code: 401,
        field: "Unauthorized",
      };
    }
  }
};
