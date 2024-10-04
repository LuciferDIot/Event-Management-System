"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchUserEvents from "@/hooks/useFetchUserEvents";
import { IEvent, IUser } from "@/types";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  event: IEvent;
  users: IUser[];
};

function CreateUserEvents({ event, users }: Props) {
  const {
    addUserEvent,
    deleteUserEvent,
    errorMessage,
    fetchUserEvents,
    isMounted,
    userEvents,
  } = useFetchUserEvents();

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [addedUsers, setAddedUsers] = useState<IUser[]>(
    userEvents.map((userEvent) => userEvent.user)
  );
  const [selectedUser, setSelectedUser] = useState<string>("");

  if (!isMounted) {
    toast.error("User events not loaded");
    return null;
  }

  const handleUserSelect = async (user: IUser) => {
    try {
      // Add the user event through the hook
      await addUserEvent(user.id, event.id);
      setAddedUsers((prev) => [...prev, user]);
      setSelectedUser(""); // Reset the select input
      setFilteredUsers(users); // Reset the filtered users
    } catch (error) {
      console.error("Error adding user event:", error);
    }
  };

  const handleRemoveUser = async (userToRemove: IUser) => {
    try {
      // Remove the user event through the hook
      await deleteUserEvent(userToRemove.id, event.id);
      setAddedUsers((prev) =>
        prev.filter((user) => user.id !== userToRemove.id)
      );
    } catch (error) {
      console.error("Error removing user event:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocate Users to {`'${event.title}'`}</CardTitle>
        <CardDescription>
          Search by username and select the user to add
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Search users"
          className="w-full h-10 px-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onChange={(e) => {
            const search = e.target.value.toLowerCase();
            setFilteredUsers(
              users.filter((user) =>
                user.username.toLowerCase().includes(search)
              )
            );
          }}
        />
        <Select
          onValueChange={(value) => {
            const user = JSON.parse(value) as IUser;
            handleUserSelect(user);
          }}
          value={selectedUser}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Users</SelectLabel>
              {filteredUsers.map((user) => (
                <SelectItem key={user.id} value={JSON.stringify(user)}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Display added users */}
        <div className="mt-4 flex flex-wrap">
          {addedUsers.map((user) => (
            <Button
              key={user.id}
              variant="outline"
              onClick={() => handleRemoveUser(user)}
              className="h-8 px-2 lg:px-3 flex items-center mr-2 mb-2"
            >
              {user.username}
              <X className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Error handling */}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </CardContent>
    </Card>
  );
}

export default CreateUserEvents;
