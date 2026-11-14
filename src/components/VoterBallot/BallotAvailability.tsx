import React from "react";
import { CalendarX, Clock, EyeOff } from "lucide-react";
import {
  formatInViewerTimeZone,
  getElectionStatus,
  getViewerTimeZone,
  parseElectionDate,
  type ElectionStatus,
} from "@/utils/electionTime";
import BallotStatusCard from "./BallotStatusCard";

const formatTime = (value: unknown) => {
  const instant = parseElectionDate(value);
  return instant ? formatInViewerTimeZone(instant) : String(value ?? "");
};

/** Voting window status, worked out from the election's stored times. */
export const statusForElection = (election: any): ElectionStatus | null =>
  election
    ? getElectionStatus(
        parseElectionDate(election.start_date),
        parseElectionDate(election.end_date),
      )
    : null;

/**
 * Why the ballot can't be used right now, or null when voting is open.
 * Ended wins (it's final), then "not published", then "not started".
 */
const BallotAvailability = ({
  election,
  status,
}: {
  election: any;
  /** Pass a live status if the page tracks one; otherwise it's worked out. */
  status?: ElectionStatus | null;
}) => {
  if (!election) return null;
  const current = status ?? statusForElection(election);
  const timeHint = `Shown in your local time (${getViewerTimeZone()})`;

  if (current === "ended") {
    return (
      <BallotStatusCard
        icon={CalendarX}
        tone="danger"
        title="This election has ended"
        description="The voting period is now closed. Thank you for your interest."
        detailLabel="Ended on"
        detail={formatTime(election.end_date)}
        detailHint={timeHint}
      />
    );
  }

  if (election.published === false) {
    return (
      <BallotStatusCard
        icon={EyeOff}
        tone="neutral"
        title="This election isn't open yet"
        description="The organiser hasn't published this election, so voting isn't available. Please check back later or contact the election organiser."
        detailLabel={current === "not_started" ? "Scheduled to start" : undefined}
        detail={
          current === "not_started" ? formatTime(election.start_date) : undefined
        }
        detailHint={current === "not_started" ? timeHint : undefined}
      />
    );
  }

  if (current === "not_started") {
    return (
      <BallotStatusCard
        icon={Clock}
        title="Voting hasn't started yet"
        description="This election isn't open for voting yet. Please come back when it begins."
        detailLabel="Starts on"
        detail={formatTime(election.start_date)}
        detailHint={timeHint}
      />
    );
  }

  return null;
};

export default BallotAvailability;
