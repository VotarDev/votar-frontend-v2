import withAuth from "@/hoc/withAuth";
import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import Header from "../Header";
import { getUserData } from "@/utils/api";
import { useCurrentUser } from "@/utils/hooks";
import { useDispatch } from "react-redux";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const DashboardLayout = ({ children }: any) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [opener, setOpener] = useState(true);
  const user = useCurrentUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      try {
        const userId = user.user._id ? user.user._id : user.user.id;
        const { data } = await getUserData(userId);
        if (data) {
          dispatch(userData(data));
          setIsLoading(false);
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

export default withAuth(DashboardLayout);
