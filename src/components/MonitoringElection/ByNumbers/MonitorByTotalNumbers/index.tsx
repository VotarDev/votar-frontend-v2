import React, { useState, useEffect } from "react";
import { votingPositions } from "@/utils/util";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";
import { monitorTotalVote } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import { set } from "lodash";

const MonitorByTotalNumbers = ({ electionId }: { electionId: string }) => {
  const [colors, setColors] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<any>(null);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const cols = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];
  const user = useUser();
  const users = useCurrentUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const getCandiddatesByIndividualNumbers = async () => {
      setIsFetchCandidate(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        const { data } = await monitorTotalVote(electionId);
        if (data) {
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
          console.log(filteredData);
          setCandidates(filteredData);
          setIsFetchCandidate(false);
          // console.log(data.data);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchCandidate(false);
      }
    };
    getCandiddatesByIndividualNumbers();
  }, []);

  console.log(candidates);

  if (isFetchCandidate)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20">
        {candidates?.map((positions: any, index: any) => {
          const voteNumber = positions.totalVotes.toString().split("");
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
                <div>{positions.name_of_position}</div>
                <div>
                  <img
                    src={rightline.src}
                    alt="line"
                    className="w-14 lg:w-full"
                  />
                </div>
              </div>
              <div className="flex justify-center gap-4 pt-[100px]">
                {voteNumber.map((num: any, index: any) => (
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

export default MonitorByTotalNumbers;
