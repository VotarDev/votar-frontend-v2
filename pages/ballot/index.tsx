import React, { useEffect, useState, useRef } from "react";
import leftline from "../../public/assets/images/left-line.svg";
import rightline from "../../public/assets/images/right-line.svg";
import { Details, ElectionDetails } from "@/utils/types";
import checked from "../../public/assets/icons/checked.svg";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";
import { toPng } from "html-to-image";

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
import { useSession, signOut } from "next-auth/react";
import { Check, MessageSquare, Download } from "lucide-react";

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

  const [showModal, setShowModal] = useState(false);
  const badgeRef = useRef(null);

  const [candidateId, setCandidateId] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const cols = [
    "#b138b3",
    "#00ff00",
    "#015CE9",
    "#E46F24",
    "#93241F",
    "#406b83",
  ];

  const now = new Date().getTime();

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
        if (voterProfile.userData.election_id) {
          const electionData = {
            election_id: voterProfile.userData.election_id,
          };
          const { data } = await getElectionById(electionData);

          if (data) {
            setElection(data.data);

            setIsFetchElection(false);
          }
        }
      } catch (error: any) {
        console.log(error);
        setIsFetchElection(false);
      }
    };

    if (voterProfile && voterProfile.userData) {
      getElection();
    }
  }, [voterProfile.userData]);

  useEffect(() => {
    const getCandidatesData = async () => {
      setIsFetchCandidate(true);
      const cookie = new Cookies();
      const token = cookie.get(voterLoginCookieName);

      if (token) {
        setAuthToken(token);
      }
      if (!voterProfile?.userData?.election_id) {
        return;
      }
      try {
        const electionData = {
          election_id: voterProfile.userData.election_id,
          date: now,
        };

        const { data } = await getBallotCandidate(electionData);

        if (data) {
          setCandidates(data.data);
        }
      } catch (error: any) {
        setElectionEnded(error?.response?.data?.message);
        console.error("Error fetching candidates:", error);
      } finally {
        setIsFetchCandidate(false);
      }
    };

    getCandidatesData();
  }, [voterProfile.userData]);

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

  if (election?.published === false) {
    return (
      <>
        <div>
          <Header electionDetails={election} />
        </div>
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
            {isFetchCandidate ? (
              <div className="mt-10 text-center">Fetching candidates...</div>
            ) : (
              <div>
                <div className="text-center mt-5">
                  <h1 className="md:text-4xl text-2xl font-bold capitalize">
                    {!isVoteSuccessful ? "Welcome," : "Congratulations,"}{" "}
                    {voterProfile.userData?.name
                      ? voterProfile.userData?.name
                      : session?.user?.name}
                  </h1>
                </div>
                {isVoteSuccessful ? (
                  <div className="relative w-full bg-white p-8 min-h-[600px] flex flex-col items-center justify-center">
                    <div
                      ref={badgeRef}
                      className="relative inline-block mb-10 transform hover:scale-105 transition-transform duration-500 bg-white p-4"
                    >
                      <div className="flex flex-col items-center justify-center top-0">
                        <div className="pt-0 md:pt-0 text-center px-12">
                          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1">
                            Certified Voter
                          </p>
                          <h2 className="text-xl md:text-3xl font-black text-[#22C55E] leading-tight uppercase break-words max-w-[200px] md:max-w-[400px]">
                            {voterProfile.userData?.name ||
                              session?.user?.name ||
                              "Voter"}
                          </h2>
                        </div>
                      </div>
                      <img
                        src="/assets/images/customizable-image.jpeg"
                        alt="Success Ribbon"
                        className="w-[350px] md:w-[500px] h-auto"
                      />
                    </div>

                    <div className="bg-white rounded-2xl p-8 md:p-12 mb-8 md:absolute left-0">
                      <div className="mb-10 flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                          Actions
                        </h2>

                        {/* NEW DOWNLOAD BUTTON */}
                        <button
                          onClick={downloadBadge}
                          className="w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          Download My Badge
                        </button>

                        <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Give us feedback
                        </button>
                      </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="vibrate bg-gradient-to-r md:absolute right-10 from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white mb-8 mt-10 transform transition-transform duration-300 ease-out hover:scale-105">
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
                      <div className="mt-[56px] max-w-[1200px] mx-auto px-4">
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

                        <div className="flex bg-[#FFBC11] bg-opacity-20 text-left p-4 justify-center my-10 max-w-[700px] w-full mx-auto gap-2">
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

                      <div className="flex bg-[#FFBC11] bg-opacity-20 text-left p-4 justify-center my-10 max-w-[700px] w-full mx-auto gap-2">
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
