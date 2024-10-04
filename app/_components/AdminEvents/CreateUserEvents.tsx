import { IEvent, IUser } from "@/types";

type Props = {
  event: IEvent;
  user: IUser[];
};

function CreateUserEvents({}: Props) {
  return <div>CreateUserEvents</div>;
}

export default CreateUserEvents;
