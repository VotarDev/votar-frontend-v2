import React, { useEffect, useState, useRef } from "react";
import leftline from "../../../public/assets/images/left-line.svg";
import rightline from "../../../public/assets/images/right-line.svg";
import {
  BallotData,
  ElectionDetails,
  FreeVotarCandidate,
  FreeVoteDetail,
  SelectedCandidates,
} from "@/utils/types";
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
import {
  loadVotarCreditFromStorage,
  setVotarCredit,
} from "@/redux/features/votarCredit/votarCreditSlice";

import { toPng } from "html-to-image";
import { MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED } from "@/utils/constants";
import SuccessScreen from "@/src/components/FreeVotarBallotPage/SuccessScreen";
import PositionSection from "@/src/components/FreeVotarBallotPage/PositionSection";
import VoteConfirmationModal from "@/src/components/FreeVotarBallotPage/VoteConfimationModal";
import CandidateDetailsModal from "@/src/components/FreeVotarBallotPage/CandidateDetailsModal";

const FreeVotarBallot = () => {
  const dispatch = useDispatch<AppDispatch>();

  const voterProfile = useSelector((state: RootState) => state.voterProfile);
  const votarCredit = useSelector(
    (state: RootState) => state.votarCredit.credit
  );
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
  const [freeVoteDetails, setFreeVoteDetails] = useState<FreeVoteDetail[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedDetails, setSelecteDetails] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const now = new Date();
  const badgeRef = useRef(null);
  const formattedDate = now.toLocaleString("en-US", {
    timeZone: "Africa/Lagos",
  });

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
        date: formattedDate,
      };

      const { data } = await registerVoter(userData);

      if (data) {
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
    selectedCandidate: FreeVotarCandidate
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
        updatedState.push({
          position: positionName,
          candidates: [{ ...selectedCandidate, vote: 1 }],
          abstain: false,
        });
      } else {
        const existingPosition = updatedState[existingPositionIndex];
        const candidateExists = existingPosition?.candidates?.some(
          (c) => c.candidate_name === selectedCandidate.candidate_name
        );
        // const existingCandidates = existingPosition.candidates || [];

        if (candidateExists) {
          const updatedCandidates = existingPosition?.candidates?.filter(
            (c) => c.candidate_name !== selectedCandidate.candidate_name
          );

          if (updatedCandidates?.length === 0) {
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
              ...(existingPosition.candidates || []),
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
            date: formattedDate,
          };

          const { data } = await getBallotCandidate(electionData);

          if (data) {
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

            const freeVotes =
              freeVoteDetails.find(
                (detail) => detail.position === position.position
              )?.free_votes || 0;

            console.log(
              freeVotes === 0
                ? 0
                : free_votes > 0 && free_votes > freeVotes
                ? freeVotes
                : free_votes
            );

            return {
              free_votes:
                freeVotes === 0
                  ? 0
                  : free_votes > 0 && free_votes > freeVotes
                  ? freeVotes
                  : free_votes,
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
      !candidates ||
      !candidates[positionIndex] ||
      !candidates[positionIndex].candidates[candidateIndex]
    ) {
      return;
    }

    const updatedCandidates = [...candidates];
    const positionName = updatedCandidates[positionIndex].name_of_position;
    const candidate =
      updatedCandidates[positionIndex].candidates[candidateIndex];

    const totalVotes = updatedCandidates[positionIndex].candidates.reduce(
      (sum, c) => sum + c.vote,
      0
    );

    const positionFreeVotes =
      freeVoteDetails.find((detail) => detail.position === positionName)
        ?.free_votes || 0;

    const pricePerVote = Number(election?.price_per_vote ?? 0);

    const allowedPaidVotes =
      pricePerVote > 0 ? Math.floor(votarCredit / pricePerVote) : Infinity;

    const currentPaidVotesUsed = updatedCandidates.reduce((acc, pos) => {
      const posFree =
        freeVoteDetails.find((d) => d.position === pos.name_of_position)
          ?.free_votes || 0;
      const posTotal = pos.candidates.reduce((s, c) => s + c.vote, 0);
      return acc + Math.max(0, posTotal - posFree);
    }, 0);

    const willUsePaidVote =
      positionFreeVotes === 0 ? true : totalVotes >= positionFreeVotes;

    if (increment) {
      if (willUsePaidVote) {
        if (allowedPaidVotes === 0) {
          toast.error(
            `Each paid vote costs ${pricePerVote} votar credits. You don't have enough votar credits to add a paid vote.`
          );
          return;
        }

        if (currentPaidVotesUsed >= allowedPaidVotes) {
          const remainingPaid = allowedPaidVotes - currentPaidVotesUsed;
          toast.error(
            remainingPaid > 0
              ? `You can only add ${remainingPaid} more paid vote(s). Each vote costs ${pricePerVote} votar credits.`
              : `You don't have enough votar credits to add another vote. Each vote costs ${pricePerVote} votar credits.`
          );
          return;
        }

        candidate.vote += 1;
      } else {
        candidate.vote += 1;
      }
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
                  candidates: [...updatedCandidates[positionIndex].candidates],
                  abstain: false,
                }
              : item
          );
        } else {
          return [
            ...prevState,
            {
              position: positionName,
              candidates: [...updatedCandidates[positionIndex].candidates],
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

  const handleDetails = (details: string) => {
    setShowDetails(true);
    setSelecteDetails(details);
  };

  const downloadBadge = () => {
    if (badgeRef.current === null) return;

    toPng(badgeRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-votar-badge.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("oops, something went wrong!", err);
      });
  };

  // Early returns
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
                isVoteSuccessful={isVoteSuccessful}
              />
            </div>
          )}

          <div className="px-4 relative">
            <div className="">
              <div className="mt-5 flex justify-end mr-4 md:mr-10">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 md:px-8 md:py-4 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            {isFetchCandidate ? (
              <div className="mt-10 text-center">Fetching candidates...</div>
            ) : (
              <div>
                <div className="text-center mt-10">
                  <h1 className="text-4xl font-bold capitalize max-w-[550px] mx-auto">
                    {!isVoteSuccessful ? "Welcome," : "Congratulations,"}{" "}
                    {voterProfile.userData?.name
                      ? voterProfile.userData?.name
                      : session?.user?.name}
                  </h1>
                  {election && !isVoteSuccessful && (
                    <div className="flex justify-center">
                      <div className="mt-10  bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-6 py-4 mb-6 max-w-md w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            Price per Vote
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-700">
                              ₦{election?.price_per_vote}
                            </span>
                            <span className="text-sm text-gray-500">/vote</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {isVoteSuccessful ? (
                  <SuccessScreen
                    voterName={
                      voterProfile.userData?.name ||
                      session?.user?.name ||
                      "Voter"
                    }
                    badgeRef={badgeRef}
                    onDownloadBadge={downloadBadge}
                  />
                ) : (
                  <div>
                    {electionEnded ? (
                      <div className="text-center p-20 text-xl font-semibold">
                        {electionEnded}
                      </div>
                    ) : (
                      <div className="mt-[56px] max-w-[1200px] mx-auto">
                        {candidates &&
                          candidates.map((position, positionIndex) => (
                            <PositionSection
                              key={positionIndex}
                              position={position}
                              positionIndex={positionIndex}
                              candidates={candidates}
                              freeVoteDetails={freeVoteDetails}
                              abstentions={abstentions}
                              votarCredit={votarCredit}
                              election={election}
                              onSelectCandidate={handleSelectCandidate}
                              onVote={handleVote}
                              onAbstain={handleAbstain}
                              onDetails={handleDetails}
                            />
                          ))}

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

            <VoteConfirmationModal
              showModal={showModal}
              selectedCandidates={selectedCandidates}
              voterName={
                voterProfile.userData?.name || session?.user?.name || ""
              }
              isCastVote={isCastVote}
              onClose={closeModal}
              onConfirm={enterVotesHandler}
            />

            <CandidateDetailsModal
              showDetails={showDetails}
              selectedDetails={selectedDetails}
              onClose={() => setShowDetails(false)}
            />
          </div>
        </>
      )}
    </>
  );
};

export default FreeVotarBallot;
