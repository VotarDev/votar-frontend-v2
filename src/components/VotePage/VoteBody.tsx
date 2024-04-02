import React, { useEffect, useState, useContext } from "react";
import leftline from "../../../public/assets/images/left-line.svg";
import rightline from "../../../public/assets/images/right-line.svg";
import { Candidate, Details, Position } from "@/utils/types";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import avatar from "../../../public/assets/images/avatar-placeholder.png";
import checked from "../../../public/assets/icons/checked.svg";
import Modal from "../Modal";
import { AnimatePresence } from "framer-motion";
import CandidateDetails from "./CandidateDetails";

const VoteBody = () => {
  let positions;
  if (typeof window !== "undefined") {
    const positionData = localStorage.getItem("positions");
    if (positionData) {
      positions = JSON.parse(positionData);
    }
  }
  const [votingData, setVotingData] = useState<Position[]>(positions);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<
    Details[]
  >([]);
  const [colors, setColors] = useState<string[]>([]);
  const cols = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleVote = (
    positionIndex: number,
    candidateIndex: number,
    increment: boolean
  ) => {
    if (votingData && votingData[positionIndex]) {
      const updatedData = [...votingData];
      const candidate = updatedData[positionIndex].candidates[candidateIndex];
      if (candidate) {
        if (increment) {
          candidate.vote++;
        } else {
          candidate.vote--;
        }
      }
      setVotingData(updatedData);
    }
  };
  const handleSelectCandidate = (candidate: Candidate) => {
    if (selectedCandidates.includes(candidate) && candidate.vote <= 0) {
      setSelectedCandidates((prevCandidates) =>
        prevCandidates.filter((c) => c !== candidate)
      );
    } else {
      setSelectedCandidates((prevCandidate) => [...prevCandidate, candidate]);
    }
  };
  const closeModal = () => setShowModal(false);
  const handleDetails = (candidate: Candidate) => {
    setSelectedCandidateDetails([
      //@ts-ignore
      { dets: candidate.details, media: candidate.media },
    ]);
    setShowModal(true);
  };

  console.log(votingData);

  return (
    <>
      {isClient && (
        <div className="mt-[56px] max-w-[1200px] mx-auto">
          {votingData &&
            votingData.map((preview, index) => {
              const randomColor = cols[Math.floor(Math.random() * cols.length)];
              return (
                <div
                  key={index}
                  className="bg-slate-50 my-20 p-10"
                  style={{
                    ...(isClient && { borderLeft: `4px solid ${randomColor}` }),
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
                    <div>{preview.name}</div>
                    <div>
                      <img
                        src={rightline.src}
                        alt="line"
                        className="w-14 lg:w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-16">
                    {preview.candidates.map((candidate, candidateIndex) => (
                      <div
                        key={candidateIndex}
                        className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded cursor-pointer relative ${
                          selectedCandidates.includes(candidate)
                            ? "active"
                            : "duration-500"
                        }`}
                        onClick={(e) => handleSelectCandidate(candidate)}
                      >
                        {selectedCandidates.includes(candidate) && (
                          <div className="absolute -right-2 -top-3 ">
                            <img src={checked.src} alt="" />
                          </div>
                        )}

                        <div>
                          {preview.showPictures && (
                            <div className="mb-3">
                              <img
                                src={`${
                                  candidate.image.length > 0
                                    ? candidate.image[
                                        candidate.image.length - 1
                                      ]
                                    : avatar.src
                                }`}
                                className="w-[269px] h-[269px] object-cover rounded"
                                alt={`Image for ${candidate.name}`}
                              />
                            </div>
                          )}
                          <div className="capitalize">
                            <div>{candidate.name}</div>
                            <div className="text-base">
                              ({candidate.nickname})
                            </div>
                          </div>
                          <div
                            className="text-base text-blue-700 underline cursor-pointer font-normal"
                            onClick={() => handleDetails(candidate)}
                          >
                            More Detials
                          </div>
                          <div className="flex justify-center pt-3 gap-4 items-center">
                            <div>
                              <button
                                className={`w-10 h-10  bg-blue-700 rounded flex items-center justify-center text-neutral-100 ${
                                  candidate.vote <= 0
                                    ? "cursor-not-allowed opacity-50"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleVote(index, candidateIndex, false)
                                }
                                disabled={candidate.vote <= 0}
                              >
                                <span className="text-xl">
                                  <AiOutlineMinus />
                                </span>
                              </button>
                            </div>
                            <div>{candidate.vote}</div>
                            <div>
                              <button
                                className={`w-10 h-10  bg-blue-700 rounded flex items-center justify-center text-neutral-100`}
                                onClick={() =>
                                  handleVote(index, candidateIndex, true)
                                }
                              >
                                <span className="text-xl">
                                  <AiOutlinePlus />
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {preview.allowAbstain && (
                      <div className="flex justify-center items-center">
                        <button className="w-32 h-14 bg-blue-700 rounded-lg text-zinc-100 font-bold text-xl mb-10 uppercase">
                          Abstain
                        </button>
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {showModal && (
                      <Modal key="modal" handleClose={closeModal}>
                        <CandidateDetails details={selectedCandidateDetails} />
                      </Modal>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default VoteBody;
