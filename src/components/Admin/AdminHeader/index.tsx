import React, { useEffect, useState } from "react";
import logo from "../../../../public/assets/logos/admin-logo.svg";
import { GoHome } from "react-icons/go";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
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
import { useDispatch } from "react-redux";
import { removeAdminData } from "@/redux/features/adminProfile/adminProfileSlice";
import Cookies from "universal-cookie";
import { AnimatePresence, motion } from "framer-motion";

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const isLinkActive = (link: string) => {
    // Check if the current route contains the link
    return router.pathname.includes(link);
  };

  const navItems = [
    { href: "/admin", label: "Home", icon: <GoHome />, match: () => pathname === "/admin" },
    {
      href: "/admin/profile",
      label: "Admin Profile",
      icon: <PiUser />,
      match: () => pathname === "/admin/profile",
    },
    {
      href: "/admin/free-pro-meeting/pro",
      label: "Free Pro Meeting",
      icon: <LiaCheckSquare />,
      match: () => isLinkActive("/admin/free-pro-meeting"),
    },
    {
      href: "/admin/elections",
      label: "Elections",
      icon: <PiArchiveTray />,
      match: () => pathname === "/admin/elections",
    },
    {
      href: "/admin/referals",
      label: "Referals",
      icon: <RiUserVoiceLine />,
      match: () => pathname === "/admin/referals",
    },
    {
      href: "/admin/blogs-and-faqs",
      label: "Blogs & FAQ's",
      icon: <PiNewspaper />,
      match: () => pathname === "/admin/blogs-and-faqs",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <PiUsersThree />,
      match: () => pathname === "/admin/users",
    },
    {
      href: "/admin/coupon",
      label: "Coupons",
      icon: <RiCoupon2Line />,
      match: () => pathname === "/admin/coupon",
    },
  ];

  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const logoutHandler = () => {
    // Logout
    dispatch(removeAdminData());
    const cookies = new Cookies();
    cookies.remove("admin-token", { path: "/" });
    router.push("/admin/login");
  };

  return (
    <section className="relative h-16 lg:h-28">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-[0px_4px_39px_0px_rgba(0,0,0,0.08)] z-[999] flex items-center justify-between px-4">
        <img src={logo.src} alt="" className="h-9 w-auto" />
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-2xl text-[#015CE9] p-2 -mr-2"
        >
          {isOpen ? <RxCross2 /> : <RxHamburgerMenu />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <React.Fragment>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black z-[998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
            />
            <motion.div
              className="lg:hidden fixed top-0 bottom-0 left-0 w-72 max-w-[80%] bg-white z-[999] shadow-lg flex flex-col overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-[#F5F5F5] shrink-0">
                <img src={logo.src} alt="" className="h-9 w-auto" />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeDrawer}
                  className="text-2xl text-[#015CE9] p-2 -mr-2"
                >
                  <RxCross2 />
                </button>
              </div>
              <ul className="flex flex-col gap-1 p-3 text-base font-semibold">
                {navItems.map((item) => (
                  <Link href={item.href} key={item.href}>
                    <li
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                        item.match() ? "bg-[#015CE9]/10 text-[#015CE9]" : "text-gray-700"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      {item.label}
                    </li>
                  </Link>
                ))}
              </ul>
              <div
                onClick={logoutHandler}
                className="mt-auto flex items-center gap-3 px-7 py-4 border-t border-[#F5F5F5] cursor-pointer font-semibold shrink-0"
              >
                <img src={logout.src} alt="" className="w-5 h-5" />
                Logout
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      {/* Desktop bar */}
      <div className="hidden lg:flex fixed top-0 left-0 right-0 w-full h-28 shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] bg-white z-[999] justify-between items-center px-[60px]">
        <div>
          <img src={logo.src} alt="" />
        </div>
        <div>
          <ul className="flex items-center gap-8 text-base font-semibold">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <li
                  className={`flex flex-col items-center justify-center gap-1 ${
                    item.match() ? "text-[#015CE9]" : ""
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div
          onClick={logoutHandler}
          className="cursor-pointer flex flex-col items-center justify-center gap-1 font-semibold text-base"
        >
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
