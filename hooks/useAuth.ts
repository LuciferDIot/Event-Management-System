import { ROUTES } from "@/data";
import { useAuthStore } from "@/stores/authStore";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const useAuth = () => {
  const { setUserData, clearUserData, user, token, expiresAt, hasHydrated } =
    useAuthStore(); // Access hasHydrated
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const login = (user: IUser, token: string) => {
    const expiresAt = Date.now() + ONE_DAY_IN_MS;
    setUserData(user, token, expiresAt);
  };

  const logout = () => {
    console.log("Logging out..."); // Debugging line
    clearUserData();
    router.push(ROUTES.LOGIN);
  };

  const checkSession = () => {
    if (expiresAt && Date.now() > expiresAt) {
      logout(); // Token expired
    }
  };

  const isLoggedInFunc = () => {
    return !!token && !!user && Date.now() <= expiresAt!;
  };

  useEffect(() => {
    if (hasHydrated) {
      checkSession();
      setIsLoggedIn(isLoggedInFunc());
    }
  }, [hasHydrated, expiresAt, user, token]);

  // Ensure we only return values once hydration has completed
  return {
    login,
    logout,
    user: hasHydrated ? user : null,
    token: hasHydrated ? token : null,
    isLoggedIn: hasHydrated ? isLoggedIn : false,
    hasHydrated,
  };
};
