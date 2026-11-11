import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useCurrentUserId } from "@/utils/hooks";
import DashboardLayout from "@/src/components/DashboardLayout";
import DashboardOverview from "@/src/components/Dashboard";
import Chat from "@/src/components/Chat";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import setAuthToken from "@/utils/setAuthToken";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { googleAuth } from "@/redux/features/auth/authSlice";
import Cookies from "universal-cookie";

const Dashboard = ({ token, userInfo }: { token?: string; userInfo: any }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const USER_ID = useCurrentUserId();

  useEffect(() => {
    const cookies = new Cookies();

    if (router.query.token && typeof router.query.token === "string") {
      cookies.set("user-token", router.query.token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      const cleanQuery = { ...router.query };
      delete cleanQuery.token;

      router.replace(
        {
          pathname: router.pathname,
          query: cleanQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router]);

  useEffect(() => {
    const authToken = userInfo.token || token;

    if (authToken) {
      setAuthToken(authToken);

      const cookies = new Cookies();
      const existingToken = cookies.get("user-token");

      if (!existingToken) {
        cookies.set("user-token", authToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
    }

    if (userInfo.user) {
      try {
        const parsedUser = JSON.parse(userInfo.user);
        dispatch(userData(parsedUser));
        dispatch(googleAuth(parsedUser));
        localStorage.setItem("user", JSON.stringify(parsedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [dispatch, userInfo, token]);

  return (
    <ProtectedRoutes googletoken={token}>
      <DashboardLayout>
        <DashboardOverview userId={USER_ID} />
        <Chat />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { req, query } = context;
  const cookies = new Cookies(req.headers.cookie);
  let token = cookies.get("user-token") || query.token;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      token: token.toString(),
      userInfo: query,
    },
  };
};

export default Dashboard;
