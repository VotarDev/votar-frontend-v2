import React from "react";
import ResultsPanel from "../ResultsPanel";
import MonitorByTotalNumbers from "./MonitorByTotalNumbers";
import MonitorByindividualNumbers from "./MonitorByIndividualNumbers";

interface ByNumbersProps {
  electionId: string;
  activeTabs: string;
  setActiveTabs: React.Dispatch<React.SetStateAction<string>>;
}

/** Results as vote counts. */
const ByNumbers = ({ electionId, activeTabs }: ByNumbersProps) => (
  <ResultsPanel
    activeTabs={activeTabs}
    total={<MonitorByTotalNumbers electionId={electionId} />}
    individual={<MonitorByindividualNumbers electionId={electionId} />}
  />
);

export default ByNumbers;
