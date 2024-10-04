import { IUser } from "@/types";
import React from "react";

type Props = {
  token: string;
  user: IUser;
};

function AdminEvents({}: Props) {
  return <div>AdminEvents</div>;
}

export default AdminEvents;
