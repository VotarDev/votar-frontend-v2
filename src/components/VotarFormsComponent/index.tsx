import React from "react";
import { useUser } from "@/utils/hooks";
import { useRouter } from "next/router";
import { ElectionDetails } from "@/utils/types";
import { CircularProgress } from "@mui/material";

const VotarFormsComponent = ({
  elections,
  isFetchElections,
}: {
  elections: ElectionDetails[];
  isFetchElections: boolean;
}) => {
  const user = useUser();
  const router = useRouter();

  const handleElectionDetails = (election: string, id: string) => {
    router.push(`/votar-forms/${election}/${id}`);
  };
  return (
    <div>
      <div className="pt-10 text-2xl capitalize font-semibold">
        Hello, {user.user.username && <>{user.user.username.split(" ")[0]}</>}
      </div>
      <div className="text-xl pt-2">
        Create a form with votar forms to collect the information of the voters{" "}
        <br />
        for your election. Export the voters information directly to your <br />{" "}
        election or export to an excel sheet for personal use.
      </div>
      <div className="pt-10">
        <div className="text-xl font-semibold">
          Select an Election below to create or access the form...
        </div>
        {isFetchElections ? (
          <div className="mt-10">
            <CircularProgress size={30} style={{ color: "#015CE9" }} />
          </div>
        ) : (
          <div className=" pt-5">
            {elections.length === 0 ? (
              <div className=" text-lg font-medium text-gray-500">
                No elections found
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {elections
                  .filter((election) => election.type !== "Free Votar")
                  .map((election, index) => (
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotarFormsComponent;
