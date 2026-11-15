import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { AlertCircle, ArrowLeft, Inbox, Mail } from "lucide-react";
import AdminLayout from "../AdminLayout";
import SwitchButton from "../AdminProfile/SwitchButton";
import SmsSwitchButton from "../AdminProfile/SmsSwitchButton";
import { getVotarPageByElection } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { parseElectionDate } from "@/utils/electionTime";
import PageHeader from "@/src/components/shared/PageHeader";
import EmptyState from "@/src/components/shared/EmptyState";
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

const PLANS = {
  "free-votar": {
    label: "Free Votar",
    apiType: "Free Votar",
    back: { href: "/admin/free-pro-meeting", label: "Free Votar & credits" },
    detailsBase: "/admin/free-pro-meeting/election-details",
    sms: false,
  },
  "votar-pro": {
    label: "Votar Pro",
    apiType: "",
    back: { href: "/admin/free-pro-meeting/pro", label: "Votar Pro" },
    detailsBase: "/admin/free-pro-meeting/votarpro-election-details",
    sms: true,
  },
} as const;

type Plan = keyof typeof PLANS;

/** When an election was created (or, failing that, when it starts), for sorting. */
const sortTime = (row: any): number => {
  const created = Date.parse(row.createdAt || "");
  if (!Number.isNaN(created)) return created;
  const start =
    parseElectionDate(row.start_date) ??
    parseElectionDate(`${row.date || ""} ${row.start_time || ""}`.trim()) ??
    parseElectionDate(row.date);
  if (start) return start.getTime();
  const loose = Date.parse(`${row.date || ""} ${row.start_time || ""}`);
  return Number.isNaN(loose) ? 0 : loose;
};

const StatusBadge = ({ status }: { status?: string }) => (
  <Badge variant={status === "Pending" ? "warning" : "success"} className="capitalize">
    {status || "—"}
  </Badge>
);

/** One organiser's elections on a plan, with publish (and, for Pro, SMS) controls. */
const OrganiserElections = ({ plan }: { plan: Plan }) => {
  const config = PLANS[plan];
  const router = useRouter();
  const [elections, setElections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Route: /…/details/<plan>/<email>
  const segments = (router.query.id as string[] | undefined) ?? [];
  const routePlan = segments[0];
  const email = segments[1] ? decodeURIComponent(segments[1]) : "";

  const fetchElections = async () => {
    if (!email || routePlan !== plan) return;
    setIsLoading(true);
    setError(false);
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
    try {
      const { data } = await getVotarPageByElection(email, config.apiType);
      const list = Array.isArray(data?.data) ? data.data : [];
      // Latest first.
      setElections([...list].sort((a, b) => sortTime(b) - sortTime(a)));
    } catch (e) {
      console.log(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) fetchElections();
  }, [router.isReady, email, routePlan]);

  const detailsHref = (row: any) =>
    `${config.detailsBase}/${row.election_id || row.id}/${encodeURIComponent(
      row.nameOfElection || "",
    )}`;

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <EmptyState
          icon={AlertCircle}
          title="We couldn't load these elections"
          description="Check your connection and try again."
          action={
            <Button variant="outline" onClick={fetchElections}>
              Try again
            </Button>
          }
        />
      );
    }
    if (elections.length === 0) {
      return <EmptyState icon={Inbox} title={`No ${config.label} elections for this organiser`} />;
    }
    return (
      <>
        <ul className="divide-y divide-border md:hidden">
          {elections.map((row, index) => (
            <li key={row.election_id || row.id || index} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={detailsHref(row)}
                  className="min-w-0 truncate font-medium text-primary hover:underline"
                >
                  {row.nameOfElection}
                </Link>
                <StatusBadge status={row.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                {row.date} · {row.start_time} – {row.close_time} ·{" "}
                {Number(row.numberOfVoters || 0).toLocaleString()} voters
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
                {config.sms && (
                  <span className="flex items-center gap-2">
                    Send SMS <SmsSwitchButton row={row} />
                  </span>
                )}
                <span className="flex items-center gap-2">
                  Published
                  <SwitchButton id={index} row={row} userMail={email} initialStatus={row.published} />
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Election</TableHead>
                <TableHead>Date and time</TableHead>
                <TableHead className="text-right">Voters</TableHead>
                <TableHead>Status</TableHead>
                {config.sms && <TableHead>Send SMS</TableHead>}
                <TableHead>Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {elections.map((row, index) => (
                <TableRow key={row.election_id || row.id || index}>
                  <TableCell className="max-w-[280px]">
                    <Link
                      href={detailsHref(row)}
                      className="block truncate font-medium text-primary hover:underline"
                    >
                      {row.nameOfElection}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {row.date}
                    <span className="block text-xs text-muted-foreground">
                      {row.start_time} – {row.close_time}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {Number(row.numberOfVoters || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  {config.sms && (
                    <TableCell>
                      <SmsSwitchButton row={row} />
                    </TableCell>
                  )}
                  <TableCell>
                    <SwitchButton id={index} row={row} userMail={email} initialStatus={row.published} />
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
        <div className="space-y-3">
          <Link
            href={config.back.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {config.back.label}
          </Link>
          <PageHeader
            title={`${config.label} elections`}
            description="Publish elections for this organiser and open one for its details."
          />
          {email && (
            <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{email}</span>
            </p>
          )}
        </div>
        <Card className="overflow-hidden">{renderBody()}</Card>
      </div>
    </AdminLayout>
  );
};

export default OrganiserElections;
