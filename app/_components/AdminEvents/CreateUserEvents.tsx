"use client";

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
import { IEvent, IUser } from "@/types";
import { useState } from "react";

type Props = {
  event: IEvent;
  users: IUser[];
};

function CreateUserEvents({ event, users }: Props) {
  const [filteredUsers, setFilteredUsers] = useState(users);

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
        <Select>
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
      </CardContent>
    </Card>
  );
}

export default CreateUserEvents;
