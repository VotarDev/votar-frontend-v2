import React, { useEffect, useState, useRef } from "react";
import { ElectionDetails } from "@/utils/types";
import { toPng } from "html-to-image";
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
import { enterVotes } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import toast from "react-hot-toast";
import { useSession, signOut } from "next-auth/react";
import { ArrowRight, Info } from "lucide-react";
import {
  parseElectionDate,
  getElectionStatus,
  type ElectionStatus,
} from "@/utils/electionTime";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import PageLoader from "@/src/components/shared/PageLoader";
import { accentFor } from "@/src/components/MonitoringElection/PositionCard";
import BallotPositionSection from "@/src/components/VoterBallot/BallotPositionSection";
import BallotStatusCard from "@/src/components/VoterBallot/BallotStatusCard";
import BallotAvailability from "@/src/components/VoterBallot/BallotAvailability";
import CandidateDetailsDialog from "@/src/components/VoterBallot/CandidateDetailsDialog";
import ReviewVotesDialog from "@/src/components/VoterBallot/ReviewVotesDialog";
import VoteSuccess from "@/src/components/VoterBallot/VoteSuccess";
import VoterBar from "@/src/components/VoterBallot/VoterBar";
import type {
  BallotCandidate as Candidate,
  BallotPosition as BallotData,
  SelectedCandidates,
} from "@/src/components/VoterBallot/types";

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

  const [electionStatus, setElectionStatus] = useState<ElectionStatus | null>(null);
  const electionStatusRef = useRef<ElectionStatus | null>(null);
  // Bumped when the voting window opens while the voter is waiting on this page,
  // so the candidates are fetched again instead of showing the early rejection.
  const [candidatesRefetchKey, setCandidatesRefetchKey] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [detailsCandidate, setDetailsCandidate] = useState<Candidate | null>(
    null,
  );

  const [candidateId, setCandidateId] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const now = new Date();
  const formattedDate = now.toLocaleString("en-US", {
    timeZone: "Africa/Lagos",
  });

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
      positionData?.candidates?.some(
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
    if (!election) return;

    // Read the stored times as absolute instants (not in this voter's browser
    // timezone), so voters in every country get the same open/close moment.
    const start = parseElectionDate((election as any).start_date);
    const end = parseElectionDate((election as any).end_date);

    const updateStatus = () => {
      const previous = electionStatusRef.current;
      const next = getElectionStatus(start, end);
      electionStatusRef.current = next;
      setElectionStatus(next);

      // The window opened while the voter was waiting on this page.
      if (previous === "not_started" && next === "active") {
        setCandidatesRefetchKey((key) => key + 1);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [election]);

  useEffect(() => {
    const getCandidatesData = async () => {
      setIsFetchCandidate(true);
      setElectionEnded(null);
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
          date: formattedDate,
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
  }, [voterProfile.userData, candidatesRefetchKey]);

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

  const voterName =
    voterProfile.userData?.name || session?.user?.name || undefined;

  // Page frame: the election's branded header, then the voter bar. `isolate`
  // keeps the header's branding layer (-z-10) above this background.
  const frame = (greeting: string, content: React.ReactNode) => (
    <div className="isolate min-h-screen bg-slate-50">
      <Header electionDetails={election} />
      <VoterBar
        greeting={greeting}
        name={voterName}
        onLogout={handleLogout}
        hasUnsavedChoices={
          !isVoteSuccessful &&
          (selectedCandidates.length > 0 ||
            Object.values(abstentions).some((a: any) => a?.abstained))
        }
      />
      {content}
    </div>
  );

  // Ended, not published, or not started yet: explain why voting is closed.
  const unavailable = (
    <BallotAvailability election={election} status={electionStatus} />
  );
  if (
    election &&
    (election.published === false ||
      electionStatus === "not_started" ||
      electionStatus === "ended")
  ) {
    return frame("Welcome", unavailable);
  }

  if (!isClient) return null;

  if (isFetchElection && !election) {
    return <PageLoader message="Loading your ballot" />;
  }

  const maxChoices = election?.max_number_candidate || 1;
  const selectionFor = (position: string) =>
    selectedCandidates.find((sc) => sc.position === position);
  const positionsDone = combinedData.filter(
    (position: BallotData) =>
      abstentions[position.name_of_position]?.abstained ||
      (selectionFor(position.name_of_position)?.candidates?.length ?? 0) > 0,
  ).length;
  const positionCount = combinedData.length;

  const renderBallot = () => {
    if (isFetchCandidate) {
      return (
        <div className="mx-auto w-full max-w-5xl space-y-4 px-3 py-5 ssm:px-4 smm:space-y-6 smm:py-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-2xl" />
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
              Choose{" "}
              {maxChoices > 1 ? `up to ${maxChoices} candidates` : "a candidate"}{" "}
              for every position, or abstain. Then review and submit your
              votes. You can only vote once.
            </span>
          </p>

          {combinedData.map((position: BallotData, index: number) => (
            <BallotPositionSection
              key={position.name_of_position}
              position={position}
              number={index + 1}
              total={positionCount}
              accent={accentFor(index)}
              maxChoices={maxChoices}
              selectedCount={
                abstentions[position.name_of_position]?.abstained
                  ? 0
                  : selectionFor(position.name_of_position)?.candidates
                      ?.length ?? 0
              }
              abstained={!!abstentions[position.name_of_position]?.abstained}
              isSelected={(candidate) =>
                isCandidateActive(position.name_of_position, candidate)
              }
              onSelect={(candidate) =>
                handleSelectCandidate(position.name_of_position, candidate)
              }
              onAbstain={() => handleAbstain(position.name_of_position)}
              onShowDetails={setDetailsCandidate}
            />
          ))}
        </div>

        {/* Progress and submit, always in reach. */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3 smm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground ssm:text-sm">
                {positionsDone} of {positionCount}
                <span className="hidden ssm:inline"> positions</span> done
              </p>
              <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${positionCount ? (positionsDone / positionCount) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              disabled={!allPositionsSelected || positionCount === 0}
              className="h-11 shrink-0 px-3 ssm:px-4"
            >
              Review<span className="hidden ssm:inline"> votes</span>{" "}
              <ArrowRight />
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {election?.type === "Votar Pro" && <FetchVoterProfile />}
      {frame(
        isVoteSuccessful ? "Congratulations" : "Welcome",
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
        voterName={voterProfile.userData?.name}
        selections={selectedCandidates}
      />
      <CandidateDetailsDialog
        candidate={detailsCandidate}
        onClose={() => setDetailsCandidate(null)}
      />
    </>
  );
};

export default Ballot;
