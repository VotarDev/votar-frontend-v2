import React, { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CalendarDays, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";
import ElectionStatusBadge from "@/src/components/shared/ElectionStatusBadge";
import { useDeleteElectionMutation } from "@/redux/api/electionsApi";
import {
  formatElectionDate,
  getStatusForElection,
} from "@/utils/electionStatus";
import { withCacheBust } from "@/utils/electionMedia";
import type { ElectionDetails } from "@/utils/types";

interface ElectionCardProps {
  election: Partial<ElectionDetails>;
  userId?: string;
}

// Same route as before for an election's details.
export const electionHref = (election: Partial<ElectionDetails>) =>
  `/elections/${election.name_of_election}/${election.election_id}`;

const ElectionCard = ({ election, userId }: ElectionCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteElection] = useDeleteElectionMutation();
  const status = getStatusForElection(election);

  const backgroundUrl = useMemo(
    () =>
      election.type === "Free Votar"
        ? withCacheBust(election.elect_background_img)
        : null,
    [election.type, election.elect_background_img],
  );
  const bannerStyle: React.CSSProperties = backgroundUrl
    ? {
        backgroundImage: `url("${backgroundUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(135deg, ${
          election.primary_color || "#015CE9"
        }, ${election.secondary_color || election.primary_color || "#5692F0"})`,
      };

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
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-24" style={bannerStyle}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute right-3 top-3">
          <ElectionStatusBadge status={status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5">
        <div className="-mt-7 h-14 w-14 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-muted shadow-sm">
          {election.association_logo && (
            <img
              src={election.association_logo}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-1 font-semibold text-foreground">
            {election.name_of_election}
          </h3>
          {election.type && <Badge variant="secondary">{election.type}</Badge>}
        </div>

        <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
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
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {election.description}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Button asChild className="flex-1">
            <Link href={electionHref(election)}>
              <Settings2 /> Manage
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setConfirmOpen(true)}
            aria-label={`Delete ${election.name_of_election}`}
            className="shrink-0 text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
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
