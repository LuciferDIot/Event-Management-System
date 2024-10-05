import {
  DecodedToken,
  IResponse,
  IUser,
  ResponseStatus,
  UserRole,
} from "@/types";
import jwt from "jsonwebtoken";
import { getUserByUserId } from "./actions/user.actions";

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

// Common method to verify token and check user roles, token expiry, and user status
export const verifyToken = async (
  token: string,
  allowedRoles: UserRole[]
): Promise<IResponse<string | IUser>> => {
  try {
    // Verify the token and decode it
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // Get the user by userId and check if user exists and is active
    const userResponse = await getUserByUserId(decoded._id);

    if (userResponse.status === ResponseStatus.Error) {
      return userResponse; // Return the error if the user does not exist or is deactivated
    }

    // Ensure userRoles is an array
    const userRoles = Array.isArray(decoded.role)
      ? decoded.role
      : [decoded.role];

    // Check if the user has the required roles
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
      field: userResponse.field,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        status: ResponseStatus.Error,
        message: "Token has expired. Please login again.",
        code: 401,
        field: "ExpiredToken",
      };
    } else if (error instanceof Error) {
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
