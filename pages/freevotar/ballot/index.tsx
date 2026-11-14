import React, { useEffect, useState, useRef } from "react";
import {
  BallotData,
  ElectionDetails,
  FreeVotarCandidate,
  FreeVoteDetail,
  SelectedCandidates,
} from "@/utils/types";
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
import { ArrowRight, Info, Vote } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import PageLoader from "@/src/components/shared/PageLoader";
import { accentFor } from "@/src/components/MonitoringElection/PositionCard";
import BallotStatusCard from "@/src/components/VoterBallot/BallotStatusCard";
import BallotAvailability, {
  statusForElection,
} from "@/src/components/VoterBallot/BallotAvailability";
import CandidateDetailsDialog from "@/src/components/VoterBallot/CandidateDetailsDialog";
import ReviewVotesDialog from "@/src/components/VoterBallot/ReviewVotesDialog";
import VoteSuccess from "@/src/components/VoterBallot/VoteSuccess";
import VoterBar from "@/src/components/VoterBallot/VoterBar";
import FreeVotarPositionSection from "@/src/components/FreeVotarBallot/FreeVotarPositionSection";

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
  const [detailsCandidate, setDetailsCandidate] =
    useState<FreeVotarCandidate | null>(null);
  const { data: session, status } = useSession();

  const now = new Date();
  const badgeRef = useRef<HTMLDivElement>(null);
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

  const voterName =
    voterProfile.userData?.name || session?.user?.name || undefined;

  // Page frame: the election's branded header (with the credits card), then
  // the voter bar. `isolate` keeps the header's branding layer (-z-10) above
  // this background.
  const frame = (content: React.ReactNode, hideCredits = isVoteSuccessful) => (
    <div className="isolate min-h-screen bg-slate-50">
      <Header
        electionDetails={election}
        getVoterCredit={registerVotar}
        isVoteSuccessful={hideCredits}
      />
      <VoterBar
        greeting={isVoteSuccessful ? "Congratulations" : "Welcome"}
        name={voterName}
        onLogout={handleLogout}
        hasUnsavedChoices={!isVoteSuccessful && selectedCandidates.length > 0}
      />
      {content}
    </div>
  );

  if (!isClient) return null;

  // Free Votar voters sign in with Google first.
  if (election?.type === "Free Votar" && status !== "authenticated") {
    return (
      <div className="isolate min-h-screen bg-slate-50">
        {/* Credits are hidden until the voter has signed in. */}
        <Header electionDetails={election} isVoteSuccessful />
        <div className="flex justify-center px-4 pb-16 pt-2">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 text-center shadow-sm smm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
              <Vote className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-foreground smm:text-2xl">
              Sign in to vote
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Continue with Google to open the ballot
              {election?.name_of_election ? (
                <>
                  {" "}
                  for{" "}
                  <span className="font-medium text-foreground">
                    {election.name_of_election}
                  </span>
                </>
              ) : null}
              .
            </p>
            <div className="mt-6 flex justify-center">
              <GoogleSignInButton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFetchElection && !election) {
    return <PageLoader message="Loading your ballot" />;
  }

  // Ended, not published, or not started yet: explain why voting is closed.
  const electionStatus = statusForElection(election);
  if (
    election &&
    (election.published === false ||
      electionStatus === "not_started" ||
      electionStatus === "ended") &&
    !isVoteSuccessful
  ) {
    return frame(<BallotAvailability election={election} />, true);
  }

  // Same rules as the vote counter (handleVote): votes past a position's free
  // votes are paid from the voter's credits.
  const freeVotesFor = (positionName: string) =>
    (Array.isArray(freeVoteDetails) &&
      freeVoteDetails.find((d) => d.position === positionName)?.free_votes) ||
    0;
  const pricePerVote = Number(election?.price_per_vote ?? 0);
  const allowedPaidVotes =
    pricePerVote > 0 ? Math.floor(votarCredit / pricePerVote) : Infinity;
  const paidVotesUsed = candidates.reduce((acc, pos) => {
    const posTotal = pos.candidates.reduce((sum, c) => sum + c.vote, 0);
    return acc + Math.max(0, posTotal - freeVotesFor(pos.name_of_position));
  }, 0);
  const totalVotes = candidates.reduce(
    (acc, pos) => acc + pos.candidates.reduce((sum, c) => sum + c.vote, 0),
    0,
  );
  const positionsDone = candidates.filter((pos) =>
    selectedCandidates.some((sc) => sc.position === pos.name_of_position),
  ).length;

  const renderBallot = () => {
    if (isFetchCandidate) {
      return (
        <div className="mx-auto w-full max-w-5xl space-y-4 px-3 py-5 ssm:px-4 smm:space-y-6 smm:py-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[460px] w-full rounded-2xl" />
          ))}
        </div>
      );
    }

    if (electionEnded) {
      return (
        <BallotStatusCard
          icon={Info}
          tone="neutral"
          title="The ballot isn't available"
          description={electionEnded}
        />
      );
    }

    return (
      <>
        <div className="mx-auto w-full max-w-5xl space-y-4 px-3 pb-32 pt-5 ssm:px-4 smm:space-y-6 smm:pt-6">
          <p className="flex items-start gap-2 rounded-xl border border-primary/15 bg-secondary px-4 py-3 text-sm text-foreground">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              Use + and − to give votes to up to{" "}
              {MAX_NUMBER_OF_CANDIDATES_TO_BE_SELECTED} candidates per position,
              or abstain. Each position has some free votes
              {pricePerVote > 0
                ? `; extra votes cost ₦${pricePerVote.toLocaleString()} each from your Votar credits`
                : ""}
              .
            </span>
          </p>

          {candidates.map((position, positionIndex) => {
            const freeVotes = freeVotesFor(position.name_of_position);
            const positionTotal = position.candidates.reduce(
              (sum, c) => sum + c.vote,
              0,
            );
            const willUsePaidVote =
              freeVotes === 0 ? true : positionTotal >= freeVotes;
            return (
              <FreeVotarPositionSection
                key={position.name_of_position}
                position={position}
                positionIndex={positionIndex}
                total={candidates.length}
                accent={accentFor(positionIndex)}
                freeVotes={freeVotes}
                abstained={!!abstentions[position.name_of_position]?.abstained}
                outOfVotes={willUsePaidVote && paidVotesUsed >= allowedPaidVotes}
                onSelect={(candidate) =>
                  handleSelectCandidate(position.name_of_position, candidate)
                }
                onVote={(candidateIndex, increment) =>
                  handleVote(positionIndex, candidateIndex, increment)
                }
                onAbstain={() => handleAbstain(position.name_of_position)}
                onShowDetails={setDetailsCandidate}
              />
            );
          })}
        </div>

        {candidates.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center gap-3 smm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground ssm:text-sm">
                  {positionsDone} of {candidates.length}
                  <span className="hidden ssm:inline"> positions</span> done
                  <span className="text-muted-foreground">
                    {" "}
                    · {totalVotes} vote{totalVotes === 1 ? "" : "s"}
                    {paidVotesUsed > 0 && pricePerVote > 0 && (
                      <span className="hidden smm:inline">
                        {" "}
                        ({paidVotesUsed} paid, ₦
                        {(paidVotesUsed * pricePerVote).toLocaleString()})
                      </span>
                    )}
                  </span>
                </p>
                <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{
                      width: `${(positionsDone / candidates.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                disabled={!allPositionsSelected}
                className="h-11 shrink-0 px-3 ssm:px-4"
              >
                Review<span className="hidden ssm:inline"> votes</span>{" "}
                <ArrowRight />
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {election?.type === "Votar Pro" && <FetchVoterProfile />}
      {frame(
        isVoteSuccessful ? (
          <VoteSuccess
            voterName={voterName || "Voter"}
            badgeRef={badgeRef}
            onDownloadBadge={downloadBadge}
          />
        ) : (
          renderBallot()
        ),
      )}

      <ReviewVotesDialog
        open={showModal}
        onClose={closeModal}
        onConfirm={enterVotesHandler}
        isSubmitting={isCastVote}
        voterName={voterName}
        selections={selectedCandidates}
      />
      <CandidateDetailsDialog
        candidate={detailsCandidate}
        onClose={() => setDetailsCandidate(null)}
      />
    </>
  );
};

export default FreeVotarBallot;
