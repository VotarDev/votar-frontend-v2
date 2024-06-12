import React, { useEffect, useState, useContext } from "react";
import leftline from "../../public/assets/images/left-line.svg";
import rightline from "../../public/assets/images/right-line.svg";
import { Details, ElectionDetails } from "@/utils/types";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import avatar from "../../public/assets/images/avatar-placeholder.png";
import checked from "../../public/assets/icons/checked.svg";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";
import { candidateVotes } from "@/utils/util";
import CandidateDetails from "@/src/components/VotePage/CandidateDetails";
import VoteHeader from "@/src/components/VotePage/Header";
import { RootState, AppDispatch } from "@/redux/store";
import FetchVoterProfile from "@/src/components/VotePage/FetchVoterProfile";
import Cookies from "universal-cookie";
import {
  logout,
  initializeFromLocalStorage,
} from "@/redux/features/auth/voterLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { voterLoginCookieName } from "@/src/__env";
import { getElectionById } from "@/utils/api";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";
import { set } from "lodash";

type Candidate = {
  name: string;
  nickname: string;
  vote: number;
  image: string;
};
type Position = {
  position: string;
  candidate: Candidate[];
};

type SelectedCandidates = {
  position: string;
  candidate: Candidate[];
};

const Ballot = () => {
  const [votingData, setVotingData] = useState<Position[]>(candidateVotes);
  const dispatch = useDispatch<AppDispatch>();
  const voterProfile = useSelector((state: RootState) => state.voterProfile);
  const router = useRouter();
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<
    SelectedCandidates[]
  >([]);
  const [selecredCandidateName, setSelectedCandidateName] = useState<string[]>(
    []
  );
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  //   const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<
  //     Details[]
  //   >([]);
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
    if (candidateVotes && candidateVotes[positionIndex]) {
      const updatedData = [...candidateVotes];
      const candidate = updatedData[positionIndex].candidate[candidateIndex];
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

  const handleSelectCandidate = (position: string, candidate: Candidate) => {
    const existingIndex = selectedCandidates.findIndex(
      (sc) => sc.position === position
    );
    if (existingIndex !== -1) {
      setSelectedCandidates((prevState) => {
        const updatedSelectedCandidates = [...prevState];
        const candidateExists = updatedSelectedCandidates[
          existingIndex
        ].candidate.some((c) => c.name === candidate.name);
        if (!candidateExists) {
          updatedSelectedCandidates[existingIndex] = {
            position,
            candidate: [
              ...updatedSelectedCandidates[existingIndex].candidate,
              candidate,
            ],
          };
        }
        return updatedSelectedCandidates;
      });
    } else {
      setSelectedCandidates((prevState) => [
        ...prevState,
        { position, candidate: [candidate] },
      ]);
    }

    // if (selectedCandidates.includes(candidate) && candidate.vote <= 0) {
    //   setSelectedCandidates((prevCandidates) =>
    //     prevCandidates.filter((c) => c !== candidate)
    //   );
    // } else {
    //   setSelectedCandidates((prevCandidate) => [...prevCandidate, candidate]);
    // }
  };

  const closeModal = () => setShowModal(false);
  const handleLogout = () => {
    dispatch(logout());
    const cookie = new Cookies();
    cookie.remove(voterLoginCookieName, { path: "/" });
    router.push("/vote");
  };
  //   const handleDetails = (candidate: Candidate) => {
  //     setSelectedCandidateDetails([
  //       //@ts-ignore
  //       { dets: candidate.details, media: candidate.media },
  //     ]);
  //     setShowModal(true);
  //   };
  useEffect(() => {
    const storedProfile = localStorage.getItem("voterProfile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      dispatch(initializeFromLocalStorage(parsedProfile));
    }
  }, [dispatch]);

  useEffect(() => {
    const getElection = async () => {
      setIsFetchElection(true);
      try {
        if (voterProfile.userData && voterProfile.userData.election_id) {
          const electionData = {
            election_id: voterProfile.userData.election_id,
          };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            console.log(data.data);
            setIsFetchElection(false);
          }
        }
      } catch (error: any) {
        console.log(error);
        setIsFetchElection(false);
      }
    };
    if (voterProfile.userData) {
      getElection();
    }
  }, [voterProfile.userData]);
  // console.log(selectedCandidates);
  console.log(voterProfile.userData?.election_id);

  return (
    <>
      {isClient && (
        <>
          <FetchVoterProfile />
          {isFetchElection ? (
            <div className="mt-10 text-center">
              <CircularProgress size={30} style={{ color: "#015CE9" }} />
            </div>
          ) : (
            <div>
              <Header electionDetails={election} />
            </div>
          )}

          <div className="mt-5 flex justify-end mr-10">
            <button
              onClick={handleLogout}
              className="bg-blue-700 p-4 text-white rounded-md"
            >
              Logout
            </button>
          </div>
          <div className="mt-[56px] max-w-[1200px] mx-auto">
            {candidateVotes &&
              candidateVotes.map((preview, index) => {
                const randomColor =
                  cols[Math.floor(Math.random() * cols.length)];
                return (
                  <div
                    key={index}
                    className="bg-slate-50 mt-20 mb-14 p-10"
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
                      <div>{preview.position}</div>
                      <div>
                        <img
                          src={rightline.src}
                          alt="line"
                          className="w-14 lg:w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-16">
                      {preview.candidate.map((candidate, candidateIndex) => (
                        <div
                          key={candidateIndex}
                          className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded cursor-pointer relative ${
                            candidate.vote > 0 ? "active" : "duration-500"
                          }`}
                          onClick={(e) =>
                            handleSelectCandidate(preview.position, candidate)
                          }
                        >
                          {candidate.vote > 0 && (
                            <div className="absolute -right-2 -top-3 ">
                              <img src={checked.src} alt="" />
                            </div>
                          )}

                          <div>
                            <div className="mb-3">
                              <img
                                src={candidate.image}
                                className="w-[269px] h-[269px] object-cover rounded"
                                alt={`Image for ${candidate.name}`}
                              />
                            </div>

                            <div className="capitalize">
                              <div>{candidate.name}</div>
                              <div className="text-base">
                                ({candidate.nickname})
                              </div>
                            </div>
                            <div className="text-base text-blue-700 underline cursor-pointer font-normal">
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
                    {/* <div>
                    {preview.allowAbstain && (
                      <div className="flex justify-center items-center">
                        <button className="w-32 h-14 bg-blue-700 rounded-lg text-zinc-100 font-bold text-xl mb-10 uppercase">
                          Abstain
                        </button>
                      </div>
                    )}
                  </div> */}
                  </div>
                );
              })}
            <div className="flex justify-center mb-10">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-700 text-slate-100 outline-none border-none w-40 h-12 flex justify-center items-center rounded-md uppercase font-semibold"
              >
                Cast Vote
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showModal && (
              <Modal key="modal" handleClose={closeModal} classname="">
                <div className="bg-white rounded ">
                  <div className="text-center pt-8 pb-5 max-w-[40rem] mx-auto">
                    Hello Mike!, the candidates you voted for in the different
                    positions are hightlighted below. Kindly, look through to
                    confirm they are your final choices. if they are, click on
                    the <span>&apos;Confirm Votes&apos;</span> to submit your
                    votes. If you would like to change your candidates selection
                    in any position, click on <span>&apos;Go back&apos;</span>{" "}
                    to go to your secret ballot page and reselect your prefered
                    candidate.
                  </div>
                  <div>
                    {selectedCandidates.map((selectedCandidate, index) => (
                      <div key={index}>
                        <div className="text-center text-slate-900 lg:text-xl text-base font-semibold flex items-center justify-center gap-2 uppercase">
                          <div>
                            <img
                              src={leftline.src}
                              alt="line"
                              className="w-40"
                            />
                          </div>
                          <div>{selectedCandidate.position}</div>
                          <div>
                            <img
                              src={rightline.src}
                              alt="line"
                              className="w-40"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center gap-3">
                          {selectedCandidate.candidate.map(
                            (candidate, index) => (
                              <div key={index} className=" pb-3">
                                <div className="flex justify-center py-2">
                                  <img
                                    src={candidate.image}
                                    alt="candidate"
                                    className="w-20 h-20 object-cover rounded-full"
                                  />
                                </div>
                                <div className="font-semibold">
                                  {candidate.name}
                                </div>
                                <div>({candidate.nickname})</div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center p-5 items-center gap-5">
                      <div>
                        <button
                          onClick={closeModal}
                          className="flex justify-center items-center outline-none border border-blue-700 text-blue-700 font-semibold capitalize w-40 h-12 rounded-lg"
                        >
                          Go back
                        </button>
                      </div>
                      <div>
                        <button className="flex justify-center items-center outline-none border-none bg-blue-700 text-slate-100 font-semibold capitalize w-40 h-12 rounded-lg">
                          Confirm Votes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

export default Ballot;
