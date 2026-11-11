import React, { useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Plus,
  Vote,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import EmptyState from "@/src/components/shared/EmptyState";
import ElectionStatusBadge from "@/src/components/shared/ElectionStatusBadge";
import {
  formatElectionDate,
  getStatusForElection,
} from "@/utils/electionStatus";
import type { Election } from "@/utils/types";

const RECENT_LIMIT = 6;

interface RecentElectionsProps {
  elections: Election[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

// Same route the Elections page uses for an election's details.
const electionHref = (election: Election) =>
  `/elections/${election.name_of_election}/${election.election_id}`;

const RecentElections = ({
  elections,
  isLoading,
  isError,
  onRetry,
}: RecentElectionsProps) => {
  const recent = useMemo(
    () =>
      [...elections]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, RECENT_LIMIT),
    [elections],
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 px-4 pb-4 lg:px-6 lg:pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="We couldn't load your elections"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          }
        />
      );
    }

    if (recent.length === 0) {
      return (
        <EmptyState
          icon={Vote}
          title="No elections yet"
          description="Create your first election to see it here."
          action={
            <Button asChild>
              <Link href="/create-election">
                <Plus /> Create election
              </Link>
            </Button>
          }
        />
      );
    }

    return (
      <>
        {/* Phones: stacked cards */}
        <ul className="divide-y divide-border border-t border-border md:hidden">
          {recent.map((election) => {
            const status = getStatusForElection(election);
            return (
              <li key={election.election_id}>
                <Link
                  href={electionHref(election)}
                  className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">
                        {election.name_of_election}
                      </p>
                      {status && <ElectionStatusBadge status={status} />}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatElectionDate(election.start_date)} –{" "}
                      {formatElectionDate(election.end_date)}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Wider screens: table */}
        <div className="hidden border-t border-border md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="lg:pl-6">Election</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Starts</TableHead>
                <TableHead>Ends</TableHead>
                <TableHead className="lg:pr-6">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((election) => (
                <TableRow key={election.election_id}>
                  <TableCell className="max-w-[240px] lg:pl-6">
                    <p className="truncate font-medium text-foreground">
                      {election.name_of_election}
                    </p>
                    {election.type && (
                      <p className="text-xs text-muted-foreground">
                        {election.type}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <ElectionStatusBadge
                      status={getStatusForElection(election)}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatElectionDate(election.start_date)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatElectionDate(election.end_date)}
                  </TableCell>
                  <TableCell className="text-right lg:pr-6">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={electionHref(election)}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    );
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 p-4 lg:p-6">
        <div>
          <CardTitle>Recent elections</CardTitle>
          <CardDescription className="mt-1">
            Your latest elections and where each one stands.
          </CardDescription>
        </div>
        {elections.length > 0 && !isError && (
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/elections">
              View all <ArrowRight />
            </Link>
          </Button>
        )}
      </CardHeader>
      {renderBody()}
    </Card>
  );
};

export default RecentElections;
