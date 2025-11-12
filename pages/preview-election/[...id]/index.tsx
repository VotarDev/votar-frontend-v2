import React, { useState, useEffect } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getBallotCandidate, getElectionById } from "@/utils/api";
import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import Header from "@/src/components/BallotPage/Header";
import { useRouter } from "next/router";
import { getCandidates } from "@/utils/api";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import leftline from "../../../public/assets/images/left-line.svg";
import placeholder from "../../../public/assets/images/Placeholder.png";
import rightline from "../../../public/assets/images/right-line.svg";
import MiniDashboard from "@/src/components/VotePage/MiniDashboard";
import { Candidate, Details, Position } from "@/utils/types";
import { AnimatePresence } from "framer-motion";
import checked from "../../../public/assets/icons/checked.svg";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Modal from "@/src/components/Modal";
import CandidateDetails from "@/src/components/VotePage/CandidateDetails";

let positions: Position[];
if (typeof window !== "undefined") {
  const positionData = localStorage.getItem("positions");
  if (positionData) {
    positions = JSON.parse(positionData);
  }
}
type SelectedCandidates = {
  position: string;
  candidates: Candidate[];
};

const MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED = 1;
const PreviewVote = () => {
  const users = useCurrentUser();
  const router = useRouter();
  const user = useUser();
  const [votingData, setVotingData] = useState<Position[]>(positions);
  const [election, setElection] = useState<any>([]);
  const [electionID, setElectionID] = useState("");
  const [candidates, setCandidates] = useState<any>([]);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [position, setPosition] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCandidates, setSelectedCandidates] = useState<
    SelectedCandidates[]
  >([]);
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<
    Details[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const cols = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[0]);
    }
  }, [id, electionID]);
  console.log(electionID);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

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
        if (electionID) {
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            setIsLoading(false);
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message);
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        if (electionID) {
          const electionIdData = { election_id: electionID };
          const { data } = await getCandidates(USER_ID, electionIdData);
          if (data) {
            setPosition(data.data);
            console.log(data);
          }
        }
      };
      fetchData();
    } catch (e) {
      console.log(e);
    }
  }, [electionID]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const getCandidatesData = async () => {
      setIsFetchCandidate(true);
      //   const cookie = new Cookies();
      //   const token = cookie.get(voterLoginCookieName);
      //   if (token) {
      //     setAuthToken(token);
      //   }
      try {
        const electionData = {
          election_id: electionID,
        };
        if (electionID) {
          const { data } = await getBallotCandidate(electionData);
          console.log(data);
          if (data) {
            setCandidates(data.data);
            setIsFetchCandidate(false);
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    getCandidatesData();
  }, [electionID]);

  const handleSelectCandidate = (position: string, candidate: Candidate) => {
    setSelectedCandidates((prevState: any) => {
      const existingIndex = prevState.findIndex(
        (sc: any) => sc.position === position
      );

      if (existingIndex !== -1) {
        const updatedCandidates = [...prevState[existingIndex].candidates];
        const candidateIndex = updatedCandidates.findIndex(
          (c) => c.candidate_name === candidate.candidate_name
        );

        if (candidateIndex !== -1) {
          // Remove the candidate if already selected
          updatedCandidates.splice(candidateIndex, 1);
        } else {
          // Add the candidate if not selected
          if (
            updatedCandidates.length >= MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED
          ) {
            // Remove the first candidate to maintain the limit
            updatedCandidates.shift();
          }
          updatedCandidates.push(candidate);
        }

        const updatedSelectedCandidates = [...prevState];
        updatedSelectedCandidates[existingIndex] = {
          position,
          candidates: updatedCandidates,
        };

        return updatedSelectedCandidates.filter(
          (sc) => sc.candidates.length > 0
        ); // Remove empty positions
      } else {
        return [...prevState, { position, candidates: [candidate] }];
      }
    });
  };

  const handleDetails = (candidate: Candidate) => {
    setSelectedCandidateDetails([
      //@ts-ignore
      { dets: candidate.details, media: candidate.media },
    ]);
    setShowModal(true);
  };
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
          candidate.votes++;
        } else {
          candidate.votes--;
        }
      }
      setVotingData(updatedData);
    }
  };

  const isCandidateActive = (position: string, candidate: Candidate) => {
    const positionData = selectedCandidates.find(
      (sc: any) => sc.position === position
    );
    return (
      positionData?.candidates.some(
        (c) => c.candidate_name === candidate.candidate_name
      ) ?? false
    );
  };

  const closeModal = () => setShowModal(false);

  if (isLoading) {
    return (
      <div className="my-10 text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }
  if (error) {
    return <div className="my-10">{error}</div>;
  }
  console.log(position);

  return (
    <>
      {isClient && (
        <div className="">
          <Header electionDetails={election} />
          {/* <div>
            <MiniDashboard />
          </div> */}
          <div className="mt-[126px] max-w-[1200px] mx-auto">
            {position &&
              position.map((preview: any, index: any) => {
                const randomColor =
                  cols[Math.floor(Math.random() * cols.length)];
                return (
                  <div
                    key={index}
                    className="bg-slate-50 my-20 p-10"
                    style={{
                      ...(isClient && {
                        borderLeft: `4px solid ${randomColor}`,
                      }),
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
                      <div>{preview.name_of_position}</div>
                      <div>
                        <img
                          src={rightline.src}
                          alt="line"
                          className="w-14 lg:w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-16 justify-center">
                      {preview.candidates.map(
                        (candidate: any, candidateIndex: any) => {
                          const maxObject = preview.candidates.reduce(
                            (max: any, obj: any) =>
                              obj.votes > max.votes ? obj : max,
                            preview.candidates[0]
                          );
                          console.log(candidate.votes);

                          return (
                            <div
                              key={candidateIndex}
                              className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded cursor-pointer relative ${
                                candidate.votes === maxObject.votes
                                  ? ""
                                  : "duration-500"
                              }`}
                              onClick={() =>
                                handleSelectCandidate(
                                  preview.name_of_position,
                                  candidate
                                )
                              }
                            >
                              {/* {candidate.votes === maxObject.votes && (
                                <div className="absolute -right-2 -top-3 ">
                                  <img src={checked.src} alt="" />
                                </div>
                              )} */}

                              <div>
                                <div className="mb-3">
                                  <img
                                    src={candidate.candidate_picture}
                                    className="w-[269px] h-[269px] object-cover rounded"
                                    alt={`Image for ${candidate.candidate_name}`}
                                  />
                                </div>

                                <div className="capitalize">
                                  <div>{candidate.candidate_name}</div>
                                  <div className="text-base">
                                    ({candidate.candidate_nickname})
                                  </div>
                                </div>
                                <div className="text-base text-blue-700 underline cursor-pointer font-normal">
                                  More Details
                                </div>
                                {/* <div className="flex justify-center pt-3 gap-4 items-center">
                                  <div>
                                    <button
                                      className={`w-10 h-10  bg-blue-700 rounded flex items-center justify-center text-neutral-100 ${
                                        candidate.votes <= 0
                                          ? "cursor-not-allowed opacity-50"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleVote(index, candidateIndex, false)
                                      }
                                      disabled={candidate.votes <= 0}
                                    >
                                      <span className="text-xl">
                                        <AiOutlineMinus />
                                      </span>
                                    </button>
                                  </div>
                                  <div>{candidate.votes}</div>
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
                                </div> */}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                    <div>
                      {preview.allow_abstain && (
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
                          <CandidateDetails
                            details={selectedCandidateDetails}
                          />
                        </Modal>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewVote;
