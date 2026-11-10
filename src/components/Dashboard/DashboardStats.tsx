import React, { useMemo } from "react";
import { CalendarClock, CheckCircle2, Radio, Vote } from "lucide-react";
import StatCard from "@/src/components/shared/StatCard";
import { getStatusForElection } from "@/utils/electionStatus";
import type { Election } from "@/utils/types";

interface DashboardStatsProps {
  elections: Election[];
  isLoading: boolean;
}

/** Counts derived from the user's elections; no figures beyond what the API returns. */
const DashboardStats = ({ elections, isLoading }: DashboardStatsProps) => {
  const counts = useMemo(() => {
    const now = Date.now();
    const result = { active: 0, not_started: 0, ended: 0 };
    elections.forEach((election) => {
      const status = getStatusForElection(election, now);
      if (status) result[status] += 1;
    });
    return result;
  }, [elections]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:grid-cols-4">
      <StatCard
        label="Elections created"
        value={elections.length}
        icon={Vote}
        isLoading={isLoading}
      />
      <StatCard
        label="Live now"
        value={counts.active}
        icon={Radio}
        tone="success"
        isLoading={isLoading}
      />
      <StatCard
        label="Upcoming"
        value={counts.not_started}
        icon={CalendarClock}
        tone="warning"
        isLoading={isLoading}
      />
      <StatCard
        label="Ended"
        value={counts.ended}
        icon={CheckCircle2}
        tone="muted"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardStats;
