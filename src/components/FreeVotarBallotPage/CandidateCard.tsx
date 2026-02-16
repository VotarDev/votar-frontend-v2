import React from "react";
import checked from "../../../public/assets/icons/checked.svg";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FreeVotarCandidate } from "@/utils/types";

interface CandidateCardProps {
  candidate: FreeVotarCandidate;
  positionName: string;
  positionIndex: number;
  candidateIndex: number;
  isSelected: boolean;
  isAbstained: boolean;
  isIncrementDisabled: boolean;
  onSelect: (positionName: string, candidate: FreeVotarCandidate) => void;
  onVote: (
    positionIndex: number,
    candidateIndex: number,
    increment: boolean
  ) => void;
  onDetails: (details: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  positionName,
  positionIndex,
  candidateIndex,
  isSelected,
  isAbstained,
  isIncrementDisabled,
  onSelect,
  onVote,
  onDetails,
}) => {
  return (
    <div
      className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded cursor-pointer relative ${
        isSelected ? "active" : "duration-500"
      }`}
    >
      {isSelected && (
        <div className="absolute -right-2 -top-3 ">
          <img src={checked.src} alt="" />
        </div>
      )}

      <div>
        <div className="mb-3">
          <img
            onClick={() => onSelect(positionName, candidate)}
            src={candidate.candidate_picture}
            className="w-[269px] h-[269px] object-cover rounded"
            alt={`Image for ${candidate.candidate_name}`}
          />
        </div>

        <div className="capitalize">
          <div>{candidate.candidate_name}</div>
          <div className="text-base">({candidate.candidate_nickname})</div>
        </div>
        <div
          onClick={() => onDetails(candidate?.more_details || "")}
          className="text-base text-blue-700 underline cursor-pointer font-normal"
        >
          More Details
        </div>
        <div className="flex justify-center pt-3 gap-4 items-center">
          <div>
            <button
              className={`w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-neutral-100 ${
                candidate.vote <= 0 || isAbstained
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={() => onVote(positionIndex, candidateIndex, false)}
            >
              <span className="text-xl">
                <AiOutlineMinus />
              </span>
            </button>
          </div>
          <div>{candidate.vote ?? 0}</div>
          <div>
            <button
              disabled={isIncrementDisabled}
              className={`w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-neutral-100 `}
              onClick={() => onVote(positionIndex, candidateIndex, true)}
            >
              <span className="text-xl">
                <AiOutlinePlus />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
