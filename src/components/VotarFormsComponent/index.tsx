import React from "react";
import { useUser } from "@/utils/hooks";
import { useRouter } from "next/router";

const VotarFormsComponent = () => {
  const user = useUser();
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
  const handleElectionDetails = (election: string) => {
    router.push(`/votar-forms/${election}`);
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
        <div className=" pt-5">
          <div className="flex flex-col gap-5">
            {availableElections.map((election, index) => (
              <div key={index}>
                <div
                  className="flex items-center gap-2"
                  onClick={() => handleElectionDetails(election.election)}
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
                    {election.election}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotarFormsComponent;
