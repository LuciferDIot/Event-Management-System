"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { getAllUsers } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { IUser, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";
import { userColumns } from "./columns";

function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // New state for errors
  const { token } = useAuth();

  const fetchUsers = async () => {
    if (!token) {
      setErrorMessage("Token is undefined.");
      return;
    }
    try {
      const response = await getAllUsers(token);

      if (response.status === ResponseStatus.Success) {
        if (response.field) {
          if (typeof response.field !== "string") {
            if (Array.isArray(response.field)) {
              const users: IUser[] = response.field.map(
                (user: IUser) =>
                  ({
                    ...user,
                    token: token,
                  } as IUser)
              );
              setUsers(users);
            } else {
              throw new Error("Invalid response field type.");
            }
          } else {
            throw new Error("Invalid response field.");
          }
        } else {
          throw new Error("Missing response field.");
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
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-10">
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          <p>{errorMessage}</p>
        </div>
      )}
      <DataTable
        columns={userColumns}
        data={users}
        filterPlaceholder={"Search by email..."}
      />
    </div>
  );
}

export default Users;
