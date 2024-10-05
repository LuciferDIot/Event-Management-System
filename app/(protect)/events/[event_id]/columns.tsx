"use client";

import { Button } from "@/components/ui/button";
import { userEventStatusStyles } from "@/data";
import { cn } from "@/lib/utils";
import { IUserEvent } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const eventUserColumns: ColumnDef<IUserEvent>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          size={"sm"}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => row.original.user.email,
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          size={"sm"}
          variant="ghost"
          className="w-full flex-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UserName
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="w-full h-full flex-center">
        {row.original.user.username}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          size={"sm"}
          variant="ghost"
          className="w-full flex-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="w-full h-full flex-center">
        {row.original.user.firstName}
      </span>
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          size={"sm"}
          variant="ghost"
          className="w-full flex-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="w-full h-full flex-center">
        {row.original.user.lastName}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          size={"sm"}
          variant="ghost"
          className="w-full flex-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status; // Assuming `status` is of type UserEventStatus
      const statusStyle = status
        ? userEventStatusStyles[status]
        : "bg-gray-100 text-gray-800";

      return (
        <div className="w-full flex-center">
          <span
            className={cn(
              `px-2 py-1 rounded-md text-xs font-medium`,
              statusStyle
            )}
          >
            {status}
          </span>
        </div>
      );
    },
  },
];
