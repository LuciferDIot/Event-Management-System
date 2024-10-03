"use client";
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React from "react";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, token, isLoggedIn, hasHydrated } = useAuth(); // Ensure hasHydrated is part of the return
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (hasHydrated) {
      if (!isLoggedIn && !user && !token) {
        router.push(ROUTES.LOGIN);
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoggedIn, hasHydrated, router, user, token]);

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Progress value={50} className="w-full max-w-[400px] mx-auto mt-10" />
      </div>
    );
  }

  return <>{children}</>;
};

export default WithAuth;
