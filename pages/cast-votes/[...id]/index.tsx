import React, { useState, useEffect, useMemo } from "react";
import Cookies from "universal-cookie";
import { Eye, Vote } from "lucide-react";
import { PiWarningCircleFill } from "react-icons/pi";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getBallotCandidate, getElectionById } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import Header from "@/src/components/BallotPage/Header";
import { useRouter } from "next/router";
import { getCandidates } from "@/utils/api";
import leftline from "../../../public/assets/images/left-line.svg";
import placeholder from "../../../public/assets/images/Placeholder.png";
import rightline from "../../../public/assets/images/right-line.svg";
import MiniDashboard from "@/src/components/VotePage/MiniDashboard";
import { Candidate, Details, Position } from "@/utils/types";
import { AnimatePresence } from "framer-motion";
import checked from "../../../public/assets/icons/checked.svg";
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

const Castvote = () => {
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

  const MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED = 1;

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      // Email sign-in keeps the token on the user; everyone else (e.g. Google
      // sign-in) has it in the cookie. Never clear the shared header here.
      const token = users?.data?.data?.cookie || new Cookies().get("user-token");
      if (token) setAuthToken(token);
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
          // Remove the candidate if already selected and reset votes to 0
          updatedCandidates[candidateIndex].votes = 0;
          updatedCandidates.splice(candidateIndex, 1);
        } else {
          // Add the candidate if not selected
          if (
            updatedCandidates.length >= MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED
          ) {
            const removedCandidate = updatedCandidates.shift();
            if (removedCandidate) removedCandidate.votes = 0; // Reset votes of the removed candidate
          }
          candidate.votes = 1; // Increment vote to 1 when selected
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
        candidate.votes = 1; // Increment vote to 1 when selected
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
    setVotingData((prevData: any) => {
      const updatedData = [...prevData];
      const candidate = updatedData[positionIndex].candidates[candidateIndex];
      if (candidate) {
        candidate.votes = increment ? 1 : 0; // Increment or reset to 0
      }
      return updatedData;
    });
  };
  const closeModal = () => setShowModal(false);

  // One colour per position for the whole visit (it used to change on every
  // re-render, so selecting a candidate repainted every section).
  const sectionColors = useMemo(
    () =>
      (votingData || []).map(
        () => cols[Math.floor(Math.random() * cols.length)]
      ),
    [votingData?.length]
  );

  const isCandidateActive = (position: string, candidate: Candidate) => {
    const positionData = selectedCandidates.find(
      (sc: any) => sc.position === position
    );
    return (
      positionData?.candidates.some(
        (c) => c.candidate_name === candidate.candidate_name && c.votes
      ) ?? false
    );
  };

  console.log(candidates);

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

  const hasBallot = !!votingData && votingData.length > 0;

  return (
    <>
      {isClient && (
        <div className="pb-16">
          <div className="sticky top-0 z-20 flex items-center justify-center gap-2 bg-slate-900 px-4 py-2.5 text-center text-sm text-white">
            <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-semibold">Preview</span> · This is how
              voters will see your ballot. Votes can&apos;t be cast here.
            </span>
          </div>

          <Header electionDetails={election} />

          {/* Mirrors the voter ballot page (/ballot), using the ballot as
              entered on the Ballot step. */}
          <div className="mt-[56px] max-w-[1200px] mx-auto px-4">
            {!hasBallot && (
              <div className="mx-auto my-16 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                  <Vote className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="text-lg font-semibold text-slate-900">
                  Nothing to preview yet
                </h2>
                <p className="text-sm text-slate-500">
                  Add positions and candidates on the Ballot step, then open
                  the preview again.
                </p>
              </div>
            )}

            {hasBallot &&
              votingData.map((preview, index) => (
                <div
                  key={index}
                  className="bg-slate-50 mt-10 mb-8 lg:mt-20 lg:mb-14 p-4 lg:p-10 rounded-r-lg"
                  style={{ borderLeft: `4px solid ${sectionColors[index]}` }}
                >
                  <div className="text-center text-slate-900 lg:text-[28px] text-base font-semibold flex items-center justify-center gap-2 uppercase">
                    <div>
                      <img
                        src={leftline.src}
                        alt="line"
                        className="w-14 lg:w-full"
                      />
                    </div>
                    <div>
                      {preview.name_of_position || `Position ${index + 1}`}
                    </div>
                    <div>
                      <img
                        src={rightline.src}
                        alt="line"
                        className="w-14 lg:w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center flex-wrap gap-6 lg:gap-10 items-stretch lg:max-w-[1200px] max-w-full w-full mx-auto my-10">
                    {preview.candidates.map((candidate, candidateIndex) => (
                      <div
                        key={candidateIndex}
                        className={`w-full max-w-[280px] lg:w-[calc(25%-40px)] lg:max-w-none mx-auto lg:mx-0 flex flex-col justify-center items-center text-center text-lg lg:text-xl font-semibold p-3 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md cursor-pointer relative ${
                          isCandidateActive(preview.name_of_position, candidate)
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

                        <div className="w-full">
                          {preview.show_pictures && (
                            <div className="mb-3">
                              <img
                                src={
                                  candidate.candidate_picture_base64 ||
                                  placeholder.src
                                }
                                className="w-full h-auto aspect-square object-cover rounded-lg"
                                alt={`Image for ${candidate.candidate_name}`}
                              />
                            </div>
                          )}

                          <div className="capitalize">
                            <div>
                              {candidate.candidate_name ||
                                `Candidate ${candidateIndex + 1}`}
                            </div>
                            {candidate.candidate_nickname && (
                              <div className="text-base">
                                ({candidate.candidate_nickname})
                              </div>
                            )}
                          </div>
                          <div className="text-base text-blue-700 underline cursor-pointer font-normal">
                            More Details
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {preview.allow_abstain && (
                    <div className="flex justify-center items-center">
                      <button
                        type="button"
                        className="w-32 h-14 bg-blue-700 rounded-lg text-zinc-100 font-bold text-xl uppercase"
                      >
                        Abstain
                      </button>
                    </div>
                  )}
                </div>
              ))}

            {hasBallot && (
              <>
                <div className="flex bg-[#FFBC11] bg-opacity-20 text-left p-4 justify-center my-10 max-w-[700px] w-full mx-auto gap-2">
                  <div className="text-[#ECAE0D] text-xl">
                    <PiWarningCircleFill />
                  </div>
                  <div className="text-[#826008]">
                    To cast your vote using the “Enter Votes” button below,
                    please make sure to select your preferred candidate for
                    each position in the election. If you choose not to vote
                    for a particular position, you may select “Abstain” (if
                    this option is available in your election).
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 mb-10">
                  <button
                    type="button"
                    disabled
                    title="Votes can't be cast in the preview"
                    className="bg-blue-700 text-slate-100 outline-none border-none w-40 h-12 flex justify-center items-center rounded-md uppercase font-semibold"
                  >
                    Enter Votes
                  </button>
                  <span className="text-xs text-slate-500">
                    Disabled in the preview
                  </span>
                </div>
              </>
            )}

            <AnimatePresence mode="wait">
              {showModal && (
                <Modal key="modal" handleClose={closeModal}>
                  <CandidateDetails details={selectedCandidateDetails} />
                </Modal>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
};

export default Castvote;
