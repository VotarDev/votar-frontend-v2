import React, { useState } from "react";
import logo from "../../public/assets/logos/logo_white-1.png";
import illustration from "../../public/assets/illustrations/illustration-4.svg";
import { useSearchParams } from "next/navigation";
import { CustomTabPanel, a11yProps } from "@/src/components/Tab";
import { Tab, Tabs, styled } from "@mui/material";

const SignupComponent = dynamic(() => import("@/src/components/Signup"), {
  ssr: false,
});
const SigninComponent = dynamic(() => import("@/src/components/Signin"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import { StyledTabProps, StyledTabsProps } from "@/utils/types";

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{
      children: <span className="MuiTabs-indicatorSpan" />,
    }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#015CE9",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#015CE9",
  },
});

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.pxToRem(18),
  marginRight: theme.spacing(4),
  paddingBottom: theme.spacing(0),
  color: "#696969",
  "&.Mui-selected": {
    color: "#015CE9",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

const Signin = () => {
  const searchParams = useSearchParams();
  const signup = searchParams.get("create-account");
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
        </div>
      </div>
      <div className="flex justify-center items-center lg:w-[60%] flex-col max-w-[1024px] mx-auto lg:my-0 my-8 lg:py-0 font-proximaNova">
        <div className="w-full">
          <div className="w-full h-full flex flex-col items-center">
            <StyledTabs
              value={tabValue}
              onChange={handleChange}
              aria-label="styled tabs example"
            >
              <StyledTab label="Log In" {...a11yProps(0)} />
              <StyledTab label="Sign Up" {...a11yProps(1)} />
            </StyledTabs>
          </div>

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
