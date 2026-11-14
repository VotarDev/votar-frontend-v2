import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Trophy, UserRound } from "lucide-react";
import setAuthToken from "@/utils/setAuthToken";
import { monitorInidividualNumber } from "@/utils/api";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/utils/cn";
import PositionCard, { accentFor } from "../../PositionCard";

/** Votes for each candidate, position by position. */
const MonitorByindividualNumbers = ({ electionId }: { electionId: string }) => {
  const [candidates, setCandidates] = useState<any>(null);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);

  useEffect(() => {
    const getCandidatesByIndividualNumbers = async () => {
      setIsFetchCandidate(true);
      // Use the signed-in token when there is one; never clear the header.
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await monitorInidividualNumber(electionId);
        if (data) {
          const formattedData = data.data.map(
            ([abstainedData, candidatesData]: any) => ({
              // All candidates in a group share the same position.
              position: candidatesData[0].position,
              candidates: candidatesData,
              abstained: abstainedData.abstain,
            }),
          );
          setCandidates(formattedData);
        }
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsFetchCandidate(false);
      }
    };
    getCandidatesByIndividualNumbers();
  }, []);

  if (isFetchCandidate) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {candidates?.map((position: any, index: number) => {
        const totalVotes = position.candidates.reduce(
          (sum: number, obj: any) => sum + obj.numberOfVotes,
          0,
        );
        const maxVotes = Math.max(
          ...position.candidates.map((c: any) => c.numberOfVotes),
        );

        return (
          <PositionCard
            key={index}
            title={position.position}
            accent={accentFor(index)}
            meta={
              <span>
                <span className="font-semibold text-foreground">
                  {(totalVotes + position.abstained).toLocaleString()}
                </span>{" "}
                total votes
              </span>
            }
          >
            {/* Centred, so a few candidates don't sit to one side. */}
            <div className="flex flex-wrap items-stretch justify-center gap-4">
              {position.candidates.map((candidate: any, i: number) => {
                const isLeading =
                  maxVotes > 0 && candidate.numberOfVotes === maxVotes;
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative flex w-full max-w-[280px] flex-col overflow-hidden rounded-lg border bg-white text-center ssm:w-[240px]",
                      isLeading
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border",
                    )}
                  >
                    {isLeading && (
                      <span className="absolute left-2 top-2 z-[1] inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
                        <Trophy className="h-3 w-3" aria-hidden="true" />
                        Leading
                      </span>
                    )}
                    <div className="flex aspect-square w-full items-center justify-center bg-muted">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.candidateName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound
                          className="h-12 w-12 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="font-semibold capitalize text-foreground">
                        {candidate.candidateName}
                      </p>
                      {candidate.nickName && (
                        <p className="text-sm capitalize text-muted-foreground">
                          ({candidate.nickName})
                        </p>
                      )}
                      <p className="mt-auto pt-2 text-xl font-bold text-primary">
                        {candidate.numberOfVotes.toLocaleString()}{" "}
                        <span className="text-sm font-medium">votes</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-border pt-4 text-sm">
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {position.abstained.toLocaleString()}
                </span>{" "}
                abstained
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-primary">
                Total votes:{" "}
                <span className="font-semibold">
                  {(totalVotes + position.abstained).toLocaleString()}
                </span>
              </span>
            </div>
          </PositionCard>
        );
      })}
    </div>
  );
};

export default MonitorByindividualNumbers;
