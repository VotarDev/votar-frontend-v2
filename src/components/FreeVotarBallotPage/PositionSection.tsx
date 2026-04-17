import React from "react";
import leftline from "../../../public/assets/images/left-line.svg";
import rightline from "../../../public/assets/images/right-line.svg";

import CandidateCard from "./CandidateCard";
import { BallotData, FreeVotarCandidate } from "@/utils/types";

interface PositionSectionProps {
  position: BallotData;
  candidates: BallotData[];
  positionIndex: number;
  freeVoteDetails: { position: string; free_votes: number; _id: string }[];
  abstentions: any;
  votarCredit: number;
  election: any;
  onSelectCandidate: (
    positionName: string,
    selectedCandidate: FreeVotarCandidate
  ) => void;
  onVote: (
    positionIndex: number,
    candidateIndex: number,
    increment: boolean
  ) => void;
  onAbstain: (position: string) => void;
  onDetails: (details: string) => void;
}

const PositionSection: React.FC<PositionSectionProps> = ({
  position,
  candidates,
  positionIndex,
  freeVoteDetails,
  abstentions,
  votarCredit,
  election,
  onSelectCandidate,
  onVote,
  onAbstain,
  onDetails,
}) => {
  const randomColor = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ][Math.floor(Math.random() * 6)];

  const positionFreeVotes =
    (Array.isArray(freeVoteDetails) &&
      freeVoteDetails.find(
        (detail) => detail.position === position.name_of_position
      )?.free_votes) ||
    0;

  const totalVotes = position.candidates.reduce((sum, c) => sum + c.vote, 0);

  const pricePerVote = Number(election?.price_per_vote ?? 0);
  const allowedPaidVotes =
    pricePerVote > 0 ? Math.floor(votarCredit / pricePerVote) : Infinity;

  const currentPaidVotesUsed = candidates.reduce((acc, pos) => {
    const posFree =
      freeVoteDetails.find((d) => d.position === pos.name_of_position)
        ?.free_votes || 0;
    const posTotal = pos.candidates.reduce((s, c) => s + c.vote, 0);
    return acc + Math.max(0, posTotal - posFree);
  }, 0);

  const willUsePaidVoteForThisPosition =
    positionFreeVotes === 0 ? true : totalVotes >= positionFreeVotes;

  return (
    <div
      className="bg-slate-50 mt-0 mb-14 p-10"
      style={{
        borderLeft: `4px solid ${randomColor}`,
      }}
    >
      <div className="text-center text-slate-900 lg:text-[28px] text-base font-semibold flex items-center justify-center gap-2 uppercase">
        <div>
          <img src={leftline.src} alt="line" className="w-14 lg:w-full" />
        </div>
        <div>{position.name_of_position}</div>
        <div>
          <img src={rightline.src} alt="line" className="w-14 lg:w-full" />
        </div>
      </div>
      <div className="mt-7 flex flex-col items-center">
        <h1 className="text-lg font-semibold">Free Votes</h1>
        <div className="flex">
          <div className="flex gap-2">
            {positionFreeVotes
              .toString()
              .split("")
              .map((digit, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded font-bold mr-2"
                >
                  {digit}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-10">
        {position.candidates.map((candidate, candidateIndex) => {
          const isSelected = candidate.vote > 0;
          const isAbstained = abstentions[position.name_of_position]?.abstained;

          const isIncrementDisabled =
            isAbstained ||
            (willUsePaidVoteForThisPosition &&
              currentPaidVotesUsed >= allowedPaidVotes);

          return (
            <CandidateCard
              key={candidateIndex}
              candidate={candidate}
              positionName={position.name_of_position}
              positionIndex={positionIndex}
              candidateIndex={candidateIndex}
              isSelected={isSelected}
              isAbstained={isAbstained}
              isIncrementDisabled={isIncrementDisabled}
              onSelect={onSelectCandidate}
              onVote={onVote}
              onDetails={onDetails}
            />
          );
        })}
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={() => onAbstain(position.name_of_position)}
          disabled={abstentions[position.name_of_position]?.abstained}
          className={`w-32 h-14 bg-blue-700 rounded-lg text-zinc-100 font-bold text-xl uppercase ${
            abstentions[position.name_of_position]?.abstained
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Abstain
        </button>
      </div>
    </div>
  );
};

export default PositionSection;
