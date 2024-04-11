import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUser } from "@/utils/hooks";

function ProtectedRoutes({ children }: any) {
  const user = useCurrentUser();
  const router = useRouter();
  const isAuth = user !== null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/signin");
      }
    }
  }, [router]);

  return <>{children}</>;
}

export default ProtectedRoutes;
