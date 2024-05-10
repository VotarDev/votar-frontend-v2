import React, { useState } from "react";
import logo from "../../../../public/assets/logos/admin-logo.svg";
import { GoHome } from "react-icons/go";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { usePathname } from "next/navigation";
import {
  PiUser,
  PiArchiveTray,
  PiNewspaper,
  PiUsersThree,
} from "react-icons/pi";
import { RiCoupon2Line } from "react-icons/ri";
import { LiaCheckSquare } from "react-icons/lia";
import { RiUserVoiceLine } from "react-icons/ri";
import logout from "../../../../public/assets/icons/logout-black.svg";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isLinkActive = (link: string) => {
    // Check if the current route contains the link
    return router.pathname.includes(link);
  };
  return (
    <section className="relative overflow-auto lg:h-28 h-auto">
      <div
        className={`fixed lg:w-full lg:left-0 lg:right-0 shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] bg-white z-[999] flex lg:justify-between justify-normal gap-2 lg:gap-0 lg:flex-row flex-col items-center lg:px-[60px] lg:h-28 h-full duration-150 sidebar-scroll ${
          isOpen ? "w-40" : "w-14"
        } top-0 bottom-0`}
      >
        <div
          className="absolute top-14 -right-5 w-10 h-10 flex items-center justify-center bg-white shadow rounded-full lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{isOpen ? <BsArrowLeft /> : <BsArrowRight />}</span>
        </div>
        <div>
          <img
            src={logo.src}
            alt=""
            className="w-20 h-20 lg:w-auto lg:h-auto"
          />
        </div>
        <div>
          <ul className="flex items-center lg:gap-8 gap-5 lg:text-base text-sm font-semibold lg:flex-row flex-col">
            <Link href="/admin">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <GoHome />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>Home</span>
              </li>
            </Link>
            <Link href="/admin/profile">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin/profile" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <PiUser />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>
                  Admin Profile
                </span>
              </li>
            </Link>
            <Link href="/admin/free-pro-meeting">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  isLinkActive("/admin/free-pro-meeting")
                    ? "text-[#015CE9]"
                    : ""
                }`}
              >
                <span className="text-2xl">
                  <LiaCheckSquare />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>
                  Free Pro Meeting
                </span>
              </li>
            </Link>
            <Link href="/admin/elections">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin/elections" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <PiArchiveTray />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>
                  {" "}
                  Elections
                </span>
              </li>
            </Link>
            <Link href="/admin/referals">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin/referals" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <RiUserVoiceLine />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>
                  Referals
                </span>
              </li>
            </Link>
            <Link href="/admin/blogs-and-faqs">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin/blogs-and-faqs" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <PiNewspaper />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>
                  Blogs & FAQ&apos;s
                </span>
              </li>
            </Link>
            <Link href="/admin/users">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin/users" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <PiUsersThree />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>Users</span>
              </li>
            </Link>
            <Link href="/admin/coupon">
              <li
                className={`flex flex-col items-center justify-center gap-1 ${
                  pathname === "/admin/coupon" ? "text-[#015CE9]" : ""
                }`}
              >
                <span className="text-2xl">
                  <RiCoupon2Line />
                </span>
                <span className={`${!isOpen && "hidden lg:block"}`}>
                  Coupons
                </span>
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 font-semibold lg:text-base text-sm lg:mt-0 mt-5">
          <span>
            <img src={logout.src} alt="logout" />
          </span>
          Logout
        </div>
      </div>
    </section>
  );
};

export default AdminHeader;
