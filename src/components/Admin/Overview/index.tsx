import React, { useEffect, useMemo, useState } from "react";
import Cookies from "universal-cookie";
import { AlertCircle, Archive, Coins, Inbox, Presentation, Vote } from "lucide-react";
import { getAllElectionsAdmin } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { getStatusForElection, formatElectionDate } from "@/utils/electionStatus";
import PageHeader from "@/src/components/shared/PageHeader";
import StatCard from "@/src/components/shared/StatCard";
import EmptyState from "@/src/components/shared/EmptyState";
import Pagination from "@/src/components/shared/Pagination";
import ElectionStatusBadge from "@/src/components/shared/ElectionStatusBadge";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { cn } from "@/utils/cn";

type TabId = "all" | "free" | "pro" | "credits" | "meetings";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All activity" },
  { id: "pro", label: "Votar Pro" },
  { id: "free", label: "Free Votar" },
  { id: "credits", label: "Votar credits" },
  { id: "meetings", label: "Votar meetings" },
];

const PAGE_SIZES = [20, 50, 100];

/** Admin dashboard: totals and the latest elections across Votar. */
const AdminOverview = () => {
  const [tab, setTab] = useState<TabId>("all");
  const [elections, setElections] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchElections = async () => {
    setIsLoading(true);
    setError(false);
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
    try {
      const { data } = await getAllElectionsAdmin(String(page), String(pageSize));
      const list = Array.isArray(data?.data?.elections)
        ? data.data.elections
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setElections(
        [...list].sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      // Same total lookup as before.
      setTotal(data?.data?.total || data?.total || list.length);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, [page, pageSize]);

  const rows = useMemo(() => {
    const now = Date.now();
    return elections.map((election) => ({
      election,
      status: getStatusForElection(election, now),
    }));
  }, [elections]);

  const proCount = elections.filter((e) => e.type === "Votar Pro").length;
  const freeCount = elections.filter((e) => e.type === "Free Votar").length;
  const visible = rows.filter(({ election }) =>
    tab === "pro"
      ? election.type === "Votar Pro"
      : tab === "free"
        ? election.type === "Free Votar"
        : true,
  );
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageHint = `In the latest ${elections.length.toLocaleString()} loaded`;

  const renderBody = () => {
    if (tab === "credits" || tab === "meetings") {
      return (
        <EmptyState
          icon={tab === "credits" ? Coins : Presentation}
          title={tab === "credits" ? "Credit activity is coming soon" : "Votar meetings are coming soon"}
          description="This view isn't connected to live data yet."
        />
      );
    }
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="We couldn't load elections"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={fetchElections}>
              Try again
            </Button>
          }
        />
      );
    }
    if (visible.length === 0) {
      return <EmptyState icon={Inbox} title="No elections here yet" />;
    }

    return (
      <>
        {/* Phones: cards */}
        <ul className="divide-y divide-border smm:hidden">
          {visible.map(({ election, status }) => (
            <li key={election._id || election.election_id} className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium capitalize text-foreground">
                    {election.name_of_election}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {election.author_email}
                  </p>
                </div>
                <ElectionStatusBadge status={status} />
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">{election.type}</Badge>
                {election.published && <Badge variant="success">Published</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatElectionDate(election.start_date)} – {formatElectionDate(election.end_date)}
              </p>
            </li>
          ))}
        </ul>

        {/* Larger screens: table */}
        <div className="hidden smm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Voting window</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map(({ election, status }) => (
                <TableRow key={election._id || election.election_id}>
                  <TableCell className="max-w-[280px]">
                    <p className="truncate font-medium capitalize text-foreground">
                      {election.name_of_election}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {election.author_email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{election.type}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatElectionDate(election.start_date)} –{" "}
                    {formatElectionDate(election.end_date)}
                  </TableCell>
                  <TableCell>
                    {election.published ? (
                      <Badge variant="success">Yes</Badge>
                    ) : (
                      <Badge variant="muted">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <ElectionStatusBadge status={status} />
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
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Dashboard"
        description="An overview of elections across Votar."
      />

      <div className="grid grid-cols-1 gap-4 ssm:grid-cols-3">
        <StatCard
          label="Total elections"
          value={total.toLocaleString()}
          icon={Archive}
          isLoading={isLoading}
        />
        <StatCard
          label="Votar Pro"
          value={proCount.toLocaleString()}
          icon={Vote}
          tone="success"
          hint={pageHint}
          isLoading={isLoading}
        />
        <StatCard
          label="Free Votar"
          value={freeCount.toLocaleString()}
          icon={Vote}
          tone="warning"
          hint={pageHint}
          isLoading={isLoading}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div
            role="tablist"
            aria-label="Activity"
            className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "h-8 shrink-0 rounded-md px-3 text-sm font-medium transition-colors",
                  tab === t.id
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tab !== "credits" && tab !== "meetings" && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Per page
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-9 rounded-md border border-input bg-white px-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        {renderBody()}

        {tab !== "credits" && tab !== "meetings" && !isLoading && !error && totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 border-t border-border p-4 smm:flex-row smm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} · {total.toLocaleString()} elections
            </p>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminOverview;
