import { ROUTES } from "@/data";
import { useAuthStore } from "@/stores/authStore";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const useAuth = () => {
  const { setUserData, clearUserData, user, token, expiresAt } = useAuthStore();
  const router = useRouter();

  const login = (user: IUser, token: string) => {
    const expiresAt = Date.now() + ONE_DAY_IN_MS;
    setUserData(user, token, expiresAt);
  };

  const logout = () => {
    clearUserData();
    router.push(ROUTES.LOGIN);
  };

  const checkSession = () => {
    if (expiresAt && Date.now() > expiresAt) {
      logout(); // Token expired
    }
  };

  // Method to check if the user is logged in
  const isLoggedIn = () => {
    return !!token && !!user && Date.now() <= expiresAt!;
  };

  // Automatically check session when the hook is used
  useEffect(() => {
    checkSession();
  }, [expiresAt]);

  return { login, logout, user, token, isLoggedIn };
};
