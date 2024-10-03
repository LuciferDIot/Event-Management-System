"use client";

import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import useFetchUsers from "@/hooks/useFetchUsers";
import { removeUser, updateUser } from "@/lib/actions/user.actions";
import { handleError } from "@/lib/utils";
import { IUser, ResponseStatus } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, EyeOff, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const userColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UserName
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const isActive = row.original.isActive;
      const userId = row.original._id;
      const adminToken = row.original.token;
      const [alertOpen, setAlertOpen] = useState(false);

      const showActionToggle = (open: boolean) => {
        setAlertOpen(open);
      };

      const { fetchUsers } = useFetchUsers();

      const handleIsActive = async () => {
        if (!userId || !adminToken) return;

        const newStatus = !isActive; // Toggle the active status

        try {
          // Call the updateUser function to update the user's isActive status
          const response = await updateUser(
            userId,
            { isActive: newStatus },
            adminToken
          );
          if (response.status === ResponseStatus.Success) {
            await fetchUsers(); // Refresh the user list to reflect the change
          } else {
            console.error("Failed to update user status:", response.message);
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

      const handleDelete = async (id: string, token: string) => {
        try {
          const response = await removeUser(id, token);
          if (response.status === ResponseStatus.Success) {
            await fetchUsers();
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

      if (!userId || !adminToken) return null;

      return (
        <Dialog>
          <DeleteDialog
            isOpen={alertOpen}
            showActionToggle={showActionToggle}
            task={{
              title: "Are you sure you want to delete this user?",
              description: "This action cannot be undone.",
              onClick: () => handleDelete(userId, adminToken),
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="z-10">
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="z-10 w-[150px] bg-white p-[2%] "
            >
              <DropdownMenuLabel className=" p-[2%] text-center w-full">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isActive ? (
                <DropdownMenuItem
                  className="p-[2%] cursor-pointer flex-center rounded-md bg-white text-red-600 mt-2"
                  onClick={handleIsActive}
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="p-[2%] cursor-pointer flex-center rounded-md bg-white text-green-600  mt-2"
                  onClick={handleIsActive}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Activate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="p-[2%] cursor-pointer flex-center rounded-md bg-red-600 text-white mt-2"
                onClick={() => showActionToggle(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];
