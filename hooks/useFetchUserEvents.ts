// src/hooks/useFetchUserEvents.ts
import { useAuth } from "@/hooks/useAuth";
import {
  createUserEvent,
  getEventUsers,
  getUserEvents,
  removeUserEvent,
} from "@/lib/actions/userEvent.actions";
import { handleError } from "@/lib/utils";
import { useUserEventStore } from "@/stores/userEventStore";
import { IUserEvent, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";

const useFetchUserEvents = (userId?: string, eventId?: string) => {
  const { setUserEvents, userEvents, hasHydrated } = useUserEventStore(); // Access hasHydrated
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [eventUsers, setEventUsers] = useState<IUserEvent[]>([]); // State for event users

  const fetchUserEvents = async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getUserEvents(userId, page, limit, token);

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setUserEvents(response.field);
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
        errorRecreate.message || "An error occurred while fetching user events."
      );
    }
  };

  const fetchEventUsers = async (
    eventId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getEventUsers(eventId, page, limit, token); // Call new action

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

  const addUserEvent = async (userId: string, eventId: string) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await createUserEvent(userId, eventId, token);

      if (response.status === ResponseStatus.Success) {
        await fetchUserEvents(userId);
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
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await removeUserEvent(userId, eventId, token);

      if (response.status === ResponseStatus.Success) {
        await fetchUserEvents(userId); // Refresh the user events after deletion
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

  useEffect(() => {
    if (hasHydrated) {
      // Only fetch user events if hasHydrated is true
      if (userId) {
        fetchUserEvents(userId);
      }
      if (eventId) {
        fetchEventUsers(eventId); // Fetch event users if eventId is provided
      }
      setIsMounted(true);
    }
  }, [hasHydrated, token, userId, eventId]); // Run effect when hasHydrated or token changes

  return {
    userEvents,
    eventUsers, // Return event users as well
    errorMessage,
    isMounted,
    fetchUserEvents,
    fetchEventUsers, // Expose fetchEventUsers
    addUserEvent,
    deleteUserEvent,
  };
};

export default useFetchUserEvents;
