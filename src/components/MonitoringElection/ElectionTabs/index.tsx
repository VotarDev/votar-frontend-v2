import React, { useState } from "react";
import { BarChart3, Hash, PieChart } from "lucide-react";
import ByNumbers from "../ByNumbers";
import ByBarChart from "../ByBarChart";
import BySubGroup from "../BySubGroup";
import { cn } from "@/utils/cn";

// The line-chart view stays switched off, as before.
const TABS = [
  { id: "numbers", label: "By numbers", icon: Hash },
  { id: "bar", label: "By bar chart", icon: BarChart3 },
  { id: "subgroup", label: "By sub-group", icon: PieChart },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ElectionTabs = ({
  electionId,
  activeTabs,
  setActiveTabs,
}: {
  electionId: string;
  activeTabs: string;
  setActiveTabs: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [activeTab, setActiveTab] = useState<TabId>("numbers");
  const panelProps = { electionId, activeTabs, setActiveTabs };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
          Election results
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeTabs === "individualNumbers"
            ? "Votes for each candidate, updated as votes come in."
            : "Total votes cast, updated as votes come in."}
        </p>
      </div>

      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Result views"
          className="grid w-full max-w-lg grid-cols-3 gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-border"
        >
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors smm:text-sm",
                activeTab === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="hidden h-4 w-4 ssm:block" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "numbers" && <ByNumbers {...panelProps} />}
        {activeTab === "bar" && <ByBarChart {...panelProps} />}
        {activeTab === "subgroup" && <BySubGroup {...panelProps} />}
      </div>
    </div>
  );
};

export default ElectionTabs;
