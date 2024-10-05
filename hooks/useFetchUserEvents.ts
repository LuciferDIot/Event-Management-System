// src/hooks/useFetchUserEvents.ts
import { useAuth } from "@/hooks/useAuth";
import {
  createUserEvent,
  getEventUsers,
  getUserEventById,
  getUserEvents,
  getUserEventsByCategoryId,
  removeUserEvent,
} from "@/lib/actions/userEvent.actions";
import { handleError } from "@/lib/utils";
import { useUserEventStore } from "@/stores/userEventStore";
import { IUserEvent, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";

const useFetchUserEvents = ({
  eventId,
  userId,
  page = 1, // Default page set to 1
  limit = 6, // Default limit
}: {
  userId?: string;
  eventId?: string;
  page?: number;
  limit?: number;
}) => {
  const {
    setUserEvents,
    userEvents,
    hasHydrated,
    categoryUserEvents,
    setCategoryUserEvents,
  } = useUserEventStore();
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [eventUsers, setEventUsers] = useState<IUserEvent[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [specificUserEvent, setSpecificUserEvent] = useState<IUserEvent | null>(
    null
  );

  const fetchUserEvents = async (
    userId: string,
    page: number,
    limit: number
  ) => {
    setErrorMessage(null);
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getUserEvents(userId, token, page, limit);
      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setUserEvents(response.field);
          setTotalPages(response.totalPages ?? 1);
        } else {
          throw new Error("Invalid response field.");
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      setErrorMessage(
        errorRecreate.message || "An error occurred while fetching user events."
      );
    }
  };

  const fetchEventUsers = async (
    eventId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    setErrorMessage(null);
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getEventUsers(eventId, token, page, limit); // Call new action

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setEventUsers(response.field);
        } else {
          throw new Error("Invalid response field.");
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      console.error(error);
      setErrorMessage(
        errorRecreate.message || "An error occurred while fetching event users."
      );
    }
  };

  const fetchUserEventById = async (userEventId: string) => {
    setErrorMessage(null);

    // Check if the token is available
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getUserEventById(userEventId, token);
      console.log("API response:", response); // Log the response to inspect

      // Ensure response is defined and has the expected properties
      if (response && response.status === ResponseStatus.Success) {
        if (response.field) {
          if (typeof response.field !== "string") {
            setSpecificUserEvent(response.field as IUserEvent); // Set the event data
          } else {
            throw new Error(response.field); // If `field` is a string, treat it as an error message
          }
        } else {
          throw new Error("Invalid response field.");
        }
      } else if (response) {
        setErrorMessage(response.message || "Unknown error occurred.");
      } else {
        throw new Error("No response from server.");
      }
    } catch (error) {
      // Log the error and display a user-friendly message
      console.error("Error fetching user event:", error);
      const errorRecreate = handleError(error);
      setErrorMessage(
        errorRecreate.message ||
          "An error occurred while fetching the specific user event."
      );
    }
  };

  const addUserEvent = async (userId: string, eventId: string) => {
    setErrorMessage(null);
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await createUserEvent(userId, eventId, token);

      if (response.status === ResponseStatus.Success) {
        await fetchEventUsers(eventId);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = await handleError(error);
      console.error(error);
      setErrorMessage(
        errorRecreate.message || "An error occurred while adding user event."
      );
    }
  };

  const deleteUserEvent = async (userId: string, eventId: string) => {
    setErrorMessage(null);
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await removeUserEvent(userId, eventId, token);

      if (response.status === ResponseStatus.Success) {
        await fetchEventUsers(eventId);
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      console.error(error);
      setErrorMessage(
        errorRecreate.message || "An error occurred while removing user event."
      );
    }
  };

  const fetchUserEventsByCategoryId = async (
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getUserEventsByCategoryId(
        categoryId,
        token,
        page,
        limit
      );

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setCategoryUserEvents(response.field);
          setTotalPages(response.totalPages ?? 1); // Update total pages if available
        } else {
          throw new Error("Invalid response field.");
        }
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      setErrorMessage(
        errorRecreate.message ||
          "An error occurred while fetching user events by category."
      );
    }
  };

  useEffect(() => {
    if (hasHydrated) {
      // Only fetch user events if hasHydrated is true
      if (userId) {
        fetchUserEvents(userId, page, limit);
      }
      if (eventId) {
        fetchEventUsers(eventId); // Fetch event users if eventId is provided
      }
      setIsMounted(true);
    }
  }, [hasHydrated, token, userId, eventId]); // Run effect when hasHydrated or token changes

  return {
    userEvents,
    eventUsers,
    specificUserEvent,
    errorMessage,
    isMounted,
    categoryUserEvents,
    fetchUserEvents,
    fetchEventUsers,
    fetchUserEventById,
    addUserEvent,
    deleteUserEvent,
    fetchUserEventsByCategoryId,
    totalPages,
  };
};

export default useFetchUserEvents;
