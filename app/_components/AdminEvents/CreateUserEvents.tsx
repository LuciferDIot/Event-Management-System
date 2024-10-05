import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";

type Props = {
  event: IEvent;
  users: IUser[];
};

function CreateUserEvents({ event, users }: Props) {
  const { addUserEvent, deleteUserEvent, errorMessage, isMounted, eventUsers } =
    useFetchUserEvents({
      eventId: event._id,
    });

  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [addedUsers, setAddedUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  // Utility function to handle error logging
  const logError = (error: unknown, action: string) => {
    if (error instanceof Error) {
      console.error(`Error ${action} user event:`, error.message);
    } else {
      console.error(`Error ${action} user event:`, error);
    }
  };

  // Sync filtered and added users whenever eventUsers or users change
  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          !eventUsers.some((userEvent) => userEvent.user._id === user._id)
      )
    );
    setAddedUsers(eventUsers.map((userEvent) => userEvent.user));
  }, [eventUsers, users]);

  if (!isMounted) return null;

  const handleUserSelect = async (user: IUser) => {
    try {
      await addUserEvent(user._id, event._id);
      setSelectedUser(""); // Reset select input
    } catch (error) {
      logError(error, "adding");
    }
  };

  const handleRemoveUser = async (userToRemove: IUser) => {
    try {
      await deleteUserEvent(userToRemove._id, event._id);
    } catch (error) {
      logError(error, "removing");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();
    setFilteredUsers(
      users.filter((user) => user.username.toLowerCase().includes(search))
    );
  };

  return (
    <Card>
      <CardHeader>
        <DialogTitle>Allocate Users to {`'${event.title}'`}</DialogTitle>
        <CardDescription>
          Search by username and select the user to add
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search users"
          className="w-full h-10 px-3 border rounded-md focus:outline-none focus:ring-2"
          onChange={handleSearchChange}
        />

        {/* User Select Dropdown */}
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
                <SelectItem key={user._id} value={JSON.stringify(user)}>
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
              key={user._id}
              variant="outline"
              onClick={() => handleRemoveUser(user)}
              className="h-8 px-2 lg:px-3 flex items-center mr-2 mb-2"
            >
              {user.username}
              <X className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Error message */}
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </CardContent>
    </Card>
  );
}

export default CreateUserEvents;
