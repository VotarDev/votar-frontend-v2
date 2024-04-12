// import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { getUserData } from "@/utils/api";
import { useCurrentUser } from "@/utils/hooks";
import { useDispatch } from "react-redux";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import setAuthToken from "@/utils/setAuthToken";

import { CircularProgress } from "@mui/material";
import ProtectedRoutes from "../ProtectedRoutes";

const DashboardLayout = ({ children }: any) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [opener, setOpener] = useState(true);
  const user = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      if (user) setAuthToken(user.data.data.cookie);
      setIsLoading(true);
      setSuccess(false);
      try {
        const userId = user.data.data._id ? user.data.data._id : user.data.data;
        const { data } = await getUserData(userId);
        console.log(data);
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
  }, [dispatch, user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center m-20">
  //       <CircularProgress size={30} style={{ color: "#015CE9" }} />
  //     </div>
  //   );

  return (
    <>
      {isClient && (
        <div className="overflow-auto">
          <div className="flex">
            <div className="relative">
              <SideBar opener={opener} />
              <div
                className="absolute bg-blue-700  top-14 -right-5 w-10 h-10 lg:flex items-center justify-center text-zinc-100 shadow rounded-full hidden z-[999] cursor-pointer"
                onClick={() => setOpener(!opener)}
              >
                <span>{opener ? <BsArrowLeft /> : <BsArrowRight />}</span>
              </div>
            </div>
            <div className="flex-1 md:flex h-screen relative max-w-full overflow-auto ml-20 lg:ml-0">
              <Header />
              <div className="mt-20 lg:p-6 w-full overflow-auto p-3">
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
