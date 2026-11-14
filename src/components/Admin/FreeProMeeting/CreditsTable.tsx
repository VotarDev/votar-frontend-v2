import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import { AlertCircle, Coins, Inbox, Plus, Search, SearchX } from "lucide-react";
import { adminGetAllUsers, adminTopUp } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import EmptyState from "@/src/components/shared/EmptyState";
import Pagination from "@/src/components/shared/Pagination";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
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

const PAGE_SIZE = 30; // as before

/** A credit amount box and an Add button for one organiser. */
const TopUpControl = ({
  email,
  isBusy,
  onRequest,
}: {
  email: string;
  isBusy: boolean;
  onRequest: (email: string, amount: number, reset: () => void) => void;
}) => {
  const [amount, setAmount] = useState("");
  const value = Number(amount);
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!value || value <= 0) {
          toast.error("Please enter a valid amount before topping up");
          return;
        }
        onRequest(email, value, () => setAmount(""));
      }}
    >
      <input
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="Credits"
        aria-label={`Credits to add for ${email}`}
        className="h-9 w-full min-w-0 rounded-md border border-input bg-white px-3 text-sm tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 smm:w-28"
      />
      <Button type="submit" size="sm" disabled={isBusy || !value} className="shrink-0">
        <Plus /> Add
      </Button>
    </form>
  );
};

/** Organisers' credit balances, with manual top-ups (e.g. after a bank transfer). */
const CreditsTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pending, setPending] = useState<{
    email: string;
    amount: number;
    reset: () => void;
  } | null>(null);
  const [busyEmail, setBusyEmail] = useState<string | null>(null);

  // Search on the server, half a second after typing stops (as before).
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const authorise = () => {
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(false);
    authorise();
    try {
      const { data } = await adminGetAllUsers(
        "creators",
        String(page),
        String(PAGE_SIZE),
        debouncedSearch || undefined,
      );
      setUsers(data?.data?.electionCreators || []);
      setTotal(data?.data?.pagination?.total || 0);
    } catch (e) {
      console.error("Error fetching users:", e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const topUp = async () => {
    if (!pending) return;
    const { email, amount, reset } = pending;
    setBusyEmail(email);
    authorise();
    try {
      const { data } = await adminTopUp({ email, amount });
      if (data) {
        toast.success(`Successfully topped up ${amount} votar credits to ${email}`);
        reset();
        await fetchUsers();
      }
    } catch (e) {
      console.error("Error topping up votar credits:", e);
      toast.error("Failed to top up votar credits. Please try again.");
    } finally {
      setBusyEmail(null);
      setPending(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const request = (email: string, amount: number, reset: () => void) =>
    setPending({ email, amount, reset });

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
          title="No organisers match your search"
          action={
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear search
            </Button>
          }
        />
      ) : (
        <EmptyState icon={Inbox} title="No organisers yet" />
      );
    }
    return (
      <>
        <ul className="divide-y divide-border md:hidden">
          {users.map((row) => (
            <li key={row.email} className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate font-medium text-foreground">{row.email}</p>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold tabular-nums text-primary">
                  {Number(row.votar_credit || 0).toLocaleString()} credits
                </span>
              </div>
              <TopUpControl
                email={row.email}
                isBusy={busyEmail === row.email}
                onRequest={request}
              />
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organiser</TableHead>
                <TableHead className="text-right">Votar credits</TableHead>
                <TableHead className="w-[240px]">Add credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((row) => (
                <TableRow key={row.email}>
                  <TableCell className="font-medium text-foreground">{row.email}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {Number(row.votar_credit || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <TopUpControl
                      email={row.email}
                      isBusy={busyEmail === row.email}
                      onRequest={request}
                    />
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organisers by email"
            aria-label="Search organisers"
            className="h-10 w-full rounded-lg border border-input bg-white pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20"
          />
        </div>
        {!isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} organiser{total === 1 ? "" : "s"}
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

      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={topUp}
        icon={Coins}
        title="Add Votar credits?"
        description={
          pending
            ? `${pending.amount.toLocaleString()} credits will be added to ${pending.email}. This can't be undone from here.`
            : undefined
        }
        confirmLabel="Add credits"
      />
    </div>
  );
};

export default CreditsTable;
