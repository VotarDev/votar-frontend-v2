import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, Plus, Search, SearchX, Vote } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/dist/query/react/index.js";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
import {
  ELECTIONS_PAGE_SIZE,
  useGetElectionsPageQuery,
  useGetElectionsQuery,
} from "@/redux/api/electionsApi";
import Pagination from "@/src/components/shared/Pagination";
import { scrollToTop } from "@/utils/scrollToTop";
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

  const [page, setPage] = useState(1);
  const isFiltering = searchTerm.trim() !== "" || statusFilter !== "all";

  // Browsing: the server sends elections a page at a time.
  const pageQuery = useGetElectionsPageQuery(
    userId && !isFiltering ? { userId, page } : skipToken,
    { refetchOnMountOrArgChange: 60 },
  );
  // Searching or filtering needs every election, so they're loaded (once,
  // then cached) only when the user starts to search or filter.
  const allQuery = useGetElectionsQuery(
    userId && isFiltering ? userId : skipToken,
    { refetchOnMountOrArgChange: 60 },
  );
  const { isError, refetch } = isFiltering ? allQuery : pageQuery;

  // Newest first, each with its status worked out once.
  const withStatus = useMemo(() => {
    const now = Date.now();
    const source = isFiltering
      ? allQuery.data ?? []
      : pageQuery.data?.elections ?? [];
    return [...source]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((election) => ({
        election,
        status: getStatusForElection(election, now),
      }));
  }, [isFiltering, allQuery.data, pageQuery.data]);

  const matches = isFiltering
    ? withStatus.filter(
        ({ election, status }) =>
          (statusFilter === "all" || status === statusFilter) &&
          (election.name_of_election || "")
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase()),
      )
    : withStatus;

  const pageSize = pageQuery.data?.limit || ELECTIONS_PAGE_SIZE;
  // Elections the user has in total (known from either query).
  const grandTotal = allQuery.data?.length ?? pageQuery.data?.total ?? 0;
  const total = isFiltering ? matches.length : pageQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // When filtering, page through the matches here.
  const visible = isFiltering
    ? matches.slice((page - 1) * pageSize, page * pageSize)
    : matches;

  // Skeletons while loading, including when a new page is on its way.
  const isPending =
    !userId ||
    (isFiltering
      ? allQuery.isLoading
      : pageQuery.isLoading ||
        (pageQuery.isFetching && pageQuery.data?.page !== page));

  // Status counts need every election, so they appear once those are loaded.
  const counts = useMemo(() => {
    if (!allQuery.data) return null;
    const result: Record<StatusFilter, number> = {
      all: allQuery.data.length,
      active: 0,
      not_started: 0,
      ended: 0,
    };
    const now = Date.now();
    allQuery.data.forEach((election) => {
      const status = getStatusForElection(election, now);
      if (status) result[status] += 1;
    });
    return result;
  }, [allQuery.data]);

  const goToPage = (next: number) => {
    setPage(next);
    scrollToTop();
  };
  // A new search or filter starts from its first page.
  const updateSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };
  const updateFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

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

    if (!isFiltering && grandTotal === 0) {
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
                  updateSearch("");
                  updateFilter("all");
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

  const firstShown = (page - 1) * pageSize + 1;
  const lastShown = Math.min(page * pageSize, total);

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
            onChange={(e) => updateSearch(e.target.value)}
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
                onClick={() => updateFilter(filter.value)}
                className={cn(
                  "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                  selected
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {filter.label}
                {(counts || (filter.value === "all" && grandTotal > 0)) && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs",
                      selected ? "bg-secondary text-primary" : "bg-white/70",
                    )}
                  >
                    {counts ? counts[filter.value] : grandTotal}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {renderContent()}

      {!isPending && !isError && totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 border-t border-border pt-5 smm:flex-row smm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {firstShown}–{lastShown} of {total}{" "}
            {isFiltering ? "matching elections" : "elections"}
          </p>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
};

export default ElectionsComponent;
