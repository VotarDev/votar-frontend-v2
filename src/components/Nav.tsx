import React, { useState } from "react";
import logo from "../../public/assets/logos/votar-logo.svg";
import Image from "next/image";
import Button from "./HomePage/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divide as Hamburger } from "hamburger-react";
import { BsArrowDown } from "react-icons/bs";
import { Collapse } from "react-collapse";

const Nav = () => {
  const [toggle, setToggle] = useState(false);
  const [signinDropDown, setSigninDropdown] = useState(false);

  const pathname = usePathname();

  const hamburgerHandler = () => {
    setToggle(!toggle);
  };
  const signinHandler = () => {
    setSigninDropdown(!signinDropDown);
  };

  return (
    <>
      <div className="lg:h-[116px] h-0">
        <nav className="navbar fixed top-0 left-0 right-0 max-w-[1300px] mx-auto z-[999] lg:flex justify-between items-center  mt-[21px] hidden">
          <div>
            <Link href="/">
              <Image src={logo} width={144} alt="votar logo" />
            </Link>
          </div>
          <div>
            <ul className="flex gap-[38px] text-[17px]">
              <Link href="/product">
                <li
                  className={`${
                    pathname === "/product" ? "nav-active text-[#015CE9]" : ""
                  } relative`}
                >
                  Products & Plans
                </li>
              </Link>
              <Link href="/faq">
                <li
                  className={`${
                    pathname === "/faq" ? "nav-active text-[#015CE9]" : ""
                  } relative`}
                >
                  FAQs
                </li>
              </Link>
              <Link href="/blog">
                <li
                  className={`${
                    pathname === "/blog" ? "nav-active text-[#015CE9]" : ""
                  } relative`}
                >
                  Blog
                </li>
              </Link>
              <Link href="/about">
                <li
                  className={`${
                    pathname === "/about" ? "nav-active text-[#015CE9]" : ""
                  } relative`}
                >
                  About Us
                </li>
              </Link>
            </ul>
          </div>
          <div className="flex gap-5">
            <div>
              <button className="border border-[#015CE9] w-[154px] h-[52px] rounded text-[#015CE9] sign-hover relative">
                Sign In
                <div
                  className={`opacity-0 invisible absolute transition ease-in-out delay-200 top-[43px]  px-4 py-5 rounded-lg bg-white text-[#015CE9] whitespace-nowrap mt-2 shadow-lg text-left`}
                >
                  <Link href="/signin">
                    <div className="mb-3">Sign In to Dashboard</div>
                  </Link>
                  <Link href="/vote">
                    <div>Sign In to Vote</div>
                  </Link>
                </div>
              </button>
            </div>
            <div>
              <Link href="/signin?create-account=signup">
                <Button className="bg-[#015CE9] text-white rounded-lg w-[221px] h-[52px] p-[14px] whitespace-nowrap">
                  Create a Free account
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="lg:hidden fixed top-0 right-0 w-full z-[999]">
        <div className="mobile-nav flex items-center justify-between px-5">
          <div className="flex items-center gap-1">
            <div onClick={hamburgerHandler}>
              <Hamburger size={20} />
            </div>
            <Link href="/">
              <Image src={logo} alt="logo" width={80} />
            </Link>
          </div>

          <div className="relative">
            <Button
              className="bg-[#015CE9] text-white rounded-lg p-[10px] flex items-center gap-1"
              onClick={signinHandler}
            >
              Sign In
              <span>
                <BsArrowDown className="font-bold" />
              </span>
            </Button>
            <div
              className={`${
                signinDropDown ? "opacity-1 block" : "opacity-0 hidden"
              } absolute transition ease-in-out delay-200 top-13  right-[0px] px-4 py-5 rounded-lg bg-white text-[#015CE9] whitespace-nowrap mt-2 shadow-lg`}
            >
              <Link href="/signin">
                <div className="mb-3">Sign In to Dashboard</div>
              </Link>
              <Link href="/vote">
                <div>Sign In to Vote</div>
              </Link>
            </div>
          </div>
        </div>
        <Collapse
          isOpened={toggle}
          className={`
         `}
        >
          <ul className="flex flex-col gap-4 py-5 mobile-nav w-full px-6">
            <Link href="/product">
              <li
                className={`${
                  pathname === "/product" ? "underline text-[#015CE9] " : ""
                } `}
              >
                Products & Plans
              </li>
            </Link>
            <Link href="/faq">
              <li
                className={`${
                  pathname === "/faq" ? "underline text-[#015CE9]" : ""
                } relative`}
              >
                FAQs
              </li>
            </Link>
            <Link href="/blog">
              <li
                className={`${
                  pathname === "/blog" ? "underline text-[#015CE9]" : ""
                } relative`}
              >
                Blog
              </li>
            </Link>
            <Link href="/about">
              <li
                className={`${
                  pathname === "/about" ? "underline text-[#015CE9]" : ""
                } relative`}
              >
                About Us
              </li>
            </Link>

            <div>
              <Link href="/signin?create-account=signup">
                <Button className="bg-[#015CE9] text-white rounded-lg p-[10px]">
                  Create a Free account
                </Button>
              </Link>
            </div>
          </ul>
        </Collapse>
      </div>
    </>
  );
};

export default Nav;
