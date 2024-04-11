import { NextComponentType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/utils/hooks";

export default function withAuth(Component: NextComponentType) {
  return function ProtectedRoute({ ...props }) {
    const router = useRouter();
    const user = useCurrentUser();

    console.log(user);
    useEffect(() => {
      if (user == null) {
        // window.location.href = "/signin";
        router.push("/signin");
      }
    }, [router, user]);

    return <Component {...props} />;
  };
}
