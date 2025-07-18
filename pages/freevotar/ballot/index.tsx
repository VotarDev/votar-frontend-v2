import React, { useEffect, useState, useContext } from "react";
import leftline from "../../../public/assets/images/left-line.svg";
import rightline from "../../../public/assets/images/right-line.svg";
import { ElectionDetails } from "@/utils/types";
import checked from "../../../public/assets/icons/checked.svg";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";

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
import {
  getElectionById,
  getBallotCandidate,
  registerVoter,
  enterFreeVotes,
} from "@/utils/api";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";

import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";
import { GoogleSignInButton } from "@/src/components/authButton/authButtons";
import { useSession, signOut } from "next-auth/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {
  loadVotarCreditFromStorage,
  setVotarCredit,
} from "@/redux/features/votarCredit/votarCreditSlice";

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
  vote: number;
  _id: string;
};

type SelectedCandidates = {
  position: string;
  candidates?: Candidate[];
  abstain?: boolean;
};

const MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED = 2;

const FreeVotarBallot = () => {
  const dispatch = useDispatch<AppDispatch>();

  const voterProfile = useSelector((state: RootState) => state.voterProfile);
  const votarCredit = useSelector(
    (state: RootState) => state.votarCredit.credit
  ); // Access votar_credit
  const router = useRouter();

  const [candidates, setCandidates] = useState<BallotData[]>([]);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [electionEnded, setElectionEnded] = useState(null);
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [isFetchCandidate, setIsFetchCandidate] = useState(false);
  const [isCastVote, setIsCastVote] = useState(false);
  const [isVoteSuccessful, setIsVoteSuccessful] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<
    SelectedCandidates[]
  >([]);
  const [abstentions, setAbstentions] = useState({} as any);
  const [allPositionsSelected, setAllPositionsSelected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [freeVoteDetails, setFreeVoteDetails] = useState<
    { position: string; free_votes: number; _id: string }[]
  >([]);

  const { data: session, status } = useSession();

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

  useEffect(() => {
    if (router.isReady && router.query.candidate) {
      const id = Array.isArray(router.query.candidate)
        ? router.query.candidate[0]
        : router.query.candidate;
      setCandidateId(id);
    }
  }, [router.isReady, router.query.candidate]);

  const registerVotar = async () => {
    if (!candidateId || !session?.user?.email) return;

    const cookie = new Cookies();

    try {
      const userData = {
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
        election_id: candidateId,
      };

      const { data } = await registerVoter(userData);

      if (data) {
        console.log(data);
        cookie.set(voterLoginCookieName, data.data.token, { path: "/" });
        cookie.set("votar-credits", data.data.votar_credit, { path: "/" });
        dispatch(setVotarCredit(data.data.votar_credit));
        setFreeVoteDetails(data.data.freeVoteDetails);
      }
    } catch (error) {
      console.error("Error registering voter:", error);
    }
  };

  useEffect(() => {
    registerVotar();
  }, [
    session,
    status,
    candidateId,
    voterProfile.userData?.email,
    voterProfile.userData?.name,
    voterProfile.userData?.image,
  ]);

  useEffect(() => {
    dispatch(loadVotarCreditFromStorage());
  }, [dispatch]);

  const handleGoHome = () => {
    router.push("/vote");
  };

  const handleSelectCandidate = (
    positionName: string,
    selectedCandidate: Candidate
  ) => {
    if (abstentions[positionName]?.abstained) {
      toast.error(
        `You have abstained from voting for ${positionName}. Please remove abstention first.`
      );
      return;
    }

    const positionData = candidates.find(
      (pos) => pos.name_of_position === positionName
    );

    if (!positionData) return;

    const selectedCount = positionData.candidates.filter(
      (c) => c.vote > 0
    ).length;

    const isAlreadySelected = selectedCandidate.vote > 0;

    if (
      !isAlreadySelected &&
      selectedCount >= MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED
    ) {
      toast.error(
        `You can only select up to ${MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED} candidates for ${positionName}`
      );
      return;
    }

    setCandidates((prevData) =>
      prevData.map((position) =>
        position.name_of_position === positionName
          ? {
              ...position,
              candidates: position.candidates.map((candidate) =>
                candidate.candidate_name === selectedCandidate.candidate_name
                  ? { ...candidate, vote: candidate.vote > 0 ? 0 : 1 }
                  : candidate
              ),
            }
          : position
      )
    );

    setAbstentions((prevState: any) => ({
      ...prevState,
      [positionName]: { abstained: false },
    }));

    setSelectedCandidates((prevState) => {
      const existingPositionIndex = prevState.findIndex(
        (sc) => sc.position === positionName
      );

      const updatedState = [...prevState];

      if (existingPositionIndex === -1) {
        if (!isAlreadySelected) {
          updatedState.push({
            position: positionName,
            candidates: [{ ...selectedCandidate, vote: 1 }],
            abstain: false,
          });
        }
      } else {
        const existingPosition = updatedState[existingPositionIndex];
        const existingCandidates = existingPosition.candidates || [];

        if (isAlreadySelected) {
          const updatedCandidates = existingCandidates.filter(
            (c) => c.candidate_name !== selectedCandidate.candidate_name
          );

          if (updatedCandidates.length === 0) {
            updatedState.splice(existingPositionIndex, 1);
          } else {
            updatedState[existingPositionIndex] = {
              ...existingPosition,
              candidates: updatedCandidates,
            };
          }
        } else {
          updatedState[existingPositionIndex] = {
            ...existingPosition,
            candidates: [
              ...existingCandidates,
              { ...selectedCandidate, vote: 1 },
            ],
          };
        }
      }

      return updatedState;
    });
  };

  const closeModal = () => setShowModal(false);

  const handleLogout = async () => {
    dispatch(logout());
    const cookie = new Cookies();
    cookie.remove(voterLoginCookieName, { path: "/" });

    localStorage.removeItem("voterProfile");
    if (session && status === "authenticated") {
      await signOut();
    }
    setAuthToken(null);
    router.push("/vote");
  };

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
        const electionData = {
          election_id: candidateId,
        };
        const { data } = await getElectionById(electionData);

        if (data) {
          setElection(data.data);
          setIsFetchElection(false);
        }
      } catch (error: any) {
        console.log(error);
        setIsFetchElection(false);
      }
    };

    getElection();
  }, [candidateId]);

  useEffect(() => {
    const getCandidatesData = async () => {
      setIsFetchCandidate(true);
      const cookie = new Cookies();
      const token = cookie.get(voterLoginCookieName);

      if (token) {
        setAuthToken(token);
      }
      if (candidateId) {
        try {
          const electionData = {
            election_id: candidateId,
          };

          const { data } = await getBallotCandidate(electionData);

          if (data) {
            console.log(data);
            const updatedCandidates = data.data.map((position: any) => ({
              ...position,
              candidates: position.candidates.map((candidate: any) => ({
                ...candidate,
                vote: 0,
              })),
            }));

            setCandidates(updatedCandidates);
          }
        } catch (error: any) {
          setElectionEnded(error?.response?.data?.message);
          console.error("Error fetching candidates:", error);
        } finally {
          setIsFetchCandidate(false);
        }
      }
    };
    getCandidatesData();
  }, [candidateId]);

  const enterVotesHandler = async () => {
    setIsCastVote(true);
    const cookie = new Cookies();
    const token = cookie.get(voterLoginCookieName);
    if (token) {
      setAuthToken(token);
    }

    try {
      if (
        candidateId &&
        session?.user?.email &&
        selectedCandidates.length > 0
      ) {
        const electionData = {
          email: session?.user?.email,
          election_id: candidateId,
          voting_details: selectedCandidates.map((position) => {
            const candidate_details = (position.candidates ?? []).map(
              (candidate) => ({
                candidate_name: candidate.candidate_name,
                vote: candidate.vote,
              })
            );

            const free_votes = candidate_details.reduce(
              (sum, candidate) => sum + candidate.vote,
              0
            );

            return {
              free_votes,
              position: position.position,
              candidate_details,
            };
          }),
        };

        const { data } = await enterFreeVotes(electionData);
        if (data) {
          setIsCastVote(false);
          setIsVoteSuccessful(true);
          registerVotar();
          closeModal();
        }
      }
    } catch (e: any) {
      setIsCastVote(false);
      toast.error(e?.response?.data?.message);
      closeModal();
    }
  };

  const handleAbstain = (position: string) => {
    const positionData = candidates.find(
      (p) => p.name_of_position === position
    );
    const isCandidateSelected = positionData?.candidates.some(
      (c) => c.vote > 0
    );

    if (isCandidateSelected) {
      toast.error(
        `You cannot abstain after selecting a candidate for ${position}`
      );
      return;
    }

    if (abstentions[position]?.abstained) {
      setAbstentions((prevState: any) => {
        const newState = { ...prevState };
        delete newState[position];
        return newState;
      });

      setSelectedCandidates((prevState) => {
        return prevState.filter((sc) => sc.position !== position);
      });

      toast.success(`Abstention removed for position: ${position}`);
    } else {
      setCandidates((prevData) =>
        prevData.map((pos) =>
          pos.name_of_position === position
            ? {
                ...pos,
                candidates: pos.candidates.map((candidate) => ({
                  ...candidate,
                  vote: 0,
                })),
              }
            : pos
        )
      );

      setSelectedCandidates((prevState) => {
        const updatedState = prevState.filter((sc) => sc.position !== position);

        return [...updatedState, { position, abstain: true }];
      });

      setAbstentions((prevState: any) => ({
        ...prevState,
        [position]: { abstained: true },
      }));

      toast.success(
        `You have abstained from voting for the position: ${position}`
      );
    }
  };

  const handleVote = (
    positionIndex: number,
    candidateIndex: number,
    increment: boolean
  ) => {
    if (
      candidates &&
      candidates[positionIndex] &&
      candidates[positionIndex].candidates[candidateIndex]
    ) {
      const updatedCandidates = [...candidates];
      const positionName = updatedCandidates[positionIndex].name_of_position;
      const candidate =
        updatedCandidates[positionIndex].candidates[candidateIndex];

      // Calculate total votes for the position
      const totalVotes = updatedCandidates[positionIndex].candidates.reduce(
        (sum, c) => sum + c.vote,
        0
      );

      // Get free_votes for the position
      const freeVotes =
        freeVoteDetails.find((detail) => detail.position === positionName)
          ?.free_votes || 0;

      if (increment) {
        // if (freeVotes > 0 && totalVotes >= freeVotes) {
        //   toast.error(
        //     `Cannot add more votes for ${positionName}. You have reached the limit of ${freeVotes} free votes.`
        //   );
        //   return;
        // }

        // if (freeVotes === 0 && votarCredit <= 0) {
        //   toast.error(
        //     `Cannot add more votes for ${positionName}. You have no votar credits available.`
        //   );
        //   return;
        // }
        candidate.vote += 1;
      } else if (candidate.vote > 0) {
        candidate.vote -= 1;
      }

      setCandidates(updatedCandidates);

      if (candidate.vote === 0) {
        setSelectedCandidates((prevState) =>
          prevState.filter((item) => item.position !== positionName)
        );
      } else {
        setSelectedCandidates((prevState) => {
          const positionExists = prevState.find(
            (item) => item.position === positionName
          );

          if (positionExists) {
            return prevState.map((item) =>
              item.position === positionName
                ? {
                    position: positionName,
                    candidates: [...candidates[positionIndex].candidates],
                    abstain: false,
                  }
                : item
            );
          } else {
            return [
              ...prevState,
              {
                position: positionName,
                candidates: [...candidates[positionIndex].candidates],
                abstain: false,
              },
            ];
          }
        });

        setAbstentions((prevState: any) => ({
          ...prevState,
          [positionName]: { abstained: false },
        }));
      }
    }
  };

  useEffect(() => {
    if (candidates.length > 0) {
      const allPositions = candidates.map((item) => item.name_of_position);
      const selectedOrAbstainedPositions = selectedCandidates.map(
        (item) => item.position
      );

      const isAllPositionsSelected = allPositions.every((position) =>
        selectedOrAbstainedPositions.includes(position)
      );

      setAllPositionsSelected(isAllPositionsSelected);
    }
  }, [selectedCandidates, candidates]);

  if (election?.type === "Free Votar" && status !== "authenticated") {
    return (
      <AnimatePresence mode="wait">
        <Modal key="modal">
          <div className="w-full h-full bg-white flex items-center px-6 rounded-lg justify-center">
            <GoogleSignInButton />
          </div>
        </Modal>
      </AnimatePresence>
    );
  }

  if (election?.published === false) {
    return (
      <>
        <div>
          <Header electionDetails={election} getVoterCredit={registerVotar} />
        </div>
        <div className="mt-5 flex justify-end mr-10">
          <button
            onClick={handleLogout}
            className="bg-blue-700 p-4 text-white rounded-md"
          >
            Logout
          </button>
        </div>
        <div className="text-center mt-5">
          <h1 className="text-4xl font-bold capitalize">
            Welcome, {voterProfile.userData?.name}
          </h1>
        </div>
        <div className="text-center pt-5">
          You do not have Access to this election
        </div>
      </>
    );
  }

  return (
    <>
      {isClient && (
        <>
          {election?.type === "Votar Pro" && <FetchVoterProfile />}

          {isFetchElection ? (
            <div className="mt-10 text-center">
              <CircularProgress size={30} style={{ color: "#015CE9" }} />
            </div>
          ) : (
            <div>
              <Header
                electionDetails={election}
                getVoterCredit={registerVotar}
              />
            </div>
          )}

          <div className="px-4">
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
                <div className="text-center mt-10">
                  <h1 className="text-4xl font-bold capitalize">
                    Welcome,{" "}
                    {voterProfile.userData?.name
                      ? voterProfile.userData?.name
                      : session?.user?.name}
                  </h1>
                </div>
                {isVoteSuccessful ? (
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <h1 className="text-4xl font-bold text-green-600 mb-4">
                      Success!
                    </h1>
                    <p className="text-xl mb-6">
                      Your vote has been successfully submitted.
                    </p>
                    <p className="text-lg mb-6">
                      Thank you for participating in the election.
                    </p>
                    <button
                      onClick={handleGoHome}
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Go to Home
                    </button>
                  </div>
                ) : (
                  <div>
                    {electionEnded ? (
                      <div className="text-center p-20 text-xl font-semibold">
                        {electionEnded}
                      </div>
                    ) : (
                      <div className="mt-[56px] max-w-[1200px] mx-auto">
                        {candidates &&
                          candidates.map((position, positionIndex) => {
                            const randomColor =
                              cols[Math.floor(Math.random() * cols.length)];
                            // Find the free_votes for the current position
                            const positionFreeVotes =
                              freeVoteDetails.find(
                                (detail) =>
                                  detail.position === position.name_of_position
                              )?.free_votes || 0;

                            // Calculate total votes for the position
                            const totalVotes = position.candidates.reduce(
                              (sum, c) => sum + c.vote,
                              0
                            );

                            return (
                              <div
                                key={positionIndex}
                                className="bg-slate-50 mt-0 mb-14 p-10"
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
                                  <div>{position.name_of_position}</div>
                                  <div>
                                    <img
                                      src={rightline.src}
                                      alt="line"
                                      className="w-14 lg:w-full"
                                    />
                                  </div>
                                </div>
                                <div className="mt-7 flex flex-col items-center">
                                  <h1 className="text-lg font-semibold">
                                    Free Votes
                                  </h1>
                                  <div className="flex">
                                    <div className="flex gap-2">
                                      {positionFreeVotes
                                        .toString()
                                        .split("")
                                        .map((digit, i) => (
                                          <div
                                            key={i}
                                            className="w-10 h-10 flex justify-center items-center bg-blue-700 text-zinc-100 rounded font-bold mr-2"
                                          >
                                            {digit}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-center flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-10">
                                  {position.candidates.map(
                                    (candidate, candidateIndex) => {
                                      const isSelected = candidate.vote > 0;
                                      const isAbstained =
                                        abstentions[position.name_of_position]
                                          ?.abstained;
                                      // Disable increment button if:
                                      // - free_votes > 0 and totalVotes >= free_votes
                                      // - free_votes === 0 and votarCredit <= 0
                                      const isIncrementDisabled =
                                        (positionFreeVotes > 0 &&
                                          totalVotes >= positionFreeVotes) ||
                                        (positionFreeVotes === 0 &&
                                          votarCredit <= 0) ||
                                        isAbstained;

                                      return (
                                        <div
                                          key={candidateIndex}
                                          className={`lg:w-[calc(25%-40px)] w-[18.5rem] mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-xl font-semibold p-3 rounded cursor-pointer relative ${
                                            isSelected
                                              ? "active"
                                              : "duration-500"
                                          }`}
                                        >
                                          {isSelected && (
                                            <div className="absolute -right-2 -top-3 ">
                                              <img src={checked.src} alt="" />
                                            </div>
                                          )}

                                          <div>
                                            <div className="mb-3">
                                              <img
                                                onClick={() =>
                                                  handleSelectCandidate(
                                                    position.name_of_position,
                                                    candidate
                                                  )
                                                }
                                                src={
                                                  candidate.candidate_picture
                                                }
                                                className="w-[269px] h-[269px] object-cover rounded"
                                                alt={`Image for ${candidate.candidate_name}`}
                                              />
                                            </div>

                                            <div className="capitalize">
                                              <div>
                                                {candidate.candidate_name}
                                              </div>
                                              <div className="text-base">
                                                ({candidate.candidate_nickname})
                                              </div>
                                            </div>
                                            <div className="text-base text-blue-700 underline cursor-pointer font-normal">
                                              More Details
                                            </div>
                                            <div className="flex justify-center pt-3 gap-4 items-center">
                                              <div>
                                                <button
                                                  className={`w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-neutral-100 ${
                                                    candidate.vote <= 0 ||
                                                    isAbstained
                                                      ? "cursor-not-allowed opacity-50"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleVote(
                                                      positionIndex,
                                                      candidateIndex,
                                                      false
                                                    )
                                                  }
                                                >
                                                  <span className="text-xl">
                                                    <AiOutlineMinus />
                                                  </span>
                                                </button>
                                              </div>
                                              <div>{candidate.vote ?? 0}</div>
                                              <div>
                                                <button
                                                  className={`w-10 h-10 bg-blue-700 rounded flex items-center justify-center text-neutral-100 `}
                                                  onClick={() =>
                                                    handleVote(
                                                      positionIndex,
                                                      candidateIndex,
                                                      true
                                                    )
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
                                      );
                                    }
                                  )}
                                </div>
                                <div className="flex justify-center items-center">
                                  <button
                                    onClick={() =>
                                      handleAbstain(position.name_of_position)
                                    }
                                    disabled={
                                      abstentions[position.name_of_position]
                                        ?.abstained
                                    }
                                    className={`w-32 h-14 bg-blue-700 rounded-lg text-zinc-100 font-bold text-xl uppercase ${
                                      abstentions[position.name_of_position]
                                        ?.abstained
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                  >
                                    Abstain
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                        <div className="flex bg-[#FFBC11] bg-opacity-20 text-left p-4 justify-center my-10 max-w-[700px] w-full mx-auto gap-2">
                          <div className="text-[#ECAE0D] text-xl">
                            <PiWarningCircleFill />
                          </div>
                          <div className="text-[#826008]">
                            To cast your vote using the "Enter Votes" button
                            below, please make sure to select your preferred
                            candidate for each position in the election. If you
                            choose not to vote for a particular position, you
                            may select "Abstain" (if this option is available in
                            your election).
                          </div>
                        </div>
                        <div className="flex justify-center mb-10">
                          <button
                            onClick={() => setShowModal(true)}
                            disabled={!allPositionsSelected}
                            className={`bg-blue-700 text-slate-100 outline-none border-none w-40 h-12 flex justify-center items-center rounded-md uppercase font-semibold ${
                              !allPositionsSelected
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Enter Votes
                          </button>
                        </div>
                      </div>
                    )}
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
                    <div className="text-center py-8 pb-5 max-w-[40rem] mx-auto ">
                      Hello{" "}
                      <span className="capitalize font-semibold">
                        {voterProfile.userData?.name || session?.user?.name}
                      </span>
                      , the candidates you voted for in the different positions
                      are highlighted below. Kindly, look through to confirm
                      they are your final choices. If they are, click on the{" "}
                      <span className="font-semibold">Confirm Votes</span> to
                      submit your votes. If you would like to change your
                      candidates selection in any position, click on{" "}
                      <span className="font-semibold">Go back</span> to go to
                      your secret ballot page and reselect your preferred
                      candidate.
                    </div>
                    <div>
                      {selectedCandidates.map((selectedCandidate, index) => (
                        <div key={index} className="mb-8">
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
                          Please ensure that you have selected your preferred
                          candidate in each position as votes cannot be
                          submitted again after the first submission
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
                          <button
                            onClick={enterVotesHandler}
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
          </div>
        </>
      )}
    </>
  );
};

export default FreeVotarBallot;
