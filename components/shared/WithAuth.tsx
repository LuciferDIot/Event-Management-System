import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import React from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, token } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(true); // State to track loading

    // Check if the user is logged in
    React.useEffect(() => {
      if (!user || !token) {
        router.push("/login"); // Redirect to login if not authenticated
      } else {
        setIsLoading(false); // Stop loading when user is authenticated
      }
    }, [user, token, router]);

    // Show progress bar during loading state
    if (isLoading) {
      return <Progress value={50} className="w-[60%] mx-auto mt-10" />; // You can customize the progress value and styles
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
