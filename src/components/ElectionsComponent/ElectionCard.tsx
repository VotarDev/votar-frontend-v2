import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarDays, Settings2, Trash2, Vote } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import ElectionStatusBadge from "@/src/components/shared/ElectionStatusBadge";
import { useDeleteElectionMutation } from "@/redux/api/electionsApi";
import {
  formatElectionDate,
  getStatusForElection,
} from "@/utils/electionStatus";
import type { ElectionDetails } from "@/utils/types";

interface ElectionCardProps {
  election: Partial<ElectionDetails>;
  userId?: string;
  /** Replaces the default Manage / Delete footer (e.g. on Votar Forms). */
  actions?: React.ReactNode;
}

// Same route as before for an election's details.
export const electionHref = (election: Partial<ElectionDetails>) =>
  `/elections/${election.name_of_election}/${election.election_id}`;

const ElectionCard = ({ election, userId, actions }: ElectionCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteElection] = useDeleteElectionMutation();
  const status = getStatusForElection(election);

  const handleDelete = async () => {
    if (!userId || !election.election_id) return;
    try {
      await deleteElection({
        userId,
        electionId: election.election_id,
      }).unwrap();
      toast.success("Election deleted");
      setConfirmOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "We couldn't delete this election.");
      setConfirmOpen(false);
    }
  };

  return (
    <Card className="flex h-full flex-col p-5 transition-shadow hover:shadow-md">
      {/* Grows so the footers line up across a row. */}
      <div className="flex-1 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted text-muted-foreground">
            {election.association_logo ? (
              <img
                src={election.association_logo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Vote className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
              {election.name_of_election}
            </h3>
            {election.type && (
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {election.type}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <ElectionStatusBadge status={status} />
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <CalendarDays
            className="mt-px h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>
            {formatElectionDate(election.start_date)} –{" "}
            {formatElectionDate(election.end_date)}
          </span>
        </p>

        {election.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {election.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-4">
        {actions ?? (
          <>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={electionHref(election)}>
                <Settings2 /> Manage
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete ${election.name_of_election}`}
              className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:bg-red-50 hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        icon={Trash2}
        destructive
        title={`Delete "${election.name_of_election}"?`}
        description="This will permanently remove the election and its details. It can't be undone."
        confirmLabel="Delete"
      />
    </Card>
  );
};

export default ElectionCard;
