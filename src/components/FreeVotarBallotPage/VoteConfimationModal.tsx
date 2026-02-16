import React from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";
import leftline from "../../../public/assets/images/left-line.svg";
import rightline from "../../../public/assets/images/right-line.svg";
import { PiWarningCircleFill } from "react-icons/pi";
import { CircularProgress } from "@mui/material";
import { SelectedCandidates } from "@/utils/types";

interface VoteConfirmationModalProps {
  showModal: boolean;
  selectedCandidates: SelectedCandidates[];
  voterName: string;
  isCastVote: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VoteConfirmationModal: React.FC<VoteConfirmationModalProps> = ({
  showModal,
  selectedCandidates,
  voterName,
  isCastVote,
  onClose,
  onConfirm,
}) => {
  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <Modal
          key="modal"
          handleClose={onClose}
          classname="overflow-y-scroll h-[80vh] ballot-modal bg-white"
        >
          <div className="rounded h-full">
            <div className="text-center py-8 pb-5 max-w-[40rem] mx-auto ">
              Hello{" "}
              <span className="capitalize font-semibold">{voterName}</span>, the
              candidates you voted for in the different positions are
              highlighted below. Kindly, look through to confirm they are your
              final choices. If they are, click on the{" "}
              <span className="font-semibold">Confirm Votes</span> to submit
              your votes. If you would like to change your candidates selection
              in any position, click on{" "}
              <span className="font-semibold">Go back</span> to go to your
              secret ballot page and reselect your preferred candidate.
            </div>
            <div>
              {selectedCandidates.map((selectedCandidate, index) => (
                <div key={index} className="mb-8">
                  <div className="text-center text-slate-900 lg:text-xl text-base font-semibold flex items-center justify-center gap-2 uppercase">
                    <div>
                      <img src={leftline.src} alt="line" className="w-40" />
                    </div>
                    <div>{selectedCandidate.position}</div>
                    <div>
                      <img src={rightline.src} alt="line" className="w-40" />
                    </div>
                  </div>

                  {selectedCandidate.abstain ? (
                    <div className="text-center text-red-500 font-semibold py-2">
                      You have abstained from voting for this position.
                    </div>
                  ) : (
                    <div className="flex justify-center gap-8 flex-wrap mt-4">
                      {selectedCandidate.candidates?.map(
                        (candidate, candidateIndex) => (
                          <div key={candidateIndex} className="pb-3">
                            <div className="flex justify-center py-2">
                              <img
                                src={candidate.candidate_picture}
                                alt="candidate"
                                className="w-20 h-20 object-cover rounded-full"
                              />
                            </div>
                            <div className="font-semibold text-center">
                              {candidate.candidate_name}
                            </div>
                            <div className="text-center">
                              ({candidate.candidate_nickname})
                            </div>
                            <div className="text-center text-blue-700 font-semibold mt-1">
                              Votes: {candidate.vote}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex bg-[#FFBC11] bg-opacity-20 text-left p-4 justify-center my-5 mx-auto max-w-[700px] gap-2">
                <div className="text-[#ECAE0D] text-xl">
                  <PiWarningCircleFill />
                </div>
                <div className="text-[#826008]">
                  Please ensure that you have selected your preferred candidate
                  in each position as votes cannot be submitted again after the
                  first submission
                </div>
              </div>
              <div className="flex justify-center p-5 items-center gap-5">
                <div>
                  <button
                    onClick={onClose}
                    className="flex justify-center items-center outline-none border border-blue-700 text-blue-700 font-semibold capitalize w-40 h-12 rounded-lg"
                  >
                    Go back
                  </button>
                </div>
                <div>
                  <button
                    onClick={onConfirm}
                    disabled={isCastVote}
                    className="flex justify-center items-center outline-none border-none bg-blue-700 text-slate-100 font-semibold capitalize w-40 h-12 rounded-lg"
                  >
                    Confirm Votes
                    {isCastVote && (
                      <CircularProgress
                        className="ml-3"
                        size={18}
                        style={{ color: "inherit" }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default VoteConfirmationModal;
