import React, { useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../../../public/assets/logos/dashboard-logo.svg";
import Link from "next/link";
import { Avatar, Tooltip } from "@mui/material";
import { LuLineChart } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { PiFiles } from "react-icons/pi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsFillBoxFill, BsPersonFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/router";
import logoutIcon from "../../../public/assets/icons/log out.svg";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { useUser } from "@/utils/hooks";

const DashboardNavbar = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useUser();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logout());
    dispatch(userData({}));

    router.push("/signin");
  };
  return (
    <>
      <div className="flex justify-between items-center p-3">
        <div>
          <img src={logo.src} alt="logo" />
        </div>
        <div>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
      </div>
      <div
        className={`fixed top-0 bottom-0 w-72 h-screen overflow-y-auto bg-white z-[999] transition-all duration-150 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 mt-5">
          <img src={logo.src} alt="logo" />
        </div>
        <div className="flex flex-col gap-5 lg:gap-3 p-4">
          <div className="flex items-center gap-2">
            <div className="flex justify-center">
              {user.user.data && (
                <Avatar
                  alt={user.user.data.userName}
                  src={user.user.data.profile_picture}
                />
              )}
            </div>
            <div className="font-semibold text-sm lg:text-base">
              <div className="capitalize">
                Hey,{" "}
                <span>
                  {user.user.data && user.user.data.userName}{" "}
                  {user.user.username && (
                    <>{user.user.username.split(" ")[0]}</>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#015CE9] font-semibold px-5 py-4 rounded-lg text-white text-center relative">
            <div className="bg-card bg-center bg-cover opacity-30 w-full h-full absolute top-0 right-0 left-0 "></div>
            <div className="flex justify-between">
              <div className="z-20">
                <div className="text-xs">VotarCredits</div>
                <div className="text-[40px]">#</div>
                <div>
                  <button className="py-1 px-2 bg-white rounded-lg text-[#015CE9] outline-none text-sm">
                    Add Credits
                  </button>
                </div>
              </div>
              <div className="z-20">
                <div className="text-xs">Add Voting Credits</div>
                <div className="text-[40px]">#</div>
                <div>
                  <button className="py-1 px-2 bg-white rounded-lg text-[#015CE9] outline-none text-sm">
                    Update
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mt-4 text-sm z-20">Referals: ##</div>
            </div>
          </div>

          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 ${
                pathname === "/dashboard" ? "text-[#015CE9]" : "text-[#696969]"
              }`}
            >
              <Tooltip title="Dashboard">
                <span className="text-2xl">
                  <BiSolidDashboard />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </div>
          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/create-election"
              className={`flex items-center gap-2 ${
                pathname?.split("/").includes("create-election")
                  ? "text-[#015CE9]"
                  : "text-[#696969]"
              }`}
            >
              <Tooltip title="Create Election">
                <span className="text-2xl">
                  <AiOutlinePlus />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Create an Election
              </span>
            </Link>
          </div>

          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/elections"
              className={`flex items-center gap-2 ${
                pathname === "/elections" ? "text-[#015CE9]" : "text-[#696969]"
              }`}
            >
              <Tooltip title="Election">
                <span className="text-2xl">
                  <BsFillBoxFill />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Elections
              </span>
            </Link>
          </div>

          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/profile"
              className={`flex items-center gap-2 ${
                pathname === "/profile" ? "text-[#015CE9]" : "text-[#696969]"
              }`}
            >
              <Tooltip title="Profile">
                <span className="text-2xl">
                  <BsPersonFill />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Profile
              </span>
            </Link>
          </div>
          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/participate"
              className={`flex items-center gap-2 ${
                pathname === "/participate"
                  ? "text-[#015CE9]"
                  : "text-[#696969]"
              }`}
            >
              <Tooltip title="Participate">
                <span className="text-2xl">
                  <HiMiniUserGroup />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Participate In an Election
              </span>
            </Link>
          </div>
          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/monitor-election"
              className={`flex items-center gap-2 ${
                pathname?.split("/").includes("monitor-election")
                  ? "text-[#015CE9]"
                  : "text-[#696969]"
              }`}
            >
              <Tooltip title="Monitor an Election">
                <span className="text-2xl">
                  <LuLineChart />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Monitor an Election
              </span>
            </Link>
          </div>
          <div className="lg:text-[18px] text-base p-2">
            <Link
              href="/votar-forms"
              className={`flex items-center gap-2 ${
                pathname?.split("/").includes("votar-forms")
                  ? "text-[#015CE9]"
                  : "text-[#696969]"
              }`}
            >
              <Tooltip title="Votar Forms">
                <span className="text-2xl">
                  <PiFiles />
                </span>
              </Tooltip>
              <span
                className={`${!isOpen && "hidden lg:block"} ${
                  !opener && "lg:hidden"
                }`}
              >
                Votar Forms
              </span>
            </Link>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 text-[#DC362E] cursor-pointer"
          >
            <Tooltip title="Logout">
              <span>
                <img src={logoutIcon.src} alt="logout" />
              </span>
            </Tooltip>
            <span
              className={`${!isOpen && "hidden lg:block"} ${
                !opener && "lg:hidden"
              }`}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;
