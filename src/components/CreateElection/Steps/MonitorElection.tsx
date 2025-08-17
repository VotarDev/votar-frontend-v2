import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { CircularProgress } from "@mui/material";

import { IoCopy } from "react-icons/io5";
import {
  Check,
  Copy,
  ExternalLink,
  Eye,
  Monitor,
  BarChart3,
  Users,
} from "lucide-react";
import MonitoringCard from "../../ElectionsPage/MonitoringCard";

const MonitorElection = () => {
  const users = useCurrentUser();
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const totalNumberRef = useRef<HTMLElement | null>(null);
  const individualNumberRef = useRef<HTMLElement | null>(null);
  const [copiedStates, setCopiedStates] = useState({
    totalNumbers: false,
    individualNumbers: false,
  });

  const handleCopyClick = (ref: any, type: any) => {
    if (ref.current) {
      const textToCopy = ref.current.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedStates((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [type]: false }));
        }, 2000);
      });
    }
  };

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
      {/* <div className="text-4xl">Monitor Election</div> */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Monitor Election
          </h1>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Currently Monitoring
              </p>
              <h2 className="text-lg sm:text-xl font-semibold text-blue-900">
                {election?.name_of_election || "Election Name"}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="text-left mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Real-time Election Monitoring
          </h2>
          <p className="text-gray-600 max-w-2xl text-left">
            Access live election data and analytics through these specialized
            monitoring URLs. Share these links with authorized personnel for
            transparent election oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Total Numbers Monitoring */}
          <MonitoringCard
            title="Total Numbers Monitoring"
            description="View aggregated election statistics, total vote counts, and overall participation metrics in real-time."
            url={`https://www.votar.ng/monitoring-elections/${election?.election_id}/totalNumbers`}
            copyRef={totalNumberRef}
            onCopy={() => handleCopyClick(totalNumberRef, "totalNumbers")}
            copied={copiedStates.totalNumbers}
            icon={BarChart3}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />

          {/* Individual Numbers Monitoring */}
          <MonitoringCard
            title="Individual Numbers Monitoring"
            description="Access detailed individual voting data, candidate-specific metrics, and granular election analytics."
            url={`https://www.votar.ng/monitoring-elections/${election?.election_id}/individualNumbers`}
            copyRef={individualNumberRef}
            onCopy={() =>
              handleCopyClick(individualNumberRef, "individualNumbers")
            }
            copied={copiedStates.individualNumbers}
            icon={Users}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
          />
        </div>
      </div>
      {/* <div>
        <div className="pt-10">
          <h1 className="text-2xl">{election?.name_of_election}</h1>
        </div>
        <div className="pt-10">
          <div className="text-lg font-semibold">
            To Monitor your Election By Total Numbers
          </div>
          <div className=" flex items-center gap-5 pt-5">
            <div className="w-full max-w-[600px]  h-20 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-base text-xs text-blue-700 font-semibold p-4 lg:p-0">
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
      </div> */}
    </div>
  );
};

export default MonitorElection;
