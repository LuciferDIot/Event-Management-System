// src/hooks/useFetchEvents.ts
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { getAllEvents, getUserEvents } from "@/lib/actions/event.actions";
import { handleError } from "@/lib/utils";
import { useEventStore } from "@/stores/eventsStore";
import { ResponseStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useFetchEvents = () => {
  const router = useRouter();
  const { setEvents, events, hasHydrated } = useEventStore(); // Access hasHydrated
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchEvents = async (page: number = 1, limit: number = 10) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

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
    if (!token) {
      setErrorMessage("Token is undefined.");
      router.push(ROUTES.LOGIN);
      return;
    }

    try {
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
    if (hasHydrated) {
      fetchEvents(); // Fetch events only after hydration
      setIsMounted(true); // Set the component as mounted after fetching
    }
  }, [hasHydrated, token]); // Run effect when hasHydrated or token changes

  return { events, errorMessage, isMounted, fetchEvents, fetchUserEvents };
};

export default useFetchEvents;
