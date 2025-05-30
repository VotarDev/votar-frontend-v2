import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/utils/hooks";
import Cookies from "universal-cookie";

function ProtectedRoutes({ children, googletoken }: any) {
  const user = useCurrentUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("user-token");

    const checkAuth = () => {
      const updatedToken = cookies.get("user-token");
      const hasValidToken = updatedToken || googletoken;

      if (!hasValidToken) {
        setRedirecting(true);
        router.push("/signin");
        return;
      }

      setLoading(false);
    };

    checkAuth();
    const timeoutId = setTimeout(checkAuth, 100);

    return () => clearTimeout(timeoutId);
  }, [router, googletoken]);

  if (loading || redirecting) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoutes;
