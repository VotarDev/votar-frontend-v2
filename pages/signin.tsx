import React, { useState, FormEvent, useEffect } from "react";
import logo from "../public/assets/logos/logo_white-1.png";
import illustration from "../public/assets/illustrations/illustration-4.svg";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/src/components/HomePage/Button";
import google from "../public/assets/logos/google.svg";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import setAuthToken from "@/utils/setAuthToken";
import { signup } from "@/utils/api";
import { CustomTabPanel, a11yProps } from "@/src/components/Tab";
import { Box, Tab, Tabs } from "@mui/material";

const SignupComponent = dynamic(() => import("@/src/components/Signup"), {
  ssr: false,
});
const SigninComponent = dynamic(() => import("@/src/components/Signin"), {
  ssr: false,
});
import dynamic from "next/dynamic";

const Signin = () => {
  const searchParams = useSearchParams();
  const signup = searchParams.get("create-account");
  console.log(signup);
  const [tabValue, setTabValue] = useState(signup ? 1 : 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="flex max-w-[2200px] mx-auto items-center px-4 lg:px-0">
      <div className="hidden bg-auth-bg w-[40%] min-h-[100vh] bg-cover bg-left-bottom bg-no-repeat bg-[#2B77ED] lg:flex  flex-col justify-center py-10">
        <div className="mt-[-6rem] ml-[-3rem]">
          <img src={logo.src} alt="logo" />
        </div>
        <div className="mt-[0rem] text-center">
          <div className="flex justify-center">
            <img src={illustration.src} alt="illustration" />
          </div>
          {/* <div className="text-white mt-10">
            Enjoy the Votar Book experience, Lets get
            <br /> you into VotarBook
          </div> */}
        </div>
      </div>
      <div className="flex justify-center items-center lg:w-[60%] flex-col max-w-[1024px] mx-auto lg:my-0 my-8 lg:py-0 font-proximaNova">
        <div className="w-full">
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: {
                backgroundColor: "#2B77ED",
              },
            }}
            centered
          >
            <Tab
              label="Log In"
              {...a11yProps(0)}
              sx={{ marginRight: "4rem" }}
            />
            <Tab label="Sign Up" {...a11yProps(1)} />
          </Tabs>

          <div className="flex justify-center">
            <CustomTabPanel value={tabValue} index={0}>
              <SigninComponent />
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
              <SignupComponent />
            </CustomTabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
