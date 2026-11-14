import React, { useState, useEffect, useMemo } from "react";
import Cookies from "universal-cookie";
import { AlertCircle, Inbox, Search, SearchX } from "lucide-react";
import AdminLayout from "../AdminLayout";
import { adminGetAllUsers } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
import Pagination from "@/src/components/shared/Pagination";
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
import { scrollToTop } from "@/utils/scrollToTop";

interface MergedUser {
  name: string;
  email: string;
  isCreator: boolean;
  isVoter: boolean;
}

type Filter = "all" | "creators" | "voters";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "creators", label: "Election creators" },
  { id: "voters", label: "Voters" },
];

const PAGE_SIZE = 30; // as before

const initials = (name: string, email: string) =>
  (name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/** Everyone on Votar: election creators and voters. */
const UserSection = () => {
  const [users, setUsers] = useState<MergedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Server-side search, half a second after typing stops.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(false);
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
    try {
      // Same request as before (creators and voters together), plus search.
      const { data } = await adminGetAllUsers(
        "",
        String(page),
        String(PAGE_SIZE),
        debouncedSearch || undefined,
      );
      const creators: any[] = data?.data?.electionCreators || [];
      const voters: any[] = data?.data?.voters || [];

      // Someone who creates elections and also votes appears once, as both.
      const byEmail = new Map<string, MergedUser>();
      creators.forEach((c) =>
        byEmail.set(c.email, {
          name: c.userName || "",
          email: c.email,
          isCreator: true,
          isVoter: false,
        }),
      );
      voters.forEach((v) => {
        const existing = byEmail.get(v.email);
        if (existing) existing.isVoter = true;
        else
          byEmail.set(v.email, {
            name: v.name || "",
            email: v.email,
            isCreator: false,
            isVoter: true,
          });
      });
      setUsers(Array.from(byEmail.values()));
      setTotal(data?.data?.pagination?.total || 0);
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const counts = useMemo(
    () => ({
      all: users.length,
      creators: users.filter((u) => u.isCreator).length,
      voters: users.filter((u) => u.isVoter).length,
    }),
    [users],
  );
  const visible = users.filter((u) =>
    filter === "creators" ? u.isCreator : filter === "voters" ? u.isVoter : true,
  );
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const goToPage = (next: number) => {
    setPage(next);
    scrollToTop();
  };

  const RoleBadges = ({ user }: { user: MergedUser }) => (
    <div className="flex flex-wrap gap-1.5">
      {user.isCreator && <Badge variant="secondary">Election creator</Badge>}
      {user.isVoter && <Badge variant="muted">Voter</Badge>}
    </div>
  );

  const Avatar = ({ user }: { user: MergedUser }) => (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
      {initials(user.name, user.email)}
    </span>
  );

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="We couldn't load users"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={fetchUsers}>
              Try again
            </Button>
          }
        />
      );
    }
    if (users.length === 0) {
      return debouncedSearch ? (
        <EmptyState
          icon={SearchX}
          title="No users match your search"
          action={
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <EmptyState icon={Inbox} title="No users yet" />
      );
    }
    if (visible.length === 0) {
      return (
        <EmptyState
          icon={Inbox}
          title={`No ${filter === "creators" ? "election creators" : "voters"} on this page`}
          description="Try the next page, or switch back to All."
        />
      );
    }
    return (
      <>
        <ul className="divide-y divide-border smm:hidden">
          {visible.map((user) => (
            <li key={user.email} className="flex items-start gap-3 p-4">
              <Avatar user={user} />
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="truncate font-medium capitalize text-foreground">
                  {user.name || "—"}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <RoleBadges user={user} />
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden smm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <span className="font-medium capitalize text-foreground">
                        {user.name || "—"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <RoleBadges user={user} />
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
          title="Users"
          description={
            isLoading
              ? "Election creators and voters on Votar."
              : `${total.toLocaleString()} ${debouncedSearch ? "matching " : ""}user${total === 1 ? "" : "s"} on Votar.`
          }
        />

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
            <div
              role="tablist"
              aria-label="Filter users"
              className="flex gap-1 overflow-x-auto rounded-lg bg-muted p-1"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors",
                    filter === f.id
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f.label}
                  {!isLoading && (
                    <span className="rounded-full bg-white/70 px-1.5 text-xs">
                      {counts[f.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                aria-label="Search users"
                className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          {filter !== "all" && !isLoading && totalPages > 1 && (
            <p className="border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
              Showing {filter === "creators" ? "election creators" : "voters"} on this page. The tab counts are for this page.
            </p>
          )}

          {renderBody()}

          {!isLoading && !error && totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 border-t border-border p-4 smm:flex-row smm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserSection;
