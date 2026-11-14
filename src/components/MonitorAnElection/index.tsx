import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Hash,
  PieChart,
  Search,
  SearchX,
  Vote,
} from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/dist/query/react/index.js";
import { useGetElectionsQuery } from "@/redux/api/electionsApi";
import { useCurrentUserId } from "@/utils/hooks";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
import ElectionCard from "@/src/components/ElectionsComponent/ElectionCard";

const FEATURES = [
  {
    icon: Hash,
    title: "By numbers",
    description: "Total and per-candidate votes",
  },
  { icon: BarChart3, title: "By bar chart", description: "Votes side by side" },
  {
    icon: PieChart,
    title: "By sub-group",
    description: "Turnout per voter group",
  },
];

// Same route as before for an election's monitoring links.
const monitorHref = (name?: string, id?: string) =>
  `/monitor-election/${name}/${id}`;

/** Pick an election to get its live monitoring links. */
const MonitorAnElection = () => {
  const userId = useCurrentUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: elections = [],
    isLoading,
    isError,
    refetch,
  } = useGetElectionsQuery(userId ?? skipToken, {
    refetchOnMountOrArgChange: 60,
  });
  const isPending = !userId || isLoading;

  const sorted = useMemo(
    () =>
      [...elections].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [elections],
  );
  const visible = sorted.filter((election) =>
    (election.name_of_election || "")
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase()),
  );

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-lg" />
          ))}
        </div>
      );
    }
    if (isError) {
      return (
        <Card>
          <EmptyState
            icon={AlertCircle}
            title="We couldn't load your elections"
            description="Check your connection and try again."
            action={
              <Button variant="outline" onClick={refetch}>
                Try again
              </Button>
            }
          />
        </Card>
      );
    }
    if (elections.length === 0) {
      return (
        <Card>
          <EmptyState
            icon={Vote}
            title="No elections yet"
            description="Create an election to monitor its results here."
            action={
              <Button asChild>
                <Link href="/create-election">Create election</Link>
              </Button>
            }
          />
        </Card>
      );
    }
    if (visible.length === 0) {
      return (
        <Card>
          <EmptyState
            icon={SearchX}
            title="No elections found"
            description="Try a different search."
            action={
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            }
          />
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((election) => (
          <ElectionCard
            key={election.election_id}
            election={election}
            actions={
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link
                  href={monitorHref(
                    election.name_of_election,
                    election.election_id,
                  )}
                >
                  <Activity /> Monitor
                </Link>
              </Button>
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-6 pt-2">
      <PageHeader
        title="Monitor an election"
        description="Follow results live and share monitoring links with observers."
      />

      <div className="grid gap-3 smm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="flex items-start gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 smm:flex-row smm:items-end smm:justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Choose an election</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Open an election to get its live results links.
          </p>
        </div>
        <div className="relative w-full smm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search elections..."
            aria-label="Search elections"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default MonitorAnElection;
