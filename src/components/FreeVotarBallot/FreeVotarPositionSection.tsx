import React from "react";
import { Ban, CheckCircle2, Gift, Undo2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/utils/cn";
import type { BallotData, FreeVotarCandidate } from "@/utils/types";
import FreeVotarCandidateCard from "./FreeVotarCandidateCard";

interface FreeVotarPositionSectionProps {
  position: BallotData;
  positionIndex: number;
  total: number;
  accent: string;
  freeVotes: number;
  abstained: boolean;
  /** Whether another vote here would cost credits the voter doesn't have. */
  outOfVotes: boolean;
  onSelect: (candidate: FreeVotarCandidate) => void;
  onVote: (candidateIndex: number, increment: boolean) => void;
  onAbstain: () => void;
  onShowDetails: (candidate: FreeVotarCandidate) => void;
}

/** One position on the free ballot: free votes, candidates and abstain. */
const FreeVotarPositionSection = ({
  position,
  positionIndex,
  total,
  accent,
  freeVotes,
  abstained,
  outOfVotes,
  onSelect,
  onVote,
  onAbstain,
  onShowDetails,
}: FreeVotarPositionSectionProps) => {
  const votesCast = position.candidates.reduce((sum, c) => sum + c.vote, 0);
  const paidVotes = Math.max(0, votesCast - freeVotes);
  const done = abstained || votesCast > 0;

  return (
    <section
      aria-labelledby={`position-${positionIndex}`}
      className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <header className="flex flex-col items-center gap-2 border-b border-border px-3 py-4 text-center ssm:px-4 smm:px-6 smm:py-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Position {positionIndex + 1} of {total}
        </span>
        <h2
          id={`position-${positionIndex}`}
          className="break-words text-lg font-bold uppercase tracking-wide text-foreground ssm:text-xl smm:text-2xl"
        >
          {position.name_of_position}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            {freeVotes} free vote{freeVotes === 1 ? "" : "s"}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              done ? "bg-emerald-50 text-emerald-700" : "bg-muted text-muted-foreground",
            )}
          >
            {done && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
            {abstained
              ? "Abstained"
              : votesCast > 0
                ? `${votesCast} vote${votesCast === 1 ? "" : "s"}${paidVotes ? ` · ${paidVotes} paid` : ""}`
                : "No votes yet"}
          </span>
        </div>
      </header>

      <div className="p-3 ssm:p-4 smm:p-6">
        <div className="flex flex-wrap justify-center gap-3 smm:gap-4">
          {position.candidates.map((candidate, candidateIndex) => (
            <FreeVotarCandidateCard
              key={candidate._id || candidateIndex}
              candidate={candidate}
              accent={accent}
              isAbstained={abstained}
              isIncrementDisabled={abstained || outOfVotes}
              onSelect={() => onSelect(candidate)}
              onIncrement={() => onVote(candidateIndex, true)}
              onDecrement={() => onVote(candidateIndex, false)}
              onShowDetails={
                candidate.media || candidate.more_details
                  ? () => onShowDetails(candidate)
                  : undefined
              }
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-5">
          {abstained ? (
            <>
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-left text-sm font-medium text-amber-800 ssm:items-center ssm:px-4">
                <Ban className="mt-0.5 h-4 w-4 shrink-0 ssm:mt-0" aria-hidden="true" />
                You&apos;re abstaining from this position.
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={onAbstain}
                className="h-10"
              >
                <Undo2 /> Remove abstention
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onAbstain}
                disabled={votesCast > 0}
                className="h-11 w-full ssm:w-auto ssm:min-w-[160px]"
              >
                <Ban /> Abstain
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {votesCast > 0
                  ? "Remove your votes here to abstain instead."
                  : "Don't want to vote for this position? Abstain instead."}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FreeVotarPositionSection;
