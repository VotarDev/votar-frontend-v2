import React from "react";
import ResultsPanel from "../ResultsPanel";
import MonitorTotalNumberBarChart from "./MonitorTotalNumberBarChart";
import MonitorIndividualNumberChart from "./MonitorIndividualNumberChart";

interface ByBarChartProps {
  electionId: string;
  activeTabs: string;
  setActiveTabs: React.Dispatch<React.SetStateAction<string>>;
}

/** Results as bar charts. */
const ByBarChart = ({ electionId, activeTabs }: ByBarChartProps) => (
  <ResultsPanel
    activeTabs={activeTabs}
    total={<MonitorTotalNumberBarChart electionId={electionId} />}
    individual={<MonitorIndividualNumberChart electionId={electionId} />}
  />
);

export default ByBarChart;
