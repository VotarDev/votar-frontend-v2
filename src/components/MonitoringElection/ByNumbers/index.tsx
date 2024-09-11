import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { StyledTabProps, StyledTabsProps } from "@/utils/types";
import TotalNumbers from "./TotalNumbers";
import IndividualNumbers from "./IndividualNumbers";
import MonitorByTotalNumbers from "./MonitorByTotalNumbers";
import MonitorByindividualNumbers from "./MonitorByIndividualNumbers";
import { useRouter } from "next/router";

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

const ByNumbers = ({
  electionId,
  activeTabs,
  setActiveTabs,
}: {
  electionId: string;
  activeTabs: string;
  setActiveTabs: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleTabChange = (tab: string) => {
    setActiveTabs(tab);
    router.push(`/monitoring-elections/${electionId}/${tab}`);
  };
  return (
    <div>
      <div>
        {/* <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <StyledTab label="Total Numbers" />
          <StyledTab label="Individual Numbers" />
        </StyledTabs> */}
        <div className="flex justify-center items-center gap-10">
          {activeTabs === "totalNumbers" && (
            <button
              className={`text-xl ${
                activeTabs === "totalNumbers" ? "text-blue-700" : ""
              }`}
              onClick={() => handleTabChange("totalNumbers")}
            >
              Total Numbers
            </button>
          )}

          {activeTabs === "individualNumbers" && (
            <>
              <button
                className="text-xl"
                onClick={() => handleTabChange("totalNumbers")}
              >
                Total Numbers
              </button>
              <button
                className="text-xl text-blue-700"
                onClick={() => handleTabChange("individualNumbers")}
              >
                Individual Numbers
              </button>
            </>
          )}
        </div>
      </div>
      <div className="pt-[52px] pb-20">
        <div className="w-full h-full flex flex-col items-center">
          {/* {value === 0 && <TotalNumbers electionId={electionId} />}
          {value === 1 && <IndividualNumbers electionId={electionId} />} */}
          <div>
            {activeTabs === "totalNumbers" && (
              <div>
                <MonitorByTotalNumbers electionId={electionId} />
              </div>
            )}
            {activeTabs === "individualNumbers" && (
              <div>
                <MonitorByindividualNumbers electionId={electionId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ByNumbers;
