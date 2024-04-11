import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUser } from "@/utils/hooks";

function ProtectedRoutes({ children }: any) {
  // const user = useCurrentUser();
  // const router = useRouter();
  // const isAuth = user !== null;

  // useEffect(() => {
  //   if (!isAuth) {
  //     router.push("/signin");
  //   }
  // }, [router, isAuth]);

  return <>{children}</>;
}

export default ProtectedRoutes;
