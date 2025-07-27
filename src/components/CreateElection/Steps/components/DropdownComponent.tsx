import React, { useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import { VoterResponse } from "@/utils/types";

interface ChangeLog {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface ChangeLogModalProps {
  changeLogs: ChangeLog[];
  voterId: string | number;
  currentVoter: VoterResponse;
}

const ChangeLogModal = ({
  changeLogs,
  voterId,
  currentVoter,
}: ChangeLogModalProps) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);

  if (changeLogs.length === 0) return null;

  const relevantFields = ["name", "email", "phoneNumber", "subgroup"];

  return (
    <div>
      <div
        onClick={handleClickOpen}
        className="cursor-pointer text-blue-700 hover:text-blue-800 font-semibold"
      >
        View
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={handleClickClose}>
            <div className="bg-white rounded-lg py-6 px-10 text-left max-w-[800px] w-full">
              <div className="text-xl font-semibold pb-5">
                Change Log for Voter ID: {voterId}
              </div>
              <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {changeLogs.map((log, index) => {
                  const changedFields = relevantFields.filter(
                    (field) =>
                      log[field as keyof ChangeLog] !== undefined &&
                      log[field as keyof ChangeLog] !==
                        currentVoter[field as keyof VoterResponse]
                  );

                  if (changedFields.length === 0) return null;

                  return (
                    <div
                      key={log._id}
                      className="py-2 border-b border-gray-100 last:border-b-0"
                    >
                      {changedFields.map((field) => (
                        <div
                          key={field}
                          className="flex justify-between items-center gap-3 "
                        >
                          <span className="capitalize text-lg font-semibold">
                            {field}:
                          </span>
                          <div className="flex items-center gap-2 text-base">
                            <span className="text-gray-800">
                              {log[field as keyof ChangeLog] || "N/A"}
                            </span>
                            <span className="text-green-500">
                              <FaAnglesRight />
                            </span>
                            <span className="text-gray-800">
                              {currentVoter[field as keyof VoterResponse] ||
                                "N/A"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleClickClose}
                  className="bg-gray-300 text-gray-800 w-40 h-12 rounded flex items-center justify-center outline-none hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChangeLogModal;
