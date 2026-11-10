import React, { useEffect, useState } from "react";
import { ArrowRight, History } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { useGetElectionByIdQuery } from "@/redux/api/electionsApi";
import { getElectionDraft, type ElectionDraft } from "@/utils/electionDraft";
import { getElectionSteps, getStepLabel } from "./steps";

interface ResumeElectionCardProps {
  /** Continue the draft under its own plan (undefined if the election has none). */
  onResume: (plan?: string) => void;
}

/**
 * Offers to reopen an election the user started but didn't finish. Shown only
 * when the saved election can still be loaded.
 */
const ResumeElectionCard = ({ onResume }: ResumeElectionCardProps) => {
  const [draft, setDraft] = useState<ElectionDraft | null>(null);

  useEffect(() => {
    setDraft(getElectionDraft());
  }, []);

  const { data: election } = useGetElectionByIdQuery(
    draft?.electionId ?? skipToken,
  );

  if (!draft?.electionId || !election?.name_of_election) return null;

  const steps = getElectionSteps(election.type || null);
  const stepName = steps[Math.min(draft.step, steps.length) - 1];

  return (
    <Card className="flex flex-col gap-4 border-primary/30 bg-secondary/60 p-4 smm:flex-row smm:items-center lg:p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
        <History className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-muted-foreground">
          Continue where you left off
        </p>
        <p className="truncate font-semibold text-foreground">
          {election.name_of_election}
        </p>
        <p className="text-xs text-muted-foreground">
          {election.type} · Step {Math.min(draft.step, steps.length)} of{" "}
          {steps.length}, {getStepLabel(stepName)}
        </p>
      </div>
      <Button onClick={() => onResume(election.type)} className="shrink-0">
        Continue <ArrowRight />
      </Button>
    </Card>
  );
};

export default ResumeElectionCard;
