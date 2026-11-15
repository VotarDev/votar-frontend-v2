// import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { useGetUserProfileQuery } from "@/redux/api/userApi";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { useDispatch } from "react-redux";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import setAuthToken from "@/utils/setAuthToken";

import { CircularProgress } from "@mui/material";
import ProtectedRoutes from "../ProtectedRoutes";
import DashboardNavbar from "../DashboardNavbar";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
import { SCROLL_CONTAINER_PROPS, scrollToTop } from "@/utils/scrollToTop";

const DashboardLayout = ({ children }: any) => {
  const [isClient, setIsClient] = useState(false);
  const [opener, setOpener] = useState(true);
  const [token, setToken] = useState<string | null>("");
  const users = useCurrentUser();
  const user = useUser();
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const router = useRouter();

  // Content scrolls inside this layout, not the window, so Next.js's own
  // scroll reset doesn't reach it: start every page at the top.
  useEffect(() => {
    router.events.on("routeChangeComplete", scrollToTop);
    return () => router.events.off("routeChangeComplete", scrollToTop);
  }, [router.events]);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  // console.log(user);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenLocal = localStorage.getItem("token");
      setToken(tokenLocal);
    }
  }, []);

  // Pages' own axios calls rely on the auth header being set here.
  useEffect(() => {
    const token = cookies.get("user-token");
    if (token) setAuthToken(token);
  }, [users]);

  // Cached: fetched once per user, not on every page change. Refreshed after
  // a profile update (see invalidateOnWrite).
  const { data: profileData } = useGetUserProfileQuery(USER_ID as string, {
    skip: !USER_ID,
  });
  useEffect(() => {
    if (profileData) dispatch(userData(profileData));
  }, [dispatch, profileData]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        // Sidebar | header + content. Only <main> scrolls, so there's one
        // scrollbar and the header stays in place.
        // No background colour here: the ballot and Votar Forms headers draw
        // the election's branding on a layer behind their parent (-z-10), and a
        // background on this container would paint over it.
        <div className="flex h-screen overflow-hidden">
          <div className="hidden lg:flex">
            <SideBar opener={opener} setOpener={setOpener} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="hidden lg:block">
              <Header opener={opener} />
            </div>
            <div className="lg:hidden">
              <DashboardNavbar />
            </div>
            <main
              className="relative flex-1 overflow-y-auto p-4 lg:p-6"
              {...SCROLL_CONTAINER_PROPS}
            >
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
