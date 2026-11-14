import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Plus, Search, SearchX, Vote } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/dist/query/react/index.js";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
import { useGetElectionsQuery } from "@/redux/api/electionsApi";
import { useCurrentUserId } from "@/utils/hooks";
import { getStatusForElection } from "@/utils/electionStatus";
import type { ElectionStatus } from "@/utils/electionTime";
import { cn } from "@/utils/cn";
import ElectionCard from "./ElectionCard";

type StatusFilter = "all" | ElectionStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Live" },
  { value: "not_started", label: "Upcoming" },
  { value: "ended", label: "Ended" },
];

const ElectionsComponent = () => {
  const userId = useCurrentUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const {
    data: elections = [],
    isLoading,
    isError,
    refetch,
  } = useGetElectionsQuery(userId ?? skipToken, {
    refetchOnMountOrArgChange: 60,
  });
  const isPending = !userId || isLoading;

  // Newest first, each with its status worked out once.
  const withStatus = useMemo(() => {
    const now = Date.now();
    return [...elections]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((election) => ({
        election,
        status: getStatusForElection(election, now),
      }));
  }, [elections]);

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = {
      all: withStatus.length,
      active: 0,
      not_started: 0,
      ended: 0,
    };
    withStatus.forEach(({ status }) => {
      if (status) result[status] += 1;
    });
    return result;
  }, [withStatus]);

  const visible = withStatus.filter(
    ({ election, status }) =>
      (statusFilter === "all" || status === statusFilter) &&
      (election.name_of_election || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()),
  );

  const renderContent = () => {
    if (isPending) {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-lg" />
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
            description="Get started by creating your first election."
            action={
              <Button asChild>
                <Link href="/create-election">
                  <Plus /> Create election
                </Link>
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
            description="Try a different search or filter."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map(({ election }) => (
          <ElectionCard
            key={election.election_id}
            election={election}
            userId={userId}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-6 pt-2">
      <PageHeader
        title="Elections"
        description="Manage and monitor the elections you've created."
        actions={
          <Button asChild>
            <Link href="/create-election">
              <Plus /> Create election
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
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
        <div
          role="tablist"
          aria-label="Filter by status"
          className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
        >
          {FILTERS.map((filter) => {
            const selected = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                  selected
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {filter.label}
                {!isPending && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs",
                      selected ? "bg-secondary text-primary" : "bg-white/70",
                    )}
                  >
                    {counts[filter.value]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default ElectionsComponent;
