import React from "react";
import { useRouter } from "next/router";
import { ElectionDetails } from "@/utils/types";
import { CircularProgress } from "@mui/material";

const MonitorAnElection = ({
  elections,
  isFetchElections,
}: {
  elections: ElectionDetails[];
  isFetchElections: boolean;
}) => {
  const router = useRouter();
  const availableElections = [
    {
      election: "National Association of Political Science Students",
    },
    {
      election: "Most Beautiful Girl in Abuja",
    },
    {
      election: "NNPC Board Election",
    },
  ];
  const handleElectionDetails = (election: string, id: string) => {
    router.push(`/monitor-election/${election}/${id}`);
  };
  return (
    <div className="pt-10">
      <div>
        <h4 className="text-2xl font-semibold">Hello there!</h4>
        <p className="text-xl pt-2">
          You can monitor an election by Total numbers or Individual number via{" "}
          <br />
          our analytics tools, By Numbers, By Line Charts, By Bar Charts, and By
          Sub Group.
        </p>
      </div>
      <div className="pt-10">
        <div className="text-xl font-semibold">
          Select an Election below to monitor it...
        </div>
        {isFetchElections ? (
          <div className="mt-10">
            <CircularProgress size={30} style={{ color: "#015CE9" }} />
          </div>
        ) : (
          <div className=" pt-5">
            <div className="flex flex-col gap-5">
              {elections.map((election, index) => (
                <div key={index}>
                  <div
                    className="flex items-center gap-2"
                    onClick={() =>
                      handleElectionDetails(
                        election.name_of_election,
                        election.election_id
                      )
                    }
                  >
                    <input
                      type="checkbox"
                      name="checkbox"
                      id={`checkbox${index}`}
                      className="w-5 h-5 bg-white rounded-full align-middle border border-gray-600 appearance-none outline-none cursor-pointer checked:bg-blue-600 checked:border-white"
                    />
                    <label
                      htmlFor={`checkbox${index}`}
                      className="text-lg cursor-pointer"
                    >
                      {election.name_of_election}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitorAnElection;
