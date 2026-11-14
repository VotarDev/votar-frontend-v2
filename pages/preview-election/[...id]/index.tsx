import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { AlertCircle, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { useCurrentUser, useCurrentUserId } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getCandidates, getElectionById } from "@/utils/api";
import Header from "@/src/components/BallotPage/Header";
import PageLoader from "@/src/components/shared/PageLoader";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { accentFor } from "@/src/components/MonitoringElection/PositionCard";
import BallotPositionSection from "@/src/components/VoterBallot/BallotPositionSection";
import BallotStatusCard from "@/src/components/VoterBallot/BallotStatusCard";
import CandidateDetailsDialog from "@/src/components/VoterBallot/CandidateDetailsDialog";
import ReviewVotesDialog from "@/src/components/VoterBallot/ReviewVotesDialog";
import type {
  BallotCandidate,
  BallotPosition,
  SelectedCandidates,
} from "@/src/components/VoterBallot/types";

/**
 * The organiser's preview of the ballot: the same layout voters get, with
 * selections kept on this page only (nothing is submitted).
 */
const PreviewVote = () => {
  const router = useRouter();
  const users = useCurrentUser();
  const USER_ID = useCurrentUserId();
  const [election, setElection] = useState<any>(null);
  const [electionID, setElectionID] = useState("");
  const [positions, setPositions] = useState<BallotPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchCandidates, setIsFetchCandidates] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Preview-only choices: position -> chosen candidates, or abstained.
  const [choices, setChoices] = useState<Record<string, BallotCandidate[]>>(
    {},
  );
  const [abstained, setAbstained] = useState<Record<string, boolean>>({});
  const [showReview, setShowReview] = useState(false);
  const [detailsCandidate, setDetailsCandidate] =
    useState<BallotCandidate | null>(null);

  const { id } = router.query;

  useEffect(() => {
    if (Array.isArray(id)) setElectionID(id[0]);
  }, [id]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authorise = () => {
    if (users?.data) {
      setAuthToken(users.data.data.cookie);
    } else if (typeof window !== "undefined") {
      setAuthToken(localStorage.getItem("token"));
    }
  };

  useEffect(() => {
    if (!electionID) return;
    const getElection = async () => {
      setIsLoading(true);
      authorise();
      try {
        const { data } = await getElectionById({ election_id: electionID });
        if (data) setElection(data.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "We couldn't load this election.");
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => {
    if (!electionID || !USER_ID) return;
    const fetchPositions = async () => {
      setIsFetchCandidates(true);
      authorise();
      try {
        const { data } = await getCandidates(USER_ID, {
          election_id: electionID,
        });
        if (data) setPositions(data.data || []);
      } catch (e) {
        console.log(e);
      } finally {
        setIsFetchCandidates(false);
      }
    };
    fetchPositions();
  }, [electionID, USER_ID]);

  const maxChoices = election?.max_number_candidate || 1;

  // The preview opens in a new tab (no history), so fall back to the
  // election's page; same route as the elections list.
  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (election?.election_id) {
      router.push(
        `/elections/${election.name_of_election}/${election.election_id}`,
      );
    } else {
      router.push("/elections");
    }
  };

  // Same rules as the real ballot: tap to pick or unpick; picking past the
  // limit drops the earliest pick; picking cancels an abstention.
  const selectCandidate = (position: string, candidate: BallotCandidate) => {
    setAbstained((prev) => ({ ...prev, [position]: false }));
    setChoices((prev) => {
      const current = prev[position] || [];
      const exists = current.some(
        (c) => c.candidate_name === candidate.candidate_name,
      );
      let next = exists
        ? current.filter((c) => c.candidate_name !== candidate.candidate_name)
        : [...current, candidate];
      if (!exists && next.length > maxChoices) next = next.slice(1);
      return { ...prev, [position]: next };
    });
  };

  const abstain = (position: string) => {
    setChoices((prev) => ({ ...prev, [position]: [] }));
    setAbstained((prev) => ({ ...prev, [position]: true }));
  };

  const positionsDone = positions.filter(
    (p) =>
      abstained[p.name_of_position] ||
      (choices[p.name_of_position]?.length ?? 0) > 0,
  ).length;
  const allDone = positions.length > 0 && positionsDone === positions.length;

  const selections: SelectedCandidates[] = positions
    .filter(
      (p) =>
        abstained[p.name_of_position] ||
        (choices[p.name_of_position]?.length ?? 0) > 0,
    )
    .map((p) =>
      abstained[p.name_of_position]
        ? { position: p.name_of_position, candidates: [], abstain: true }
        : {
            position: p.name_of_position,
            candidates: choices[p.name_of_position],
          },
    );

  if (!isClient) return null;
  if (isLoading) return <PageLoader message="Loading the preview" />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BallotStatusCard
          icon={AlertCircle}
          tone="danger"
          title="Preview unavailable"
          description={error}
        />
      </div>
    );
  }

  return (
    // `isolate` keeps the header's branding layer (-z-10) above the background.
    <div className="isolate min-h-screen bg-slate-50">
      <Header electionDetails={election} />

      <div className="mx-auto w-full max-w-5xl space-y-4 px-3 pb-32 pt-5 ssm:px-4 smm:space-y-6 smm:pt-6">
        <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 smm:flex-row smm:items-center smm:justify-between">
          <p className="flex items-start gap-2 text-sm text-amber-900">
            <Eye className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <span className="font-semibold">Preview.</span> This is what
              voters will see. Try it out: nothing you pick here is saved or
              submitted.
            </span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={goBack}
            className="shrink-0 bg-white"
          >
            <ArrowLeft /> Back to election
          </Button>
        </div>

        {isFetchCandidates ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-[420px] w-full rounded-2xl" />
          ))
        ) : positions.length === 0 ? (
          <BallotStatusCard
            icon={AlertCircle}
            tone="neutral"
            title="No positions yet"
            description="Add positions and candidates to the ballot to preview it."
          />
        ) : (
          positions.map((position, index) => (
            <BallotPositionSection
              key={position.name_of_position}
              position={position}
              number={index + 1}
              total={positions.length}
              accent={accentFor(index)}
              maxChoices={maxChoices}
              selectedCount={choices[position.name_of_position]?.length ?? 0}
              abstained={!!abstained[position.name_of_position]}
              isSelected={(candidate) =>
                !abstained[position.name_of_position] &&
                (choices[position.name_of_position] || []).some(
                  (c) => c.candidate_name === candidate.candidate_name,
                )
              }
              onSelect={(candidate) =>
                selectCandidate(position.name_of_position, candidate)
              }
              onAbstain={() => abstain(position.name_of_position)}
              onShowDetails={setDetailsCandidate}
            />
          ))
        )}
      </div>

      {positions.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3 smm:gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground ssm:text-sm">
                {positionsDone} of {positions.length}
                <span className="hidden ssm:inline"> positions</span> done
              </p>
              <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(positionsDone / positions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <Button
              onClick={() => setShowReview(true)}
              disabled={!allDone}
              className="h-11 shrink-0 px-3 ssm:px-4"
            >
              Review<span className="hidden ssm:inline"> votes</span>{" "}
              <ArrowRight />
            </Button>
          </div>
        </div>
      )}

      <ReviewVotesDialog
        open={showReview}
        onClose={() => setShowReview(false)}
        onConfirm={() => {
          setShowReview(false);
          toast("This is a preview, so votes aren't submitted.", {
            icon: "👀",
          });
        }}
        isSubmitting={false}
        selections={selections}
      />
      <CandidateDetailsDialog
        candidate={detailsCandidate}
        onClose={() => setDetailsCandidate(null)}
      />
    </div>
  );
};

export default PreviewVote;
