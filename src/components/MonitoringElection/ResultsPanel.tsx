import React, { useState } from "react";
import { cn } from "@/utils/cn";

type Mode = "total" | "individual";

interface ResultsPanelProps {
  /** "totalNumbers" or "individualNumbers", from the monitoring link. */
  activeTabs: string;
  total: React.ReactNode;
  individual: React.ReactNode;
}

/**
 * Total vs individual results. A total-numbers link only ever shows totals;
 * an individual-numbers link can switch, starting on individual (as before).
 */
const ResultsPanel = ({ activeTabs, total, individual }: ResultsPanelProps) => {
  const canSwitch = activeTabs === "individualNumbers";
  const [mode, setMode] = useState<Mode>("individual");
  const showing: Mode = canSwitch ? mode : "total";

  return (
    <div className="w-full space-y-6">
      {canSwitch && (
        <div className="flex justify-center">
          <div
            role="tablist"
            aria-label="Result type"
            className="inline-flex rounded-lg bg-muted p-1"
          >
            {(
              [
                ["total", "Total numbers"],
                ["individual", "Individual numbers"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "h-9 rounded-md px-4 text-sm font-medium transition-colors",
                  mode === value
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
      {showing === "total" ? total : individual}
    </div>
  );
};

export default ResultsPanel;
