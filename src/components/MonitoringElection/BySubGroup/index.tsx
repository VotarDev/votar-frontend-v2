import React from "react";
import ResultsPanel from "../ResultsPanel";
import MonitorSubGroupTotalNumbers from "./MonitorSubGroupTotalNumbers";
import MonitorSubGroupIndividualNumbers from "./MonitorSubGroupIndividualNumbers";

interface BySubGroupProps {
  electionId: string;
  activeTabs: string;
  setActiveTabs: React.Dispatch<React.SetStateAction<string>>;
}

/** Results broken down by voter sub-group. */
const BySubGroup = ({ electionId, activeTabs }: BySubGroupProps) => (
  <ResultsPanel
    activeTabs={activeTabs}
    total={<MonitorSubGroupTotalNumbers electionId={electionId} />}
    individual={<MonitorSubGroupIndividualNumbers electionId={electionId} />}
  />
);

export default BySubGroup;
