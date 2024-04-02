import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { StyledTabProps, StyledTabsProps } from "@/utils/types";
import TotalNumbers from "./TotalNumbers";
import IndividualNumbers from "./IndividualNumbers";

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
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

const ByNumbers = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div>
      <div className="flex justify-center items-center">
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <StyledTab label="Total Numbers" />
          <StyledTab label="Individual Numbers" />
        </StyledTabs>
      </div>
      <div className="pt-[52px] pb-20">
        <div className="w-full h-full flex flex-col items-center">
          {value === 0 && <TotalNumbers />}
          {value === 1 && <IndividualNumbers />}
        </div>
      </div>
    </div>
  );
};

export default ByNumbers;
