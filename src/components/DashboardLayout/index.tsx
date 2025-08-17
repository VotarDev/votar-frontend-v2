// import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { getUserData } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { useDispatch } from "react-redux";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import setAuthToken from "@/utils/setAuthToken";

import { CircularProgress } from "@mui/material";
import ProtectedRoutes from "../ProtectedRoutes";
import DashboardNavbar from "../DashboardNavbar";
import Cookies from "universal-cookie";

const DashboardLayout = ({ children }: any) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [opener, setOpener] = useState(true);
  const [token, setToken] = useState<string | null>("");
  const users = useCurrentUser();
  const user = useUser();
  const dispatch = useDispatch();
  const cookies = new Cookies();

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

  useEffect(() => {
    const getUser = async () => {
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }

      try {
        const { data } = await getUserData(USER_ID);

        if (data) {
          dispatch(userData(data));
          setIsLoading(false);
          setSuccess(true);
        }
      } catch (e: any) {
        setError(e.message);
        console.log(e);
      }
    };
    getUser();
  }, [dispatch, users]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className="overflow-auto">
          <div className="flex ">
            <div className="relative lg:block hidden ">
              <SideBar opener={opener} setOpener={setOpener} />
            </div>
            <div className="flex-1 lg:flex h-screen relative max-w-full overflow-auto lg:ml-0">
              <div className="lg:block hidden">
                <Header opener={opener} />
              </div>
              <div className="lg:hidden">
                <DashboardNavbar />
              </div>

              <div className="lg:mt-20 m-0 lg:p-6 w-full overflow-auto p-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
