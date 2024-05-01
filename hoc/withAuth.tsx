import { NextComponentType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUser } from "@/utils/hooks";

export default function withAuth(Component: NextComponentType) {
  return function ProtectedRoute({ ...props }) {
    const router = useRouter();
    const user = useCurrentUser();

    useEffect(() => {
      if (user == null) {
        router.push("/signin");
      }
    }, [router, user]);

    return <Component {...props} />;
  };
}
