import {
  getElectionStatus,
  parseElectionDate,
  type ElectionStatus,
} from "./electionTime";

interface ElectionWindow {
  start_date?: string;
  end_date?: string;
}

/**
 * Where an election is in its voting window, using the same parsing as the
 * ballot page. Returns null when neither date can be read, rather than
 * guessing "active".
 */
export const getStatusForElection = (
  election: ElectionWindow,
  now: number = Date.now()
): ElectionStatus | null => {
  const start = parseElectionDate(election.start_date);
  const end = parseElectionDate(election.end_date);
  if (!start && !end) return null;
  return getElectionStatus(start, end, now);
};

/**
 * Short date and time in the viewer's timezone, e.g. "25 Jul 2026, 09:00".
 * Unreadable values (such as "Invalid date") show as "—".
 */
export const formatElectionDate = (value?: string): string => {
  const date = parseElectionDate(value);
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
