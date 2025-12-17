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
import { Check, MessageSquare, UserPlus } from "lucide-react";

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
  more_details?: string;
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
  const [freeVoteDetails, setFreeVoteDetails] = useState<
    { position: string; free_votes: number; _id: string }[]
  >([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedDetails, setSelecteDetails] = useState<string | null>(null);

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
    console.log(token);
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
                  <div className="relative w-full bg-white p-8">
                    {/* CENTERED SUCCESS MESSAGE */}
                    <div className="md:absolute md:top-10 md:left-1/2 md:-translate-x-1/2 ">
                      <div className="bg-white md:p-8 rounded-lg text-center md:max-w-xl mx-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 transform hover:scale-110 transition-transform duration-300">
                          <Check
                            className="w-14 h-14 text-white"
                            strokeWidth={3}
                          />
                        </div>
                        <h1 className="text-4xl font-bold text-green-600 mb-4">
                          Success!
                        </h1>
                        <p className="text-xl mb-1">
                          Your vote has been successfully submitted.
                        </p>
                        <p className="text-lg mb-6">
                          Thank you for participating in the election.
                        </p>
                      </div>
                      {/* Go Home Button */}
                      <div className="text-center mb-10">
                        <button
                          onClick={handleGoHome}
                          className="px-12 py-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Go to Home
                        </button>
                      </div>
                    </div>

                    <div className=" bg-white rounded-2xl p-8 md:p-12 mb-8 md:absolute left-0">
                      {/* Feedback Section */}
                      <div className="mb-10 ">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                          We love to hear from our users
                        </h2>
                        <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Click to give us your feedback
                        </button>
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="vibrate bg-gradient-to-r md:absolute right-0 from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white mb-8 mt-10 transform transition-transform duration-300 ease-out hover:scale-105">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                          Know more about us &
                        </h3>
                        <p className="text-lg mb-6">
                          follow us on all our social media handles
                        </p>

                        <div className="flex justify-center items-center gap-4 flex-wrap">
                          <a
                            href="https://api.whatsapp.com/send?phone=2348144092733&text=Good%20day%20Votar%20How%20can%20i%20enroll?"
                            target="_blank"
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                          >
                            <svg
                              className="w-7 h-7 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                          </a>

                          {/* Instagram */}
                          <a
                            href="https://www.instagram.com/votarhq?igsh=MWZydTF3MHJ1aDJiNg%3D%3D&utm_source=qr"
                            target="_blank"
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                          >
                            <svg
                              className="w-7 h-7 text-pink-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </a>

                          {/* Facebook */}
                          <a
                            href="https://www.facebook.com/profile.php?id=61553214208461&mibextid=LQQJ4d"
                            target="_blank"
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                          >
                            <svg
                              className="w-7 h-7 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>

                          {/* X (Twitter) */}
                          <a
                            href="https://x.com/votarhq?s=21"
                            target="_blank"
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                          >
                            <svg
                              className="w-6 h-6 text-gray-900"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>

                          {/* TikTok */}
                          <a
                            href="https://www.tiktok.com/@votarhq?_r=1&_t=ZS-92J1VqVoCe7"
                            target="_blank"
                            className="w-7 h-7 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                          >
                            <svg
                              className="w-7 h-7 text-gray-900"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
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

                            const positionFreeVotes =
                              (Array.isArray(freeVoteDetails) &&
                                freeVoteDetails.find(
                                  (detail) =>
                                    detail.position ===
                                    position.name_of_position
                                )?.free_votes) ||
                              0;

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

                                      const pricePerVote = Number(
                                        election?.price_per_vote ?? 0
                                      );

                                      const allowedPaidVotes =
                                        pricePerVote > 0
                                          ? Math.floor(
                                              votarCredit / pricePerVote
                                            )
                                          : Infinity;

                                      const currentPaidVotesUsed =
                                        candidates.reduce((acc, pos) => {
                                          const posFree =
                                            freeVoteDetails.find(
                                              (d) =>
                                                d.position ===
                                                pos.name_of_position
                                            )?.free_votes || 0;
                                          const posTotal =
                                            pos.candidates.reduce(
                                              (s, c) => s + c.vote,
                                              0
                                            );
                                          return (
                                            acc +
                                            Math.max(0, posTotal - posFree)
                                          );
                                        }, 0);

                                      const willUsePaidVoteForThisPosition =
                                        positionFreeVotes === 0
                                          ? true
                                          : totalVotes >= positionFreeVotes;

                                      const isIncrementDisabled =
                                        isAbstained ||
                                        (willUsePaidVoteForThisPosition &&
                                          currentPaidVotesUsed >=
                                            allowedPaidVotes);

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
                                            <div
                                              onClick={() =>
                                                handleDetails(
                                                  candidate?.more_details || ""
                                                )
                                              }
                                              className="text-base text-blue-700 underline cursor-pointer font-normal"
                                            >
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
                                                  disabled={isIncrementDisabled}
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

            <AnimatePresence mode="wait">
              {showDetails && (
                <Modal
                  key="modal"
                  handleClose={() => setShowDetails(false)}
                  classname="overflow-y-scroll h-[20vh] max-w-[400px] ballot-modal  rounded bg-white"
                >
                  <div className="rounded h-full p-6">
                    <h1 className="text-lg font-medium">
                      Candidate More Details
                    </h1>
                    <div className="whitespace-pre-wrap mt-4">
                      {!selectedDetails && (
                        <p>No details available for this candidate.</p>
                      )}

                      {selectedDetails}
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
