// src/hooks/useFetchUserEvents.ts
import { useAuth } from "@/hooks/useAuth";
import {
  createUserEvent,
  getUserEvents,
  removeUserEvent,
} from "@/lib/actions/userEvent.actions";
import { handleError } from "@/lib/utils";
import { useUserEventStore } from "@/stores/userEventStore";
import { ResponseStatus } from "@/types";
import { useEffect, useState } from "react";

const useFetchUserEvents = () => {
  const { setUserEvents, userEvents, hasHydrated } = useUserEventStore(); // Access hasHydrated
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

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

  const addUserEvent = async (userId: string, eventId: string) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await createUserEvent(userId, eventId, token);

      if (response.status === ResponseStatus.Success) {
        await fetchUserEvents(userId); // Refresh the user events after adding
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
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
      const userId = "some-user-id"; // Replace with the actual user ID
      fetchUserEvents(userId);
      setIsMounted(true); // Set the component as mounted after fetching
    }
  }, [hasHydrated, token]); // Run effect when hasHydrated or token changes

  return {
    userEvents,
    errorMessage,
    isMounted,
    fetchUserEvents,
    addUserEvent,
    deleteUserEvent,
  };
};

export default useFetchUserEvents;
