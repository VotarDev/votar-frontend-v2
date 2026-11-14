import React from "react";
import { FileText, UserRound, X } from "lucide-react";
import DialogShell from "@/src/components/shared/DialogShell";
import type { BallotCandidate } from "./types";

const kindOf = (url: string) =>
  /\.(png|jpe?g|gif|webp|svg)(\?|&|$)/i.test(url)
    ? "image"
    : /\.(mp4|webm|mov)(\?|&|$)/i.test(url)
      ? "video"
      : "file";

/** A candidate's photo, attached media and more details. */
const CandidateDetailsDialog = ({
  candidate,
  onClose,
}: {
  candidate: BallotCandidate | null;
  onClose: () => void;
}) => {
  const media = candidate?.media || "";
  const kind = media ? kindOf(media) : null;
  return (
    <DialogShell
      open={!!candidate}
      onClose={onClose}
      labelledBy="candidate-details-title"
      className="max-h-[85vh] max-w-lg overflow-y-auto p-0"
    >
      {candidate && (
        <>
          <div className="flex items-center gap-3 border-b border-border px-5 py-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
              {candidate.candidate_picture ? (
                <img
                  src={candidate.candidate_picture}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-6 w-6 text-muted-foreground" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="candidate-details-title"
                className="truncate font-semibold capitalize text-foreground"
              >
                {candidate.candidate_name}
              </h2>
              {candidate.candidate_nickname && (
                <p className="truncate text-sm capitalize text-muted-foreground">
                  {candidate.candidate_nickname}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4 p-5">
            {kind === "image" && (
              <img src={media} alt="" className="w-full rounded-lg object-contain" />
            )}
            {kind === "video" && (
              <video src={media} controls className="w-full rounded-lg" />
            )}
            {kind === "file" && (
              <a
                href={media}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm font-medium text-primary hover:bg-secondary"
              >
                <FileText className="h-4 w-4" /> Open attached document
              </a>
            )}
            {candidate.more_details && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {candidate.more_details}
              </p>
            )}
          </div>
        </>
      )}
    </DialogShell>
  );
};

export default CandidateDetailsDialog;
