"use client";
import { Progress } from "@/components/ui/progress";
import { ROUTES } from "@/data";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import React from "react";

const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const hasRehydrated = useAuthStore.persist.hasHydrated();

  React.useEffect(() => {
    if (hasRehydrated) {
      if (!user || !token) {
        router.push(ROUTES.LOGIN);
      } else {
        setIsLoading(false);
      }
    }
  }, [user, token, hasRehydrated, router]);

  if (isLoading) {
    return <Progress value={50} className="w-[60%] mx-auto mt-10" />;
  }

  return <>{children}</>;
};

export default WithAuth;
