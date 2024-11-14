import React, { useEffect, useState, useRef, RefObject } from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import { useRouter } from "next/router";
import { handleCopyClick, shortenText } from "@/utils/util";
import { IoCopy } from "react-icons/io5";
import toast from "react-hot-toast";

const MonitorAnElectionDetails = () => {
  const router = useRouter();
  const [electionId, setElectionId] = useState("");
  const [electionName, setElectionName] = useState("");
  const totalNumberRef = useRef<HTMLElement | null>(null);
  const individualNumberRef = useRef<HTMLElement | null>(null);

  const { id } = router.query;
  let idType: string | string[] | undefined = id;
  useEffect(() => {
    if (idType) {
      setElectionName(idType[0]);
      setElectionId(idType[1]);
    }
  }, [id]);

  console.log(electionId);

  return (
    <DashboardLayout>
      <div>
        <div className="text-4xl">Monitor Election</div>
        <div>
          <div className="pt-10">
            <h1 className="text-2xl">{electionName}</h1>
          </div>
          <div className="pt-10">
            <div className="text-lg font-semibold">
              To Monitor your Election By Total Numbers
            </div>
            <div className=" flex items-center gap-5 pt-5">
              <div className="w-full max-w-[800px]  h-20 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-base text-xs text-blue-700 font-semibold p-4 lg:p-0">
                {/* <span ref={totalNumberRef}>{`${shortenText(
              electionName
            )}.votar.ng/monitortotn`}</span> */}
                <span ref={totalNumberRef}>
                  https://www.votar.ng/monitoring-elections/
                  {electionId}/totalNumbers
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
              <div className="w-full max-w-[800px]  h-20 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-base text-xs text-blue-700 font-semibold p-4 lg:p-0">
                {/* <span ref={individualNumberRef}>{`${shortenText(
              electionName
            )}.votar.ng/monitorindn`}</span> */}
                <span ref={individualNumberRef}>
                  https://www.votar.ng/monitoring-elections/
                  {electionId}/individualNumbers
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
    </DashboardLayout>
  );
};

export default MonitorAnElectionDetails;
