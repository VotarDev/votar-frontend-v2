import React, { useCallback, useEffect, useState } from "react";
import Hamburger from "hamburger-react";
import logo from "../../../public/assets/logos/dashboard-logo.svg";
import Link from "next/link";
import { Avatar, CircularProgress, Tooltip } from "@mui/material";
import { LuLineChart } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { PiFiles } from "react-icons/pi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { BsFillBoxFill, BsPersonFill } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/router";
import logoutIcon from "../../../public/assets/icons/log out.svg";
import { userData } from "@/redux/features/userProfile/userProfileSlice";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { AnimatePresence } from "framer-motion";
import Modal from "../Modal";
import { getCredit, purchaseVotarCredit } from "@/utils/api";
import { toast } from "react-hot-toast";

const DashboardNavbar = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const [isCreditLoaded, setIsCreditLoaded] = useState(false);
  const [credit, setCredit] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const userProfile = useSelector((state: any) => state.userProfile);
  const [isCreditAdded, setIsCreditAdded] = useState(false);
  const [values, setValues] = useState(0);
  const users = useCurrentUser();
  const user = useUser();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch(logout());
    dispatch(userData({}));

    router.push("/signin");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues(parseInt(e.target.value));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsCreditAdded(true);

    const bodyData = {
      email: userProfile.user.data.email,
      amount: values,
    };
    try {
      const { data } = await purchaseVotarCredit(bodyData);
      if (data) {
        toast.success("Credit Added Successfully");
        fetchCredit();
        closeModal();
      }
    } catch (error: any) {
      console.log(error);
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

  const fetchCredit = useCallback(async () => {
    setIsCreditLoaded(true);
    try {
      const { data } = await getCredit(USER_ID);
      if (data) {
        setCredit(data.data.votar_credits);
        setIsCreditLoaded(false);
        console.log(data);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsCreditLoaded(false);
    }
  }, [USER_ID]);

  useEffect(() => {
    fetchCredit();
  }, [fetchCredit]);
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
                <div className="text-[40px]">
                  {isCreditLoaded ? (
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

          <div className="lg:text-[18px] text-base">
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
          <div className="lg:text-[18px] text-base ">
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

          <div className="lg:text-[18px] text-base">
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

          <div className="lg:text-[18px] text-base">
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
          <div className="lg:text-[18px] text-base">
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
          <div className="lg:text-[18px] text-base">
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
          <div className="lg:text-[18px] text-base">
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
            className="flex items-center gap-2 text-[#DC362E] cursor-pointer"
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
    </>
  );
};

export default DashboardNavbar;
