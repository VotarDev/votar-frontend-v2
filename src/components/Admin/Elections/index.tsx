import React, { useEffect, useMemo, useState } from "react";
import Cookies from "universal-cookie";
import { AlertCircle, Inbox, Search, SearchX } from "lucide-react";
import AdminLayout from "../AdminLayout";
import SwitchButton from "../AdminProfile/SwitchButton";
import { getAdminVotarElection, getAdminVotarPage } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { parseElectionDate } from "@/utils/electionTime";
import { formatElectionDate, getStatusForElection } from "@/utils/electionStatus";
import PageHeader from "@/src/components/shared/PageHeader";
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
import { scrollToTop } from "@/utils/scrollToTop";

const PAGE_SIZE = 100; // as before

type SortKey = "date" | "name" | "time" | "payment";
const SORTS: { value: SortKey; label: string }[] = [
  { value: "date", label: "Newest start date" },
  { value: "name", label: "Election name (A–Z)" },
  { value: "time", label: "Start time (earliest)" },
  { value: "payment", label: "Payment status" },
];

const time = (value: unknown) => parseElectionDate(value)?.getTime() ?? 0;

const PaymentBadge = ({ status }: { status?: string }) => (
  <Badge variant={status === "Paid" ? "success" : "warning"}>
    {status || "Pending"}
  </Badge>
);

/** Every election on Votar, with publishing controls. */
const Elections = () => {
  const [elections, setElections] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");

  // Same requests as before: the paginated list, falling back to the old
  // un-paginated endpoint if the first one fails.
  const fetchElections = async (target = page) => {
    setIsLoading(true);
    setError(false);
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
    try {
      let response;
      try {
        response = await getAdminVotarElection("", String(target), String(PAGE_SIZE));
      } catch (paramError) {
        response = await getAdminVotarPage();
      }
      const { data } = response;
      const list = Array.isArray(data?.data?.elections)
        ? data.data.elections
        : Array.isArray(data?.data)
          ? data.data
          : [];
      const count = data?.data?.total || data?.total || list.length;
      // The fallback returns everything: page through it here.
      const pageItems = data?.data?.total
        ? list
        : list.slice((target - 1) * PAGE_SIZE, target * PAGE_SIZE);
      setElections(pageItems);
      setTotal(count);
    } catch (e) {
      console.log("Error fetching elections:", e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchElections(page);
  }, [page]);

  const rows = useMemo(() => {
    const now = Date.now();
    const query = search.trim().toLowerCase();
    return [...elections]
      .filter(
        (e) =>
          !query ||
          [e.name_of_election, e.author_email, e.election_id, e.type]
            .filter(Boolean)
            .some((v: string) => String(v).toLowerCase().includes(query)),
      )
      .sort((a, b) => {
        if (sort === "name") {
          return String(a.name_of_election || "").localeCompare(
            String(b.name_of_election || ""),
          );
        }
        if (sort === "payment") {
          return String(a.payment_status || "").localeCompare(
            String(b.payment_status || ""),
          );
        }
        if (sort === "time") return time(a.start_date) - time(b.start_date);
        return time(b.start_date) - time(a.start_date);
      })
      .map((election) => ({
        election,
        status: getStatusForElection(election, now),
      }));
  }, [elections, search, sort]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const goToPage = (next: number) => {
    setPage(next);
    scrollToTop();
  };

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
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
            <Button variant="outline" onClick={() => fetchElections(page)}>
              Try again
            </Button>
          }
        />
      );
    }
    if (elections.length === 0) {
      return <EmptyState icon={Inbox} title="No elections yet" />;
    }
    if (rows.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="No elections match your search"
          description="Try a different name, email or election ID."
          action={
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear search
            </Button>
          }
        />
      );
    }

    return (
      <>
        {/* Phones: cards */}
        <ul className="divide-y divide-border md:hidden">
          {rows.map(({ election, status }) => (
            <li key={election.election_id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium capitalize text-foreground">
                    {election.name_of_election}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {election.author_email || election.createdBy || "—"}
                  </p>
                </div>
                {election.hasOwnProperty("published") && (
                  <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
                    Published
                    <SwitchButton
                      id={election.election_id}
                      row={election}
                      userMail={election.author_email}
                      initialStatus={election.published}
                    />
                  </label>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {election.type && <Badge variant="secondary">{election.type}</Badge>}
                <PaymentBadge status={election.payment_status} />
                <ElectionStatusBadge status={status} />
              </div>
              <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {formatElectionDate(election.start_date)} –{" "}
                  {formatElectionDate(election.end_date)}
                </span>
                <span>{(election.number_of_election || 0).toLocaleString()} voters</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Larger screens: table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election</TableHead>
                <TableHead>Voting window</TableHead>
                <TableHead className="text-right">Voters</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ election, status }) => (
                <TableRow key={election.election_id}>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate font-medium capitalize text-foreground">
                      {election.name_of_election}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {election.type ? `${election.type} · ` : ""}
                      {election.author_email || election.createdBy || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatElectionDate(election.start_date)}
                    <br />
                    {formatElectionDate(election.end_date)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {election.number_of_election
                      ? Number(election.number_of_election).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <PaymentBadge status={election.payment_status} />
                  </TableCell>
                  <TableCell>
                    <ElectionStatusBadge status={status} />
                  </TableCell>
                  <TableCell>
                    {election.hasOwnProperty("published") && (
                      <SwitchButton
                        id={election.election_id}
                        row={election}
                        userMail={election.author_email}
                        initialStatus={election.published}
                      />
                    )}
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
    <AdminLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <PageHeader
          title="Elections"
          description={
            isLoading
              ? "Every election created on Votar."
              : `${total.toLocaleString()} election${total === 1 ? "" : "s"} created on Votar.`
          }
        />

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or ID"
                aria-label="Search elections on this page"
                className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 rounded-lg border border-input bg-white px-3 text-sm text-foreground outline-none focus:border-primary"
              >
                {SORTS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {search && totalPages > 1 && !isLoading && (
            <p className="border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
              Searching the {elections.length.toLocaleString()} elections on this page.
            </p>
          )}

          {renderBody()}

          {!isLoading && !error && totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 border-t border-border p-4 smm:flex-row smm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–
                {Math.min(page * PAGE_SIZE, total).toLocaleString()} of{" "}
                {total.toLocaleString()}
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Elections;
