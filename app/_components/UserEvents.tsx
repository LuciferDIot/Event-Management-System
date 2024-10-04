import { IUser } from "@/types";

type Props = {
  token: string;
  user: IUser;
};

function UserEvents({}: Props) {
  return <div>UserEvents</div>;
}

export default UserEvents;
