import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useRef,
  use,
} from "react";
import logo from "../../../public/assets/logos/dashboard-logo.svg";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { logout } from "@/redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { BiSolidDashboard } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import {
  BsPersonFill,
  BsFillBoxFill,
  BsArrowLeft,
  BsArrowRight,
} from "react-icons/bs";
import { HiMiniUserGroup } from "react-icons/hi2";
import { LuLineChart } from "react-icons/lu";
import { PiFiles } from "react-icons/pi";
import { useCurrentUser, useUser } from "@/utils/hooks";
import logoutIcon from "../../../public/assets/icons/log out.svg";
import { RxHamburgerMenu } from "react-icons/rx";
import { CircularProgress, Tooltip } from "@mui/material";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import Cookies from "universal-cookie";
import { createCredit, getCredit, purchaseVotarCredit } from "@/utils/api";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";

import { toast } from "react-hot-toast";
import setAuthToken from "@/utils/setAuthToken";
import { AppDispatch } from "@/redux/store";
import {
  setCredit,
  setCreditLoaded,
} from "@/redux/features/creditSlice/creditSlice";

const SideBar = ({
  opener,
  setOpener,
}: {
  opener?: boolean;
  setOpener: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data, status } = useSession();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const users = useCurrentUser();
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCreditAdded, setIsCreditAdded] = useState(false);
  const [isCreditLoaded, setIsCreditLoaded] = useState(false);
  const [values, setValues] = useState(0);
  const [credits, setCredits] = useState(0);
  const cookies = new Cookies();
  const userProfile = useSelector((state: any) => state.userProfile);
  const { credit, isLoaded } = useSelector((state: any) => state.credit);

  const hasInitiallyFetched = useRef(false);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    return () => {};
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("user");

    cookies.remove("user-token", { path: "/" });
    dispatch(logout());
    dispatch(userData({}));

    if (data) {
      return await signOut();
    }
    router.push("/signin");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(parseInt(e.target.value));
  };

  const fetchCredit = async (
    userId?: string,
    showSpinner: boolean = true
  ): Promise<void> => {
    const currentUserId = userId || USER_ID;
    if (!currentUserId) return;

    if (showSpinner) {
      dispatch(setCreditLoaded(false));
    }

    try {
      const { data } = await getCredit(currentUserId);
      if (data) {
        dispatch(setCredit(data.data.votar_credits));
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      if (showSpinner) {
        dispatch(setCreditLoaded(true));
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsCreditAdded(true);

    const token = cookies.get("user-token");
    const bodyData = {
      email: userProfile.user.data.email,
      amount: values,
    };

    try {
      if (token) {
        setAuthToken(token);
      }
      const { data } = await purchaseVotarCredit(bodyData);
      if (data) {
        toast.success("Credit Added Successfully");

        await fetchCredit();
        closeModal();
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      toast.error(message);
    } finally {
      setIsCreditAdded(false);
    }
  };
  useEffect(() => {
    if (USER_ID && !isLoaded) {
      fetchCredit(USER_ID, true);
    }
  }, [USER_ID]);

  useEffect(() => {
    if (USER_ID && isLoaded) {
      const interval = setInterval(() => {
        fetchCredit(USER_ID, false);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [USER_ID, isLoaded]);

  const refreshCredits = () => {
    if (USER_ID) {
      fetchCredit(USER_ID, false);
    }
  };

  useEffect(() => {
    if (!hasInitiallyFetched.current) {
      hasInitiallyFetched.current = true;
      refreshCredits();
    }
  }, [USER_ID]);

  return (
    <div
      className={`h-screen flex flex-col  border-r border-[#8E8E8E] overflow-y-auto sidebar-scroll duration-300 fixed bg-white top-0 left-0 z-10 lg:relative ${
        isOpen ? "w-72" : "w-20"
      } ${
        opener ? "lg:w-[330px] lg:pl-[28px] lg:pr-5" : "lg:w-[100px] lg:pl-0"
      }`}
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
            className={`absolute top-14 right-0 z-20 cursor-pointer 
            w-7 h-12 
            bg-gradient-to-r from-blue-600 to-blue-700 
            hover:from-blue-700 hover:to-blue-800
            rounded-l-lg shadow-lg
            text-white
            flex items-center justify-center
            transition-all duration-300 ease-in-out
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  ${isOpen ? "translate-x-0" : "translate-x-1"}`}
            onClick={() => setOpener(!opener)}
          >
            <span>{opener ? <BsArrowLeft /> : <BsArrowRight />}</span>
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
              {user.user.data && (
                <Avatar
                  alt={user.user.data.userName}
                  src={user.user.data.profile_picture}
                />
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
                  {user.user.username && (
                    <>{user.user.username.split(" ")[0]}</>
                  )}
                </span>
              </div>
              <div className="sm text-[#696969]"></div>
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
                <div className="text-[40px]">
                  {!isLoaded ? (
                    <CircularProgress size={20} style={{ color: "#ffffff" }} />
                  ) : (
                    <>{credit}</>
                  )}
                </div>
                <div>
                  <button
                    className="py-1 px-2 bg-white rounded-lg text-[#015CE9] outline-none text-sm"
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    Add Credits
                  </button>
                </div>
              </div>
              <div className="z-20">
                <div className="text-xs">Add Voting Credits</div>
                <div className="text-[40px]">0</div>
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
                  pathname?.split("/").includes("elections")
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

      <div className="!z-[999999]">
        <AnimatePresence mode="wait">
          {showModal && (
            <Modal key="modal" handleClose={closeModal}>
              <div className="bg-white rounded-lg pt-[24px] pb-[83px] px-10 text-left ">
                <div className="w-full mx-auto min-h-[20vh] flex items-center justify-center">
                  <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="addCredit">Add Credit</label>
                      <input
                        type="text"
                        id="addCredit"
                        name="addCredit"
                        className="border border-zinc-600 w-full rounded h-12 outline-none p-4"
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mt-5">
                      <button
                        className="w-full h-12 outline-none flex items-center gap-2 justify-center bg-blue-700 text-white rounded"
                        disabled={isCreditAdded}
                      >
                        {isCreditAdded && (
                          <CircularProgress
                            size={20}
                            style={{ color: "#ffffff" }}
                          />
                        )}
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SideBar;
