/**
 * The create-election flow keeps its progress in localStorage under these keys.
 * The step components read "ElectionId" (and the ballot preview reads
 * "positions") directly, so the key names must not change.
 */
export const ELECTION_DRAFT_KEYS = {
  electionId: "ElectionId",
  step: "electionSteps",
  furthestStep: "electionFurthestStep",
  positions: "positions",
} as const;

export interface ElectionDraft {
  electionId: string | null;
  step: number;
  furthestStep: number;
}

const readStep = (key: string): number => {
  const value = parseInt(localStorage.getItem(key) || "", 10);
  return Number.isFinite(value) && value >= 1 ? value : 1;
};

/** The in-progress election, if any. Only call in the browser. */
export const getElectionDraft = (): ElectionDraft => {
  const step = readStep(ELECTION_DRAFT_KEYS.step);
  return {
    electionId: localStorage.getItem(ELECTION_DRAFT_KEYS.electionId),
    step,
    // Older sessions didn't record the furthest step; the current one is the best guess.
    furthestStep: Math.max(step, readStep(ELECTION_DRAFT_KEYS.furthestStep)),
  };
};

/** Forget the in-progress election so the next one starts at step 1. */
export const clearElectionDraft = () => {
  Object.values(ELECTION_DRAFT_KEYS).forEach((key) =>
    localStorage.removeItem(key)
  );
};
