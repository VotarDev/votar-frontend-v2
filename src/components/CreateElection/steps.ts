// The create-election steps for each plan. The step names are also the keys
// the create page switches on, so keep them as they are and change only labels.
export const getElectionSteps = (plan: string | null) => {
  if (plan === "Free Votar") {
    return ["Details", "Ballot", "Pay", "Monitor Election"];
  }
  return ["Details", "Ballot", "Voters Page", "Pay", "Monitor Election"];
};

const STEP_LABELS: Record<string, string> = {
  "Voters Page": "Voters",
  "Monitor Election": "Monitor",
};

/** Short label to show for a step name. */
export const getStepLabel = (step: string) => STEP_LABELS[step] ?? step;
