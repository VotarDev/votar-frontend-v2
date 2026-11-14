import React from "react";
import { AlertTriangle, Ban, Loader2, UserRound, X } from "lucide-react";
import DialogShell from "@/src/components/shared/DialogShell";
import { Button } from "@/src/components/ui/button";
import type { SelectedCandidates } from "./types";

interface ReviewVotesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  voterName?: string;
  selections: SelectedCandidates[];
}

/** Last look at the voter's choices before they're submitted. */
const ReviewVotesDialog = ({
  open,
  onClose,
  onConfirm,
  isSubmitting,
  voterName,
  selections,
}: ReviewVotesDialogProps) => (
  <DialogShell
    open={open}
    onClose={isSubmitting ? () => {} : onClose}
    labelledBy="review-votes-title"
    className="flex max-h-[85vh] max-w-lg flex-col overflow-hidden p-0"
  >
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-4 smm:px-6">
      <div>
        <h2
          id="review-votes-title"
          className="text-lg font-semibold text-foreground"
        >
          Review your votes
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {voterName ? (
            <>
              <span className="font-medium capitalize text-foreground">
                {voterName}
              </span>
              , check
            </>
          ) : (
            "Check"
          )}{" "}
          your choices below. Go back to change anything.
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        aria-label="Close"
        className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
      >
        <X className="h-5 w-5" />
      </button>
    </div>

    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 smm:px-6">
      {selections.map((selection, index) => (
        <div
          key={index}
          className="rounded-xl border border-border p-3 smm:p-4"
        >
          <p className="mb-2 break-words text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {selection.position}
          </p>
          {selection.abstain ? (
            <p className="flex items-center gap-2 text-sm font-medium text-amber-700">
              <Ban className="h-4 w-4" aria-hidden="true" /> Abstained
            </p>
          ) : (
            <ul className="space-y-2">
              {selection.candidates
                // Free Votar keeps every candidate; show only those voted for.
                ?.filter((c) => c.vote === undefined || c.vote > 0)
                .map((candidate, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {candidate.candidate_picture ? (
                      <img
                        src={candidate.candidate_picture}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-5 w-5 text-muted-foreground" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium capitalize text-foreground">
                      {candidate.candidate_name}
                    </span>
                    {candidate.candidate_nickname && (
                      <span className="block truncate text-xs capitalize text-muted-foreground">
                        {candidate.candidate_nickname}
                      </span>
                    )}
                  </span>
                  {candidate.vote !== undefined && (
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {candidate.vote} vote{candidate.vote === 1 ? "" : "s"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <p className="flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Votes can&apos;t be changed after you submit them.
      </p>
    </div>

    <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border px-4 py-4 smm:flex-row smm:justify-end smm:px-6">
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
        className="h-11"
      >
        Go back
      </Button>
      <Button onClick={onConfirm} disabled={isSubmitting} className="h-11">
        {isSubmitting && <Loader2 className="animate-spin" />}
        Confirm votes
      </Button>
    </div>
  </DialogShell>
);

export default ReviewVotesDialog;
