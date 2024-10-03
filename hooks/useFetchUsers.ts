// src/hooks/useFetchUsers.ts
import { useAuth } from "@/hooks/useAuth";
import { getAllUsers } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";
import { IUser, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";

const useFetchUsers = () => {
  const { setUsers } = useUserStore();
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const fetchUsers = async () => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }

    try {
      const response = await getAllUsers(token);

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

  useEffect(() => {
    // Set the component as mounted
    setIsMounted(true);
    fetchUsers();
  }, [token, setUsers]);

  return { errorMessage, isMounted, fetchUsers }; // Return fetchUsers
};

export default useFetchUsers;
