import React, { useState, useEffect } from "react";
import { votingPositions } from "@/utils/util";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";

const TotalNumbers = () => {
  const [colors, setColors] = useState<string[]>([]);
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
        {votingPositions.map((positions, index) => {
          const voteNumber = positions.numberOfVotes.toString().split("");
          const randomColor = cols[Math.floor(Math.random() * cols.length)];

          return (
            <div
              key={positions.id}
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
                <div>{positions.title}</div>
                <div>
                  <img
                    src={rightline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 pt-[100px]">
                {voteNumber.map((num, index) => (
                  <div
                    key={index}
                    className="w-32 h-32 bg-blue-700 rounded-xl flex items-center justify-center text-7xl font-bold text-neutral-100"
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="text-center text-blue-700 text-5xl font-bold pt-10 pb-[100px]">
                VOTES
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalNumbers;
