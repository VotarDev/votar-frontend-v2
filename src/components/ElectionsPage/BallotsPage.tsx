import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Cookies from "universal-cookie";
import { Copy, Eye, Link2, Lock, Trash2 } from "lucide-react";
import VotingLockNotice from "@/src/components/shared/VotingLockNotice";
import { useCurrentUserId } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import {
  deleteCandidate,
  deletePosition,
  getCandidates,
  getElectionById,
} from "@/utils/api";
import { parseElectionDate } from "@/utils/electionTime";
import Header from "../BallotPage/Header";
import Body from "../BallotPage/Body";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import ConfirmDialog from "@/src/components/shared/ConfirmDialog";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy text:", error);
    toast.error("Copy operation failed. Please try again.");
  }
};

const errorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || error?.toString();

// New candidates get a timestamp id until they're saved; saved ones have a
// database id. New positions have no _id at all.
const isUnsavedCandidate = (candidate: any) =>
  !candidate?._id || /^\d+$/.test(String(candidate._id));
const isUnsavedPosition = (position: any) => !position?._id;

type PendingDelete =
  | { kind: "position"; positionIndex: number }
  | { kind: "candidate"; positionIndex: number; candidateIndex: number }
  | null;

/** The edit-election ballot: the same editor as the create flow, on saved data. */
const BallotsPage = ({ position, setPosition }: any) => {
  const router = useRouter();
  const userId = useCurrentUserId();
  const [election, setElection] = useState<any>(null);
  const [electionID, setElectionID] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [targetDateTime, setTargetDateTime] = useState<Date | null>(null);
  const [isEditable, setIsEditable] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  const { id } = router.query;

  useEffect(() => {
    if (Array.isArray(id)) setElectionID(id[id.length - 1]);
  }, [id]);

  useEffect(() => {
    const getElection = async () => {
      if (!electionID) return;
      setIsLoading(true);
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await getElectionById({ election_id: electionID });
        if (data) {
          setElection(data.data);
          const start = parseElectionDate(data.data.start_date);
          if (start) {
            setTargetDateTime(start);
          } else {
            console.error("Invalid start_date format:", data.data.start_date);
          }
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "We couldn't load this election.",
        );
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => {
    if (targetDateTime) {
      const updateEditableState = () =>
        setIsEditable(new Date() < targetDateTime);
      updateEditableState();
      const interval = setInterval(updateEditableState, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  const fetchData = async () => {
    try {
      if (electionID && userId) {
        const { data } = await getCandidates(userId, {
          election_id: electionID,
        });
        if (data) setPosition(data.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [electionID, userId]);

  const removeLocally = (pending: NonNullable<PendingDelete>) => {
    const updated = [...position];
    if (pending.kind === "position") {
      updated.splice(pending.positionIndex, 1);
    } else {
      updated[pending.positionIndex] = {
        ...updated[pending.positionIndex],
        candidates: updated[pending.positionIndex].candidates.filter(
          (_: any, i: number) => i !== pending.candidateIndex,
        ),
      };
    }
    setPosition(updated);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const pos = position[pendingDelete.positionIndex];
    const candidate =
      pendingDelete.kind === "candidate"
        ? pos?.candidates[pendingDelete.candidateIndex]
        : null;

    // Not saved yet: nothing on the server to delete.
    if (
      pendingDelete.kind === "position"
        ? isUnsavedPosition(pos)
        : isUnsavedCandidate(candidate)
    ) {
      removeLocally(pendingDelete);
      setPendingDelete(null);
      return;
    }

    try {
      if (pendingDelete.kind === "position") {
        const { data } = await deletePosition(
          { election_id: electionID, name_of_position: pos.name_of_position },
          userId as string,
        );
        if (data) toast.success("Deleted Sucessfully");
      } else {
        const { data } = await deleteCandidate({
          election_id: electionID,
          name_of_position: pos.name_of_position,
          candidate_name: candidate.candidate_name,
        });
        if (data) toast.success("Deleted Successfully");
      }
      fetchData();
    } catch (error: any) {
      console.log(error);
      toast.error(errorMessage(error));
    } finally {
      setPendingDelete(null);
    }
  };

  if (isLoading || (!election && !error)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return <Card className="p-6 text-sm text-destructive">{error}</Card>;
  }

  const pendingPosition = pendingDelete
    ? position[pendingDelete.positionIndex]
    : null;
  const pendingName =
    pendingDelete?.kind === "candidate"
      ? pendingPosition?.candidates[pendingDelete.candidateIndex]
          ?.candidate_name || "this candidate"
      : pendingPosition?.name_of_position || "this position";

  return (
    <div className="space-y-6">
      {/* The ballot header exactly as voters will see it. */}
      <Header electionDetails={election} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={() => copyText(election?.election_id)}
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
        >
          Election ID:{" "}
          <span className="font-mono">{election?.election_id}</span>
          <Copy className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Copy election ID</span>
        </button>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              // Same links as before: Free Votar voters use the ballot link, others /vote.
              copyText(
                election?.type === "Free Votar"
                  ? `${window.location.origin}/freevotar/ballot?candidate=${electionID}`
                  : `${window.location.origin}/vote`,
              )
            }
          >
            <Link2 /> Copy election link
          </Button>
          <Button asChild>
            <Link
              href={`/preview-election/${election?.election_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye /> Preview ballot
            </Link>
          </Button>
        </div>
      </div>

      {!isEditable && (
        <VotingLockNotice endDate={election?.end_date} subject="the ballot" />
      )}

      <Body
        positions={position}
        setPositions={setPosition}
        electionId={electionID}
        isEditable={isEditable}
        // Shapes and behaviour this ballot has always used.
        newPosition={() => ({
          name_of_position: "",
          show_pictures: false,
          allow_abstain: false,
          candidates: [],
          election_id: electionID,
          __v: 0,
          author_id: userId,
        })}
        newCandidate={() => ({
          candidate_name: "",
          candidate_nickname: "",
          candidate_picture: null,
          media: "",
          votes: 0,
          _id: Date.now().toString(),
        })}
        storePictureBase64={false}
        clearedMedia=""
        onDeletePosition={(positionIndex) =>
          setPendingDelete({ kind: "position", positionIndex })
        }
        onDeleteCandidate={(positionIndex, candidateIndex) =>
          setPendingDelete({ kind: "candidate", positionIndex, candidateIndex })
        }
      />

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        icon={Trash2}
        destructive
        title={`Delete "${pendingName}"?`}
        description={
          pendingDelete?.kind === "position"
            ? "This removes the position and its candidates from the ballot. It can't be undone."
            : "This removes the candidate from the ballot. It can't be undone."
        }
        confirmLabel="Delete"
      />
    </div>
  );
};

export default BallotsPage;
