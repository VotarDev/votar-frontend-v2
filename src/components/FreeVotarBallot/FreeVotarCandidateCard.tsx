import React from "react";
import { Check, Info, Minus, Plus, UserRound } from "lucide-react";
import { cn } from "@/utils/cn";
import type { FreeVotarCandidate } from "@/utils/types";

interface FreeVotarCandidateCardProps {
  candidate: FreeVotarCandidate;
  accent: string;
  isAbstained: boolean;
  isIncrementDisabled: boolean;
  onSelect: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  /** Shown only when the candidate has media or more details. */
  onShowDetails?: () => void;
}

const stepButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40";

/** A candidate with a vote counter; tapping the photo toggles one vote. */
const FreeVotarCandidateCard = ({
  candidate,
  accent,
  isAbstained,
  isIncrementDisabled,
  onSelect,
  onIncrement,
  onDecrement,
  onShowDetails,
}: FreeVotarCandidateCardProps) => {
  const votes = candidate.vote ?? 0;
  const selected = votes > 0;
  return (
    <div
      className={cn(
        "relative flex w-[calc(50%-0.375rem)] min-w-0 flex-col overflow-hidden rounded-xl border-2 bg-white text-center shadow-sm transition-all smm:w-[210px] lg:w-[230px]",
        selected ? "shadow-md" : "border-border",
        isAbstained && "opacity-60",
      )}
      style={selected ? { borderColor: accent } : undefined}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${selected ? "Remove votes for" : "Vote for"} ${candidate.candidate_name}`}
        className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        {candidate.candidate_picture ? (
          <img
            src={candidate.candidate_picture}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        )}
        <span
          className={cn(
            "absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow transition-all ssm:right-2 ssm:top-2 ssm:h-7 ssm:w-7",
            selected ? "scale-100 text-white" : "scale-90 bg-white/80 text-transparent",
          )}
          style={selected ? { backgroundColor: accent } : undefined}
          aria-hidden="true"
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </span>
      </button>

      <div className="flex w-full flex-1 flex-col items-center px-2 pb-3 pt-2.5 ssm:px-3">
        <p className="break-words text-sm font-semibold capitalize leading-snug text-foreground ssm:text-base smm:text-lg">
          {candidate.candidate_name}
        </p>
        {candidate.candidate_nickname && (
          <p className="mt-0.5 break-words text-xs capitalize text-muted-foreground ssm:text-sm">
            ({candidate.candidate_nickname})
          </p>
        )}

        <div className="mt-auto flex items-center justify-center gap-2 pt-3 ssm:gap-3">
          <button
            type="button"
            onClick={onDecrement}
            disabled={votes <= 0 || isAbstained}
            aria-label={`One less vote for ${candidate.candidate_name}`}
            className={stepButton}
            style={{ backgroundColor: accent }}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className="min-w-[2rem] text-xl font-bold tabular-nums text-foreground"
            aria-live="polite"
            aria-label={`${votes} votes`}
          >
            {votes}
          </span>
          <button
            type="button"
            onClick={onIncrement}
            disabled={isIncrementDisabled}
            aria-label={`One more vote for ${candidate.candidate_name}`}
            className={stepButton}
            style={{ backgroundColor: accent }}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {onShowDetails && (
        <button
          type="button"
          onClick={onShowDetails}
          className="flex items-center justify-center gap-1.5 border-t border-border py-2.5 text-xs font-medium text-primary transition-colors hover:bg-secondary ssm:text-sm"
        >
          <Info className="h-4 w-4" aria-hidden="true" /> More details
        </button>
      )}
    </div>
  );
};

export default FreeVotarCandidateCard;
