import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { toast } from "react-hot-toast";
import { AlertCircle, ArrowLeft, Check, Copy, Link2 } from "lucide-react";
import AdminLayout from "../AdminLayout";
import SwitchButton from "../AdminProfile/SwitchButton";
import SmsSwitchButton from "../AdminProfile/SmsSwitchButton";
import { getElectionById } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { formatElectionDate, getStatusForElection } from "@/utils/electionStatus";
import EmptyState from "@/src/components/shared/EmptyState";
import ElectionStatusBadge from "@/src/components/shared/ElectionStatusBadge";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";

const CopyField = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Please copy it manually.");
    }
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm text-foreground">{value}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={copy} aria-label={`Copy ${label}`} className="h-8 w-8 shrink-0">
        {copied ? <Check className="text-emerald-600" /> : <Copy />}
      </Button>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
    <dd className="mt-1 font-medium text-foreground">{value}</dd>
  </div>
);

/**
 * An election's details for admins, from the live election record:
 * /…/election-details/<id>/<name> and /…/votarpro-election-details/<id>/<name>.
 */
const AdminElectionDetails = () => {
  const router = useRouter();
  const segments = (router.query.id as string[] | undefined) ?? [];
  const electionId = segments[0] || "";
  const nameFromLink = segments[1] ? decodeURIComponent(segments[1]) : "";

  const [election, setElection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchElection = async () => {
    if (!electionId) return;
    setIsLoading(true);
    setError(false);
    const token = new Cookies().get("admin-token");
    if (token) setAuthToken(token);
    try {
      const { data } = await getElectionById({ election_id: electionId });
      setElection(data?.data ?? null);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) fetchElection();
  }, [router.isReady, electionId]);

  const isFree = election?.type === "Free Votar";
  // Same voting links organisers share.
  const votingLink =
    typeof window !== "undefined" && election
      ? isFree
        ? `${window.location.origin}/freevotar/ballot?candidate=${election.election_id}`
        : `${window.location.origin}/vote`
      : "";

  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      );
    }
    if (error || !election) {
      return (
        <Card>
          <EmptyState
            icon={AlertCircle}
            title="We couldn't load this election"
            description="It may have been deleted, or the connection failed."
            action={
              <Button variant="outline" onClick={fetchElection}>
                Try again
              </Button>
            }
          />
        </Card>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-6 p-5 lg:col-span-2 smm:p-6">
          <div className="flex items-start gap-4">
            {election.association_logo && (
              <img
                src={election.association_logo}
                alt=""
                className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                {election.type && <Badge variant="secondary">{election.type}</Badge>}
                <ElectionStatusBadge status={getStatusForElection(election)} />
                {election.payment_status && (
                  <Badge variant={election.payment_status === "Paid" ? "success" : "warning"}>
                    {election.payment_status}
                  </Badge>
                )}
              </div>
              {election.description && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {election.description}
                </p>
              )}
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-5 border-t border-border pt-5 ssm:grid-cols-2">
            <Detail label="Voting opens" value={formatElectionDate(election.start_date)} />
            <Detail label="Voting closes" value={formatElectionDate(election.end_date)} />
            <Detail
              label="Max candidates per position"
              value={election.max_number_candidate ?? "—"}
            />
            {isFree && (
              <>
                <Detail label="Free votes per position" value={election.free_votes ?? "—"} />
                <Detail
                  label="Price per extra vote"
                  value={`₦${Number(election.price_per_vote || 0).toLocaleString()}`}
                />
              </>
            )}
            <Detail
              label="Organiser"
              value={<span className="break-all">{election.author_email || "—"}</span>}
            />
          </dl>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h2 className="font-semibold text-foreground">Controls</h2>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Published</p>
                <p className="text-xs text-muted-foreground">Voters can only vote once it&apos;s published.</p>
              </div>
              <SwitchButton row={election} initialStatus={election.published} />
            </div>
            {election.type === "Votar Pro" && (
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Send SMS</p>
                  <p className="text-xs text-muted-foreground">Send SMS notifications for this election.</p>
                </div>
                <SmsSwitchButton row={election} />
              </div>
            )}
          </Card>

          <Card className="space-y-3 p-5">
            <h2 className="flex items-center gap-2 font-semibold text-foreground">
              <Link2 className="h-4 w-4" aria-hidden="true" /> Share
            </h2>
            <CopyField label="Election ID" value={election.election_id} />
            {votingLink && <CopyField label="Voting link" value={votingLink} />}
          </Card>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="break-words text-2xl font-semibold capitalize tracking-tight text-foreground lg:text-3xl">
            {election?.name_of_election || nameFromLink || "Election"}
          </h1>
        </div>
        {renderBody()}
      </div>
    </AdminLayout>
  );
};

export default AdminElectionDetails;
