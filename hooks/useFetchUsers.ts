// src/hooks/useFetchUsers.ts
import { useAuth } from "@/hooks/useAuth";
import { getAllMembers, getAllUsers } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";
import { IUser, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";

const useFetchUsers = () => {
  const { setUsers, setNonAdminUsers, hasHydrated, nonAdminUsers, users } =
    useUserStore(); // Access hasHydrated
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchUsers = async () => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getAllMembers(token);

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          const fetchedUsers: IUser[] = response.field.map(
            (user: IUser) =>
              ({
                ...user,
                token: token,
              } as IUser)
          );
          setUsers(fetchedUsers);
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
        errorRecreate.message || "An error occurred while fetching users."
      );
    }
  };

  const fetchNonAdminUsers = async (page?: number, limit?: number) => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getAllUsers(token, page, limit);

      if (response.status === ResponseStatus.Success) {
        if (response.field && Array.isArray(response.field)) {
          const fetchedUsers: IUser[] = response.field.map(
            (user: IUser) =>
              ({
                ...user,
                token: token,
              } as IUser)
          );
          setNonAdminUsers(fetchedUsers);
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
        errorRecreate.message ||
          "An error occurred while fetching non-admin users."
      );
    }
  };

  useEffect(() => {
    // Only fetch users if the store has been hydrated
    if (hasHydrated) {
      fetchUsers();
      fetchNonAdminUsers();
      setIsMounted(true); // Set the component as mounted after fetching
    }
  }, [hasHydrated, token]); // Run effect when hasHydrated or token changes

  return {
    errorMessage,
    isMounted,
    fetchUsers,
    fetchNonAdminUsers,
    nonAdminUsers,
    users,
  };
};

export default useFetchUsers;
