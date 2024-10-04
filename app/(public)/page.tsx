"use client";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";
import AdminEvents from "../_components/AdminEvents/AdminEvents";
import FreeEvents from "../_components/FreeEvents";
import UserEvents from "../_components/UserEvents";

export default function Home() {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <FreeEvents />;
  } else if (user.role === UserRole.User) {
    return <UserEvents token={token} user={user} />;
  } else if (user.role === UserRole.Admin) {
    return <AdminEvents token={token} user={user} />;
  } else {
    return <FreeEvents />;
  }
}
