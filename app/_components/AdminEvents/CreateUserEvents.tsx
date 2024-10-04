import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IEvent, IUser } from "@/types";

type Props = {
  event: IEvent;
  user: IUser[];
};

function CreateUserEvents({}: Props) {
  console.log("CreateUserEvents");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Users to Event</CardTitle>
        <CardDescription>
          Search by username and select the user to add
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
}

export default CreateUserEvents;
