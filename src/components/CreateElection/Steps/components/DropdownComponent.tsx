import React, { useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { VoterResponse } from "@/utils/types";
import DialogShell from "@/src/components/shared/DialogShell";
import { Button } from "@/src/components/ui/button";

interface ChangeLog {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface ChangeLogModalProps {
  changeLogs: ChangeLog[];
  voterId: string | number;
  currentVoter: VoterResponse;
}

const RELEVANT_FIELDS = ["name", "email", "phoneNumber", "subgroup"];
const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  phoneNumber: "Phone",
  subgroup: "Sub-group",
};

/** A voter's earlier details next to their current ones. Hidden when unchanged. */
const ChangeLogModal = ({
  changeLogs,
  voterId,
  currentVoter,
}: ChangeLogModalProps) => {
  const [open, setOpen] = useState(false);

  if (changeLogs.length === 0) return null;

  const titleId = `change-log-${voterId}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-secondary"
      >
        <History className="h-3.5 w-3.5" aria-hidden="true" />
        Changes
      </button>

      <DialogShell
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        className="max-w-lg"
      >
        <h2 id={titleId} className="text-lg font-semibold text-foreground">
          Change history
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Voter ID: {voterId}
        </p>
        <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
          {changeLogs.map((log) => {
            const changedFields = RELEVANT_FIELDS.filter(
              (field) =>
                log[field as keyof ChangeLog] !== undefined &&
                log[field as keyof ChangeLog] !==
                  currentVoter[field as keyof VoterResponse],
            );
            if (changedFields.length === 0) return null;

            return (
              <div
                key={log._id}
                className="space-y-2 rounded-lg border border-border p-3"
              >
                {changedFields.map((field) => (
                  <div key={field} className="text-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {FIELD_LABELS[field] || field}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground line-through">
                        {log[field as keyof ChangeLog] || "N/A"}
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-emerald-500"
                        aria-hidden="true"
                      />
                      <span className="font-medium text-foreground">
                        {(currentVoter[
                          field as keyof VoterResponse
                        ] as string) || "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogShell>
    </>
  );
};

export default ChangeLogModal;
