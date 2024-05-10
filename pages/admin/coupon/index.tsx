import CouponSection from "@/src/components/Admin/CouponSection";
import React, { useState } from "react";
import { CustomTabPanel, a11yProps } from "@/src/components/Tab";
import { Tab, Tabs, styled } from "@mui/material";
import { StyledTabProps, StyledTabsProps } from "@/utils/types";
import AdminLayout from "@/src/components/Admin/AdminLayout";

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
  fontSize: theme.typography.pxToRem(20),
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

const Coupon = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <AdminLayout>
      <div className="flex justify-center items-center my-[40px] ">
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <StyledTab label="Coupon" />
          <StyledTab label="Account" />
        </StyledTabs>
      </div>
      <div className="flex flex-col items-center w-full max-w-[1300px] mx-auto">
        {value === 0 && <CouponSection />}
        {value === 1 && "Account"}
      </div>
    </AdminLayout>
  );
};

export default Coupon;
