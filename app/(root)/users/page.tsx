"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { getAllUsers } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { IUser, ResponseStatus } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userColumns } from "./columns";

function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { token } = useAuth();

  const fetchUsers = async () => {
    if (!token) {
      toast.error("Token is undefined.");
      return;
    }
    try {
      const response = await getAllUsers(1, 10, token);

      if (response.status === ResponseStatus.Success) {
        if (response.field) {
          if (typeof response.field !== "string") {
            if (Array.isArray(response.field)) {
              setUsers(response.field);
            } else {
              throw new Error("Invalid response field type.");
            }
          } else {
            throw new Error("Token is undefined.");
          }
        } else {
          throw new Error("Token is undefined.");
        }
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      const errorRecreate = handleError(error);
      console.error(error);
      if (errorRecreate.message) {
        toast.error(errorRecreate.message);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={userColumns} data={users} />
    </div>
  );
}

export default Users;
