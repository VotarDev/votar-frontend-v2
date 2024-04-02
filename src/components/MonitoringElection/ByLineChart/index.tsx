import React, { useState } from "react";
import LineChart from "./LineChart";
import { styled } from "@mui/material/styles";
import { generateTimeLabels } from "@/utils/util";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { StyledTabProps, StyledTabsProps } from "@/utils/types";
import IndividualNumbersChart from "./IndividualNumbers";

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

const ByLineChart = () => {
  const [voteData, setVoteData] = useState([
    { x: "2022-10-03T08", y: 0 },
    { x: "2022-10-03T0815", y: 50 },
    { x: "2022-10-03T1114", y: 150 },
    { x: "2022-10-03T1630", y: 400 },
  ]);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [voteGraph, setVoteGraph] = useState({
    labels: voteData.map((x) => x.x),
    datasets: [
      {
        label: "No of Votes",
        data: voteData.map((v, i, a) => {
          let totalVotes = v.y;
          for (let c = 0; c < a.length; c++) {
            const vote = a[c];
            if (c < i) totalVotes += vote.y;
          }
          return totalVotes;
        }),
        borderColor: "#015CE9",
        tension: 0.1,
      },
    ],
  });

  return (
    <div>
      <div className="flex justify-center items-center mb-[52px]">
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="styled tabs example"
        >
          <StyledTab label="Total Numbers" />
          <StyledTab label="Individual Numbers" />
        </StyledTabs>
      </div>
      <div className="w-full h-full flex flex-col items-center">
        {value === 0 && <LineChart chartData={voteGraph} />}
        {value === 1 && <IndividualNumbersChart />}
      </div>
    </div>
  );
};

export default ByLineChart;
