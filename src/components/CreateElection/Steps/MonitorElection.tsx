import React, { useEffect, useState, useRef } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import { handleCopyClick } from "@/utils/util";
import { IoCopy } from "react-icons/io5";

const MonitorElection = () => {
  const users = useCurrentUser();
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const totalNumberRef = useRef<HTMLElement | null>(null);
  const individualNumberRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        if (typeof window !== "undefined") {
          const electionId = localStorage.getItem("ElectionId");
          const electionData = { election_id: electionId };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            console.log(data.data);
            setIsLoading(false);
          }
        }
      } catch (e: any) {
        console.log(e?.response?.data?.message);
      }
    };
    getElection();
  }, []);

  if (isLoading) {
    return (
      <div className="my-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }
  return (
    <div className="my-[60px]">
      <div className="text-4xl">Monitor Election</div>
      <div>
        <div className="pt-10">
          <h1 className="text-2xl">{election?.name_of_election}</h1>
        </div>
        <div className="pt-10">
          <div className="text-lg font-semibold">
            To Monitor your Election By Total Numbers
          </div>
          <div className=" flex items-center gap-5 pt-5">
            <div className="w-full max-w-[600px]  h-20 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-base text-xs text-blue-700 font-semibold p-4 lg:p-0">
              {/* <span ref={totalNumberRef}>{`${shortenText(
              electionName
            )}.votar.ng/monitortotn`}</span> */}
              <span ref={totalNumberRef}>
                https://www.votar.ng/monitoring-elections/
                {election?.election_id}/totalNumbers
              </span>
            </div>
            <div
              onClick={() => handleCopyClick(totalNumberRef)}
              className="cursor-pointer flex items-center gap-2"
            >
              <span className="text-2xl">
                <IoCopy />
              </span>
              <span>Copy Link</span>
            </div>
          </div>
        </div>

        <div className="pt-10">
          <div className="text-lg font-semibold">
            To Monitor your Election By Individual Numbers
          </div>

          <div className=" flex items-center gap-5 pt-5">
            <div className="w-full max-w-[600px]  h-20 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-base text-xs text-blue-700 font-semibold p-4 lg:p-0">
              {/* <span ref={individualNumberRef}>{`${shortenText(
              electionName
            )}.votar.ng/monitorindn`}</span> */}
              <span ref={individualNumberRef}>
                https://www.votar.ng/monitoring-elections/
                {election?.election_id}/individualNumbers
              </span>
            </div>
            <div
              onClick={() => handleCopyClick(individualNumberRef)}
              className="cursor-pointer flex items-center gap-2"
            >
              <span className="text-2xl">
                <IoCopy />
              </span>
              <span>Copy Link</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorElection;
