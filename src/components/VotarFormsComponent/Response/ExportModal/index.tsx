import { ElectionDetails } from "@/utils/types";
import React from "react";

const ExportModal = ({
  handleClose,
  election,
}: {
  handleClose: () => void;
  election: ElectionDetails[];
}) => {
  return (
    <div>
      <div className="bg-white rounded-lg py-[24px] px-10 text-left">
        <div className="text-xl font-semibold pb-5">Export To Election</div>
        <form>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="election">Select Election</label>
              <select
                name="election"
                id="election"
                className="border border-zinc-600 w-full rounded h-12 outline-none px-4 cursor-pointer"
              >
                <option value="">Select Election</option>
                {election.map((election) => (
                  <option
                    key={election.election_id}
                    value={election.election_id}
                  >
                    {election.name_of_election}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-5">
            <button className="w-full h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded">
              Export To Election
            </button>
          </div>
        </form>
        <div className="flex justify-end mt-10">
          <button
            onClick={handleClose}
            className="bg-red-500 text-white w-40 h-12 rounded flex items-center justify-center outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
