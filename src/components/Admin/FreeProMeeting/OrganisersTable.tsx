import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "universal-cookie";
import { AlertCircle, ChevronRight, Inbox, Search, SearchX } from "lucide-react";
import { getAdminVotarPage } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import EmptyState from "@/src/components/shared/EmptyState";
import Pagination from "@/src/components/shared/Pagination";
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

const PAGE_SIZE = 50; // as before

const PLAN_CONFIG = {
  "free-votar": { apiType: "free-votar", detailsPath: "/admin/free-pro-meeting/details/free-votar" },
  "votar-pro": { apiType: "votar-pro", detailsPath: "/admin/free-pro-meeting/pro/details/votar-pro" },
} as const;

/** Organisers on a plan and how many elections each has; opens their elections. */
const OrganisersTable = ({ plan }: { plan: keyof typeof PLAN_CONFIG }) => {
  const { apiType, detailsPath } = PLAN_CONFIG[plan];
  const [organisers, setOrganisers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchOrganisers = async () => {
    setIsLoading(true);
    setError(false);
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
    try {
      const { data } = await getAdminVotarPage(apiType);
      setOrganisers(
        Array.isArray(data?.data?.elections)
          ? data.data.elections
          : Array.isArray(data?.data)
            ? data.data
            : [],
      );
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisers();
  }, [apiType]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? organisers.filter((o) =>
          String(o.author_email || "").toLowerCase().includes(query),
        )
      : organisers;
  }, [organisers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const href = (email: string) => `${detailsPath}/${encodeURIComponent(email)}`;

  const renderBody = () => {
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
          title="We couldn't load organisers"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={fetchOrganisers}>
              Try again
            </Button>
          }
        />
      );
    }
    if (organisers.length === 0) {
      return <EmptyState icon={Inbox} title="No organisers on this plan yet" />;
    }
    if (filtered.length === 0) {
      return (
        <EmptyState
          icon={SearchX}
          title="No organisers match your search"
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
        <ul className="divide-y divide-border smm:hidden">
          {visible.map((row, index) => (
            <li key={row.author_email ?? index}>
              <Link
                href={href(row.author_email)}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground">
                    {row.author_email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Number(row.number_of_election || 0).toLocaleString()} election
                    {row.number_of_election === 1 ? "" : "s"}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden smm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organiser</TableHead>
                <TableHead className="text-right">Elections</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((row, index) => (
                <TableRow key={row.author_email ?? index} className="group">
                  <TableCell>
                    <Link
                      href={href(row.author_email)}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {row.author_email}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {Number(row.number_of_election || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={href(row.author_email)}
                      aria-label={`View ${row.author_email}'s elections`}
                      className="flex justify-end text-muted-foreground group-hover:text-primary"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
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
    <div>
      <div className="flex flex-col gap-3 border-b border-border p-4 smm:flex-row smm:items-center smm:justify-between">
        <div className="relative w-full smm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search organisers by email"
            aria-label="Search organisers"
            className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>
        {!isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            {filtered.length.toLocaleString()} organiser
            {filtered.length === 1 ? "" : "s"}
          </p>
        )}
      </div>
      {renderBody()}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 border-t border-border p-4 smm:flex-row smm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default OrganisersTable;
