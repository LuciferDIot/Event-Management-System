// src/hooks/useFetchEvents.ts
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { getAllEvents, getUserEvents } from "@/lib/actions/event.actions"; // Adjust the import path as necessary
import { handleError } from "@/lib/utils";
import { useEventStore } from "@/stores/eventsStore";
import { ResponseStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useFetchEvents = () => {
  const router = useRouter();
  const { setEvents, events } = useEventStore();
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchEvents = async (page: number = 1, limit: number = 10) => {
    try {
      const response = await getAllEvents(page, limit, token);

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setEvents(response.field);
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
        errorRecreate.message || "An error occurred while fetching events."
      );
    }
  };

  const fetchUserEvents = async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      if (!token) {
        setErrorMessage("Token is undefined.");
        router.push(ROUTES.LOGIN);

        return;
      }
      const response = await getUserEvents(userId, token, page, limit);

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          setEvents(response.field);
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

  useEffect(() => {
    // Set the component as mounted
    setIsMounted(true);
    fetchEvents(); // Fetch events initially
  }, [token, setEvents]);

  return { events, errorMessage, isMounted, fetchEvents, fetchUserEvents };
};

export default useFetchEvents;
