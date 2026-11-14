import React from "react";
import { Check, Info, UserRound } from "lucide-react";
import { cn } from "@/utils/cn";
import type { BallotCandidate } from "./types";

interface BallotCandidateCardProps {
  candidate: BallotCandidate;
  selected: boolean;
  accent: string;
  onSelect: () => void;
  /** Shown only when the candidate has media or more details. */
  onShowDetails?: () => void;
}

/** A candidate the voter can tap to select (or tap again to unselect). */
const BallotCandidateCard = ({
  candidate,
  selected,
  accent,
  onSelect,
  onShowDetails,
}: BallotCandidateCardProps) => (
  <div
    className={cn(
      "relative flex w-[calc(50%-0.5rem)] flex-col overflow-hidden rounded-xl border-2 bg-white text-center shadow-sm transition-all smm:w-[200px] lg:w-[220px]",
      selected
        ? "border-transparent shadow-md"
        : "border-border hover:-translate-y-0.5 hover:shadow-md",
    )}
    style={selected ? { borderColor: accent } : undefined}
  >
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden bg-muted">
        {candidate.candidate_picture ? (
          <img
            src={candidate.candidate_picture}
            alt={candidate.candidate_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound
            className="h-12 w-12 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow transition-all",
            selected ? "scale-100 text-white" : "scale-90 bg-white/80 text-transparent",
          )}
          style={selected ? { backgroundColor: accent } : undefined}
          aria-hidden="true"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-3 py-3 text-center">
        <p className="font-semibold capitalize leading-snug text-foreground smm:text-lg">
          {candidate.candidate_name}
        </p>
        {candidate.candidate_nickname && (
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">
            ({candidate.candidate_nickname})
          </p>
        )}
      </div>
    </button>
    {onShowDetails && (
      <button
        type="button"
        onClick={onShowDetails}
        className="flex items-center justify-center gap-1.5 border-t border-border py-2.5 text-sm font-medium text-primary transition-colors hover:bg-secondary"
      >
        <Info className="h-4 w-4" aria-hidden="true" /> More details
      </button>
    )}
  </div>
);

export default BallotCandidateCard;
