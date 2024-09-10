import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/utils/hooks";
import Cookies from "universal-cookie";

function ProtectedRoutes({ children, googletoken }: any) {
  const user = useCurrentUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true); // State to manage loading while checking authentication

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("user-token");

    if (!token || !user) {
      router.push("/signin"); // Redirect to sign-in if no token or user state is null
    } else {
      setLoading(false); // Set loading to false only if authenticated
    }
  }, [user, router]); // Add `user` and `router` to the dependency array

  // Render a loading spinner or nothing while checking authentication
  if (loading) {
    return <div>Loading...</div>; // Replace with your loading component if available
  }

  return <>{children}</>; // Render protected content if authenticated
}

export default ProtectedRoutes;
