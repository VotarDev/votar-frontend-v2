import React from "react";
import { Lock } from "lucide-react";
import { parseElectionDate } from "@/utils/electionTime";
import { cn } from "@/utils/cn";

interface VotingLockNoticeProps {
  /** The election's stored end date, to tell "started" from "ended". */
  endDate?: unknown;
  /** What's locked, e.g. "the ballot". */
  subject: string;
  className?: string;
}

/** Explains why part of an election can't be edited once voting has begun. */
const VotingLockNotice = ({ endDate, subject, className }: VotingLockNoticeProps) => {
  const end = parseElectionDate(endDate);
  const hasEnded = !!end && Date.now() > end.getTime();
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800",
        className,
      )}
    >
      <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      Voting has {hasEnded ? "ended" : "started"}, so {subject} can no longer
      be changed.
    </div>
  );
};

export default VotingLockNotice;
