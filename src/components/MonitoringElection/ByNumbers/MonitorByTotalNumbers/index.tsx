import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { monitorTotalVote } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { Skeleton } from "@/src/components/ui/skeleton";
import PositionCard, { accentFor } from "../../PositionCard";

/** Total votes cast for each position, shown as large digits. */
const MonitorByTotalNumbers = ({ electionId }: { electionId: string }) => {
  const [candidates, setCandidates] = useState<any>(null);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);

  useEffect(() => {
    const getCandidatesByTotalNumbers = async () => {
      setIsFetchCandidate(true);
      // Use the signed-in token when there is one; never clear the header.
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await monitorTotalVote(electionId);
        if (data) {
          // One entry per position (the API can repeat them).
          const seenPositions = new Set();
          const filteredData = data.data
            .filter((item: any) => {
              const key = item.totalNumber.name_of_position;
              if (!seenPositions.has(key)) {
                seenPositions.add(key);
                return true;
              }
              return false;
            })
            .map((item: any) => item.totalNumber);
          setCandidates(filteredData);
        }
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsFetchCandidate(false);
      }
    };
    getCandidatesByTotalNumbers();
  }, []);

  if (isFetchCandidate) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {candidates?.map((positions: any, index: number) => {
        const totalVotes = positions.totalVotes + positions.abstain;
        const voteNumber = totalVotes.toString().split("");

        return (
          <PositionCard
            key={positions.id ?? index}
            title={positions.name_of_position}
            accent={accentFor(index)}
          >
            <div className="flex flex-col items-center py-4 lg:py-8">
              <div
                className="flex flex-wrap justify-center gap-2 lg:gap-4"
                aria-label={`${totalVotes} votes`}
              >
                {voteNumber.map((num: string, i: number) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="flex h-16 w-12 items-center justify-center rounded-lg bg-primary text-3xl font-bold text-primary-foreground shadow-sm smm:h-20 smm:w-16 smm:text-4xl lg:h-28 lg:w-24 lg:text-6xl"
                  >
                    {num}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary lg:text-base">
                Votes
              </p>
            </div>
          </PositionCard>
        );
      })}
    </div>
  );
};

export default MonitorByTotalNumbers;
