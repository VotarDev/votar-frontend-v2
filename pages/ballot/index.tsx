import React, { useEffect, useState, useContext, use } from "react";
import leftline from "../../public/assets/images/left-line.svg";
import rightline from "../../public/assets/images/right-line.svg";
import { Details, ElectionDetails } from "@/utils/types";

import avatar from "../../public/assets/images/avatar-placeholder.png";
import checked from "../../public/assets/icons/checked.svg";
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
} from "@/utils/api";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";
import { enterVotes } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";
import { GoogleSignInButton } from "@/src/components/authButton/authButtons";
import { getServerSession } from "next-auth";
import { useSession, signOut } from "next-auth/react";

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
  abstain?: boolean;
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
  const [isCastVote, setIsCastVote] = useState(false);
  const [isVoteSuccessful, setIsVoteSuccessful] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<
    SelectedCandidates[]
  >([]);
  const [pickedCandidates, setPickedCandidates] = useState({} as any);
  const [abstentions, setAbstentions] = useState({} as any);
  const [allPositionsSelected, setAllPositionsSelected] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const users = useCurrentUser();
  const user = useUser();
  const [showModal, setShowModal] = useState(false);
  const [showGoogleAuth, setShowGoogleAuth] = useState(true);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const { data: session, status } = useSession();

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

  useEffect(() => {
    if (router.query.candidate) {
      const id = Array.isArray(router.query.candidate)
        ? router.query.candidate[0]
        : router.query.candidate;

      setCandidateId(id);
    }
  }, [router.query.candidate]);

  console.log(session);

  useEffect(() => {
    const registerVotar = async () => {
      try {
        const userData = {
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
          election_id: candidateId,
        };
        const { data } = await registerVoter(userData);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    registerVotar();
  }, [
    candidateId,
    session?.user?.name,
    session?.user?.email,
    session?.user?.image,
  ]);

  const handleGoHome = () => {
    router.push("/vote");
  };

  const handleSelectCandidate = (position: string, candidate: Candidate) => {
    setSelectedCandidates((prevState: any) => {
      const MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED =
        election?.max_number_candidate || 1;
      const existingIndex = prevState.findIndex(
        (sc: any) => sc.position === position
      );

      setAbstentions((prevAbstentions: any) => ({
        ...prevAbstentions,
        [position]: {
          abstained: false,
        },
      }));

      if (existingIndex !== -1) {
        const updatedCandidates = [
          ...(prevState[existingIndex].candidates || []),
        ];
        const candidateIndex = updatedCandidates.findIndex(
          (c) => c.candidate_name === candidate.candidate_name
        );

        if (candidateIndex !== -1) {
          updatedCandidates.splice(candidateIndex, 1);
        } else {
          if (
            updatedCandidates.length >= MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED
          ) {
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
          (sc) => sc.candidates?.length > 0 || sc.abstain
        );
      } else {
        return [
          ...prevState,
          { position, candidates: [candidate], abstain: false },
        ];
      }
    });
  };

  const isCandidateActive = (position: string, candidate: Candidate) => {
    if (abstentions[position]?.abstained) {
      return false;
    }

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
          election_id: candidateId || voterProfile.userData.election_id,
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
  }, [candidateId, voterProfile.userData]);

  console.log(candidateId);

  useEffect(() => {
    const getCandidatesData = async () => {
      setIsFetchCandidate(true); // Set fetching state
      const cookie = new Cookies();
      const token = cookie.get(voterLoginCookieName);

      if (token) {
        setAuthToken(token);
      }

      try {
        const electionData = {
          election_id: candidateId || voterProfile.userData.election_id,
        };

        const { data } = await getBallotCandidate(electionData);

        if (data) {
          setCandidates(data.data);
        }
        console.log(data.data);
      } catch (error: any) {
        setElectionEnded(error?.response?.data?.message);
        console.error("Error fetching candidates:", error);
      } finally {
        setIsFetchCandidate(false); // Ensure state is reset
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
      if (voterProfile.userData && voterProfile.userData.election_id) {
        const selectedVotes = selectedCandidates.flatMap((item) =>
          item.candidates
            ? item.candidates.map((can) => ({
                candidate_name: can.candidate_name,
                position: item.position,
                abstain: false,
              }))
            : []
        );

        const abstainVotes = Object.keys(abstentions).flatMap((position) =>
          abstentions[position]?.abstained ? [{ position, abstain: true }] : []
        );

        const votes = [...selectedVotes, ...abstainVotes];

        const electionData = {
          voter_id: voterProfile.userData.id,
          election_id: voterProfile.userData.election_id,
          votes,
        };

        const { data } = await enterVotes(electionData);
        if (data) {
          setIsCastVote(false);
          setIsVoteSuccessful(true);
          closeModal();
        }
      }
    } catch (e: any) {
      setIsCastVote(false);
      toast.error(e?.response?.data?.message);
      closeModal();
      console.log(e);
    }
  };

  const handleAbstain = (position: string) => {
    setSelectedCandidates((prevState: any) => {
      const updatedCandidates = prevState.filter(
        (sc: any) => sc.position !== position
      );

      return [...updatedCandidates, { position, abstain: true }];
    });

    setAbstentions((prevState: any) => ({
      ...prevState,
      [position]: {
        abstained: true,
      },
    }));

    toast.success(
      `You have abstained from voting for the position: ${position}`
    );
  };

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

  useEffect(() => {
    const allPositions = combinedData.map((item: any) => item.name_of_position);

    const selectedPositions = selectedCandidates.map(
      (item: any) => item.position
    );

    const abstainedPositions = Object.keys(abstentions).filter(
      (position) => abstentions[position]?.abstained === true
    );

    const selectedAndAbstainedPositions = [
      ...selectedPositions,
      ...abstainedPositions,
    ];

    const isAllPositionsSelected = allPositions.every((position: any) =>
      selectedAndAbstainedPositions.includes(position)
    );

    setAllPositionsSelected(isAllPositionsSelected);
  }, [selectedCandidates, abstentions, combinedData]);

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
          <Header electionDetails={election} />
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
                                <div className="flex justify-center flex-wrap gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-10">
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
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                                <div className="flex justify-center items-center">
                                  <button
                                    onClick={() =>
                                      handleAbstain(preview.name_of_position)
                                    }
                                    disabled={
                                      abstentions[preview.name_of_position]
                                        ?.abstained
                                    }
                                    className="w-32 h-14 bg-blue-700 rounded-lg text-zinc-100 font-bold text-xl  uppercase"
                                  >
                                    Abstain
                                  </button>
                                </div>
                              </div>
                            );
                          })}

                        <div className="flex bg-[#FFBC11] bg-opacity-20 text-left p-4 justify-center my-10 w-[700px] mx-auto gap-2">
                          <div className="text-[#ECAE0D] text-xl">
                            <PiWarningCircleFill />
                          </div>
                          <div className="text-[#826008]">
                            To cast your vote using the “Enter Votes” button
                            below, please make sure to select your preferred
                            candidate for each position in the election. If you
                            choose not to vote for a particular position, you
                            may select “Abstain” (if this option is available in
                            your election).
                          </div>
                        </div>
                        <div className="flex justify-center mb-10">
                          <button
                            onClick={() => setShowModal(true)}
                            disabled={!allPositionsSelected}
                            className="bg-blue-700 text-slate-100 outline-none border-none w-40 h-12 flex justify-center items-center rounded-md uppercase font-semibold"
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

                          {selectedCandidate.abstain ? (
                            <div className="text-center text-red-500 font-semibold py-2">
                              You have abstained from voting for this position.
                            </div>
                          ) : (
                            <div className="flex justify-center gap-3">
                              {selectedCandidate.candidates?.map(
                                (candidate: any, candidateIndex: any) => (
                                  <div key={candidateIndex} className="pb-3">
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
                          )}
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

export default Ballot;
