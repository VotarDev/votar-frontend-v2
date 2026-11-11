import { parseElectionDate } from "@/utils/electionTime";
import type { Position } from "@/utils/types";

export type DetailsField =
  | "electionName"
  | "startDate"
  | "startTime"
  | "endDate"
  | "endTime"
  | "pricePerVote";

export type DetailsErrors = Partial<Record<DetailsField, string>>;

/** In page order, so the first error can be scrolled to. */
export const DETAILS_FIELD_ORDER: DetailsField[] = [
  "electionName",
  "startDate",
  "startTime",
  "endDate",
  "endTime",
  "pricePerVote",
];

interface DetailsValues {
  electionName: string;
  /** "YYYY-MM-DD" */
  startDate: string;
  endDate: string;
  /** The API values ("November 21, 2026 08:30"); empty until both date and time are set. */
  startTime: string;
  endTime: string;
  monetizeElection: boolean;
  pricePerVote: number | string;
}

/** The required Details fields. Returns an empty object when the step can be saved. */
export const validateDetails = (values: DetailsValues): DetailsErrors => {
  const errors: DetailsErrors = {};

  if (!values.electionName.trim()) {
    errors.electionName = "Enter the name of the election.";
  }

  if (!values.startDate) errors.startDate = "Choose the date voting opens.";
  else if (!values.startTime) errors.startTime = "Choose the time voting opens.";

  if (!values.endDate) errors.endDate = "Choose the date voting closes.";
  else if (!values.endTime) errors.endTime = "Choose the time voting closes.";

  const start = parseElectionDate(values.startTime);
  const end = parseElectionDate(values.endTime);
  if (start && end && end.getTime() <= start.getTime()) {
    errors.endTime = "Voting must close after it opens.";
  }

  if (values.monetizeElection && !(Number(values.pricePerVote) > 0)) {
    errors.pricePerVote = "Enter a price per vote greater than 0.";
  }

  return errors;
};

/** The first problem with the ballot, or null when every position is complete. */
export const validateBallot = (positions: Position[]): string | null => {
  if (positions.length === 0) return "Add at least one position to the ballot.";

  for (let p = 0; p < positions.length; p++) {
    const position = positions[p];
    const positionLabel = position.name_of_position?.trim() || `Position ${p + 1}`;

    if (!position.name_of_position?.trim()) {
      return `Give position ${p + 1} a name.`;
    }
    if (position.candidates.length === 0) {
      return `Add at least one candidate to ${positionLabel}.`;
    }
    const unnamed = position.candidates.findIndex((c) => !c.candidate_name?.trim());
    if (unnamed !== -1) {
      return `Enter a name for candidate ${unnamed + 1} in ${positionLabel}.`;
    }
  }
  return null;
};
