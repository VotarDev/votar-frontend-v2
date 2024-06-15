import React, { useEffect, useState, useContext, use } from "react";
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
import { PiWarningCircleFill } from "react-icons/pi";
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
import { getElectionById, getBallotCandidate } from "@/utils/api";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";
import { getCandidates } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";

type BallotData = {
  allow_abstain: boolean;
  author_id: string;
  candidates: Candidate[];
  name_of_position: string;
  show_pictures: boolean;
  _id: string;
  __v: number;
};
type Candidate = {
  candidate_name: string;
  candidate_nickname: string;
  candidate_picture: string;
  media: string;
  votes: number;
  _id: string;
};

type SelectedCandidates = {
  position: string;
  candidates: Candidate[];
};

const Ballot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const voterProfile = useSelector((state: RootState) => state.voterProfile);
  const router = useRouter();
  const [candidates, setCandidates] = useState<BallotData[]>([]);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [electionEnded, setElectionEnded] = useState(null);
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<
    SelectedCandidates[]
  >([]);
  const [selecredCandidateName, setSelectedCandidateName] = useState<string[]>(
    []
  );
  const [isClient, setIsClient] = useState(false);
  const users = useCurrentUser();
  const user = useUser();
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

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED = 2;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // const handleVote = (
  //   positionIndex: number,
  //   candidateIndex: number,
  //   increment: boolean
  // ) => {
  //   if (candidateVotes && candidateVotes[positionIndex]) {
  //     const updatedData = [...candidateVotes];
  //     const candidate = updatedData[positionIndex].candidate[candidateIndex];
  //     if (candidate) {
  //       if (increment) {
  //         candidate.vote++;
  //       } else {
  //         candidate.vote--;
  //       }
  //     }
  //     setVotingData(updatedData);
  //   }
  // };

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

  useEffect(() => {
    const getCandidatesData = async () => {
      setIsFetchCandidate(true);
      try {
        if (voterProfile.userData && voterProfile.userData.election_id) {
          const electionData = {
            election_id: voterProfile.userData.election_id,
          };

          const { data } = await getBallotCandidate(electionData);
          console.log(data);
          if (data) {
            setCandidates(data.data);
            setIsFetchCandidate(false);
          }
        }
      } catch (error: any) {
        setElectionEnded(error?.response?.data?.message);
        setIsFetchCandidate(false);
        console.log(error);
      }
    };
    if (voterProfile.userData) {
      getCandidatesData();
    }
  }, [voterProfile.userData]);

  const combinedData = candidates.reduce((acc: any, curr: any) => {
    const existingPosition = acc.find(
      (item: any) => item.name_of_position === curr.name_of_position
    );

    if (existingPosition) {
      existingPosition.candidates.push(...curr.candidates);
    } else {
      acc.push({
        allow_abstain: curr.allow_abstain,
        author_id: curr.author_id,
        candidates: [...curr.candidates],
        name_of_position: curr.name_of_position,
        show_pictures: curr.show_pictures,
        _id: curr._id,
        __v: curr.__v,
      });
    }

    return acc;
  }, []);
  console.log(selectedCandidates);
  console.log(combinedData);
  // console.log(voterProfile.userData);

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

          <div>
            <div className="mt-5 flex justify-end mr-10">
              <button
                onClick={handleLogout}
                className="bg-blue-700 p-4 text-white rounded-md"
              >
                Logout
              </button>
            </div>
            {isFetchCandidate ? (
              <div className="mt-10 text-center">Fetching candidates...</div>
            ) : (
              <div>
                <div className="text-center mt-5">
                  <h1 className="text-xl font-bold  capitalize">
                    Welcome, {voterProfile.userData?.name}
                  </h1>
                </div>

                {electionEnded ? (
                  <div className="text-center p-20 text-xl font-semibold">
                    {electionEnded}
                  </div>
                ) : (
                  <div className="mt-[56px] max-w-[1200px] mx-auto">
                    {combinedData &&
                      combinedData.map((preview: any, index: any) => {
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
                              <div>{preview.name_of_position}</div>
                              <div>
                                <img
                                  src={rightline.src}
                                  alt="line"
                                  className="w-14 lg:w-full"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-16">
                              {preview.candidates.map(
                                (candidate: any, candidateIndex: any) => (
                                  <div
                                    key={candidateIndex}
                                    className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded cursor-pointer relative ${
                                      isCandidateActive(
                                        preview.name_of_position,
                                        candidate
                                      )
                                        ? "active"
                                        : "duration-500"
                                    }`}
                                    onClick={() =>
                                      handleSelectCandidate(
                                        preview.name_of_position,
                                        candidate
                                      )
                                    }
                                  >
                                    {isCandidateActive(
                                      preview.name_of_position,
                                      candidate
                                    ) && (
                                      <div className="absolute -right-2 -top-3 ">
                                        <img src={checked.src} alt="" />
                                      </div>
                                    )}

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
                            </div> */}
                                    </div>
                                  </div>
                                )
                              )}
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
                        Enter Vote
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence mode="wait">
              {showModal && (
                <Modal
                  key="modal"
                  handleClose={closeModal}
                  classname="overflow-y-scroll h-[80vh] ballot-modal bg-white"
                >
                  <div className="rounded h-full">
                    <div className="text-center py-8 pb-5 max-w-[40rem] mx-auto">
                      Hello{" "}
                      <span className="capitalize">
                        {voterProfile.userData.name}
                      </span>
                      , the candidates you voted for in the different positions
                      are hightlighted below. Kindly, look through to confirm
                      they are your final choices. if they are, click on the{" "}
                      <span>&apos;Confirm Votes&apos;</span> to submit your
                      votes. If you would like to change your candidates
                      selection in any position, click on{" "}
                      <span>&apos;Go back&apos;</span> to go to your secret
                      ballot page and reselect your prefered candidate.
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
                            {selectedCandidate.candidates.map(
                              (candidate: any, index: any) => (
                                <div key={index} className=" pb-3">
                                  <div className="flex justify-center py-2">
                                    <img
                                      src={candidate.candidate_picture}
                                      alt="candidate"
                                      className="w-20 h-20 object-cover rounded-full"
                                    />
                                  </div>
                                  <div className="font-semibold">
                                    {candidate.candidate_name}
                                  </div>
                                  <div>({candidate.candidate_nickname})</div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="flex bg-[#FFBC11] bg-opacity-20 text-center p-4 items-center justify-center my-5">
                        <div className="text-[#ECAE0D] text-xl">
                          <PiWarningCircleFill />
                        </div>
                        <div className="text-[#826008]">
                          Please ensure that you have selected your preffered
                          candidate in each position as votes cannot be
                          submitted again after the first Submission
                        </div>
                      </div>
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
          </div>
        </>
      )}
    </>
  );
};

export default Ballot;
