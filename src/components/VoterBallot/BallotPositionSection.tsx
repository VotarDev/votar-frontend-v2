import React from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/utils/cn";
import BallotCandidateCard from "./BallotCandidateCard";
import type { BallotCandidate, BallotPosition } from "./types";

interface BallotPositionSectionProps {
  position: BallotPosition;
  /** 1-based, for "Position 2 of 5". */
  number: number;
  total: number;
  accent: string;
  maxChoices: number;
  selectedCount: number;
  abstained: boolean;
  isSelected: (candidate: BallotCandidate) => boolean;
  onSelect: (candidate: BallotCandidate) => void;
  onAbstain: () => void;
  onShowDetails: (candidate: BallotCandidate) => void;
}

const hasDetails = (candidate: BallotCandidate) =>
  !!(candidate.media || candidate.more_details);

/** One position on the ballot: its candidates and the abstain option. */
const BallotPositionSection = ({
  position,
  number,
  total,
  accent,
  maxChoices,
  selectedCount,
  abstained,
  isSelected,
  onSelect,
  onAbstain,
  onShowDetails,
}: BallotPositionSectionProps) => {
  const done = abstained || selectedCount > 0;
  return (
    <section
      aria-labelledby={`position-${number}`}
      className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <header className="flex flex-col items-center gap-2 border-b border-border px-4 py-5 text-center smm:px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Position {number} of {total}
        </span>
        <h2
          id={`position-${number}`}
          className="text-xl font-bold uppercase tracking-wide text-foreground smm:text-2xl"
        >
          {position.name_of_position}
        </h2>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            done
              ? "bg-emerald-50 text-emerald-700"
              : "bg-muted text-muted-foreground",
          )}
        >
          {done && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
          {abstained
            ? "Abstained"
            : maxChoices > 1
              ? `${selectedCount} of ${maxChoices} chosen`
              : selectedCount
                ? "Chosen"
                : "Choose 1 candidate"}
        </span>
      </header>

      <div className="p-4 smm:p-6">
        <div className="flex flex-wrap justify-center gap-4">
          {position.candidates.map((candidate, i) => (
            <BallotCandidateCard
              key={candidate._id || i}
              candidate={candidate}
              accent={accent}
              selected={isSelected(candidate)}
              onSelect={() => onSelect(candidate)}
              onShowDetails={
                hasDetails(candidate) ? () => onShowDetails(candidate) : undefined
              }
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-5">
          {abstained ? (
            <p className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
              <Ban className="h-4 w-4" aria-hidden="true" />
              You&apos;re abstaining. Pick a candidate to change your mind.
            </p>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={onAbstain}
                className="h-11 min-w-[160px]"
              >
                <Ban /> Abstain
              </Button>
              <p className="text-xs text-muted-foreground">
                Don&apos;t want to vote for this position? Abstain instead.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BallotPositionSection;
