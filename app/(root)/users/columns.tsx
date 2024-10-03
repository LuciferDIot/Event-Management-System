"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { IUser } from "@/types";
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "username",
    header: "UserName",
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "status",
    header: "Status",
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
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      const handleIsActive = () => {
        if (isActive) {
          row.original.isActive = false;
        } else {
          row.original.isActive = true;
        }
      };

      return (
        <Dialog>
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
                onClick={() => navigator.clipboard.writeText(task.id)}
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
