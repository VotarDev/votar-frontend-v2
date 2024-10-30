import React, { useState, useEffect } from "react";
import { votingCandidatePositions } from "@/utils/util";
import leftline from "@/public/assets/images/left-line.svg";
import rightline from "@/public/assets/images/right-line.svg";
import checked from "@/public/assets/icons/checked.svg";
import setAuthToken from "@/utils/setAuthToken";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { monitorInidividualNumber } from "@/utils/api";
import { CircularProgress } from "@mui/material";

const MonitorByindividualNumbers = ({ electionId }: { electionId: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [candidates, setCandidates] = useState<any>(null);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);
  const user = useUser();
  const users = useCurrentUser();
  const cols = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

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
        const { data } = await monitorInidividualNumber(electionId);
        console.log(data.data);
        if (data) {
          const formattedData = data.data.map(
            ([abstainedData, candidatesData]: any) => {
              const position = candidatesData[0].position; // Assuming all candidates have the same position
              return {
                position,
                candidates: candidatesData,
                abstained: abstainedData.abstain,
              };
            }
          );
          console.log(formattedData);
          setCandidates(formattedData);
          setIsFetchCandidate(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchCandidate(false);
      }
    };
    getCandiddatesByIndividualNumbers();
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isFetchCandidate)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  console.log(candidates);

  return (
    <div>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-20">
        {candidates?.map((position: any, index: any) => {
          const randomColor = cols[Math.floor(Math.random() * cols.length)];
          const totalVotes = position.candidates.reduce(
            (accumulator: any, obj: any) => accumulator + obj.numberOfVotes,
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
                {position.candidates.map((candidates: any, index: any) => {
                  const maxObject = position.candidates.reduce(
                    (max: any, obj: any) =>
                      obj.numberOfVotes > max.numberOfVotes ? obj : max,
                    position.candidates[0]
                  );
                  return (
                    <div
                      key={index}
                      className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded relative ${
                        candidates.numberOfVotes === maxObject.numberOfVotes
                          ? "active bg-white"
                          : "duration-500"
                      }`}
                    >
                      {candidates.numberOfVotes === maxObject.numberOfVotes && (
                        <div className="absolute -right-2 -top-3 ">
                          <img src={checked.src} alt="" />
                        </div>
                      )}
                      <div>
                        <img
                          src={candidates.image}
                          alt=""
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="capitalize pt-4">
                        <div>{candidates.candidateName}</div>
                        <div className="text-base pt-2">
                          ({candidates.nickName})
                        </div>
                      </div>
                      <div className="text-blue-700 text-2xl font-bold pt-2">
                        {candidates.numberOfVotes} Votes
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-blue-700 text-zinc-100 rounded opacity-80 pointer-events-none my-6 text-lg p-2 w-48 flex justify-center items-center text-center mx-auto">
                {position.abstained} Voters <br /> Abstained from Voting
              </div>
              <div className="text-center text-blue-700 text-3xl font-bold">
                Total Votes: {totalVotes + position.abstained}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonitorByindividualNumbers;
