import React, { useState, useEffect } from "react";
import { votingCandidatePositions } from "@/utils/util";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";
import checked from "@/public/assets/icons/checked.svg";

const IndividualNumbers = () => {
  const [isMounted, setIsMounted] = useState(false);
  const cols = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <div>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20">
        {votingCandidatePositions.map((position, index) => {
          const randomColor = cols[Math.floor(Math.random() * cols.length)];
          const totalVotes = position.candidate.reduce(
            (accumulator, obj) => accumulator + obj.totalVote,
            0
          );
          console.log(totalVotes);
          return (
            <div
              key={index}
              className="bg-slate-50 p-10 "
              style={{
                ...(isMounted && { borderLeft: `4px solid ${randomColor}` }),
              }}
            >
              <div className="text-center text-slate-900 lg:text-[28px] text-base font-semibold flex items-center justify-center gap-2 uppercase">
                <div>
                  <img
                    src={leftline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
                <div>{position.position}</div>
                <div>
                  <img
                    src={rightline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-10 justify-center">
                {position.candidate.map((candidates, index) => {
                  const maxObject = position.candidate.reduce(
                    (max, obj) => (obj.totalVote > max.totalVote ? obj : max),
                    position.candidate[0]
                  );
                  return (
                    <div
                      key={index}
                      className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded relative ${
                        candidates.totalVote === maxObject.totalVote
                          ? "active bg-white"
                          : "duration-500"
                      }`}
                    >
                      {candidates.totalVote === maxObject.totalVote && (
                        <div className="absolute -right-2 -top-3 ">
                          <img src={checked.src} alt="" />
                        </div>
                      )}
                      <div>
                        <img src={candidates.image} alt="" />
                      </div>
                      <div className="capitalize pt-4">
                        <div>{candidates.name}</div>
                        <div className="text-base pt-2">
                          ({candidates.nickname})
                        </div>
                      </div>
                      <div className="text-blue-700 text-2xl font-bold pt-2">
                        {candidates.totalVote} Votes
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-blue-700 text-zinc-100 rounded opacity-80 pointer-events-none my-6 text-lg p-2 w-48 flex justify-center items-center text-center mx-auto">
                {position.abstained} Voters <br /> Abstained from Voting
              </div>
              <div className="text-center text-blue-700 text-3xl font-bold">
                Total Votes: {totalVotes}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndividualNumbers;
