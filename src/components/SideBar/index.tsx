import React, { useState } from "react";
import logo from "../../../public/assets/logos/dashboard-logo.svg";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { logout } from "@/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { BsPersonFill, BsFillBoxFill } from "react-icons/bs";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LuLineChart } from "react-icons/lu";
import { PiFiles } from "react-icons/pi";
import { useUser } from "@/utils/hooks";
import logoutIcon from "../../../public/assets/icons/log out.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { Tooltip } from "@mui/material";
import { userData } from "@/redux/features/userProfile/userProfileSlice";

const SideBar = ({ opener }: { opener?: boolean }) => {
  const { data, status } = useSession();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const imageLink: string | null | undefined = data ? data.user?.image : "";

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logout());
    dispatch(userData({}));

    if (data) {
      return await signOut();
    }
    router.push("/signin");
  };
  console.log(user);

  return (
    <div
      className={`h-screen flex flex-col  border-r border-[#8E8E8E]  p-0  overflow-y-auto sidebar-scroll duration-300 fixed bg-white top-0 left-0 z-[999] lg:relative ${
        isOpen ? "w-72" : "w-20"
      } ${opener ? "lg:w-96 lg:pl-[58px] lg:pr-5" : "lg:w-20 lg:pl-0"}`}
    >
      <div className="pl-4 pr-2">
        <div
          className={`flex flex-col ${
            opener ? "justify-start" : "items-center"
          }`}
        >
          <div className="mt-5 lg:mt-0">
            <img src={logo.src} alt="logo" className="h-20 object-contain" />
          </div>
          <div
            className="lg:hidden block my-2 pl-3 text-xl font-bold"
            onClick={() => setIsOpen(!isOpen)}
          >
            <RxHamburgerMenu />
          </div>
          <div
            className={`flex items-center gap-2 mt-5 ${
              opener ? "flex-row" : "flex-col"
            }`}
          >
            <div className="flex justify-center">
              {user.user.picture && (
                <Avatar
                  alt={user.user.username}
                  src={user.user.picture}
                  sx={{ width: 50, height: 50 }}
                />
              )}
              {user.user.data && (
                <Avatar alt={user.user.data.userName} src="" />
              )}
            </div>
            <div
              className={`font-semibold text-sm lg:text-base ${
                !isOpen && "hidden lg:block"
              } ${!opener && "lg:hidden"}`}
            >
              <div className="capitalize">
                Hey,{" "}
                <span>
                  {user.user.data && user.user.data.userName}{" "}
                  {user.user.username && <>{user.user.username}</>}
                </span>
              </div>
              <div className="sm text-[#696969]">@loremIpsum</div>
            </div>
          </div>
          <div
            className={`bg-[#015CE9] font-semibold  px-5 py-4 rounded-lg mt-4 text-white text-center relative ${
              isOpen ? "block" : "hidden lg:block"
            } ${opener ? "block" : "lg:hidden"}`}
          >
            <div className="bg-card bg-center bg-cover opacity-30 w-full h-full absolute top-0 right-0 left-0 "></div>
            <div className="flex justify-between">
              <div className="z-20">
                <div className="text-xs">VotarCredits</div>
                <div className="text-[40px]">05</div>
                <div>
                  <button className="py-1 px-2 bg-white rounded-lg text-[#015CE9] outline-none text-sm">
                    Add Credits
                  </button>
                </div>
              </div>
              <div className="z-20">
                <div className="text-xs">Add Voting Credits</div>
                <div className="text-[40px]">02</div>
                <div>
                  <button className="py-1 px-2 bg-white rounded-lg text-[#015CE9] outline-none text-sm">
                    Update
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mt-4 text-sm z-20">Referals: 02</div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1 lg:gap-3">
            <div className="lg:text-[18px] text-base p-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 ${
                  pathname === "/dashboard"
                    ? "text-[#015CE9]"
                    : "text-[#696969]"
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
                  pathname === "/elections"
                    ? "text-[#015CE9]"
                    : "text-[#696969]"
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
          </div>
        </div>
      </div>
      <div
        className={`flex items-center gap-2 my-10 lg:text-xl text-base text-[#DC362E] cursor-pointer font-semibold pl-5 pr-2 lg:p-0  lg:pl-[20px] lg:pr-5 ${
          opener ? "justify-start" : "justify-center"
        } ${isOpen ? "justify-start" : ""}`}
        onClick={handleLogout}
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
  );
};

export default SideBar;
