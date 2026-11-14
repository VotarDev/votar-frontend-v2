import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Copy, Eye, Link2, Lock } from "lucide-react";
import VotingLockNotice from "@/src/components/shared/VotingLockNotice";
import Cookies from "universal-cookie";
import Header from "../../BallotPage/Header";
import Body from "../../BallotPage/Body";
import { Button } from "@/src/components/ui/button";
import { useCurrentUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { parseElectionDate } from "@/utils/electionTime";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Card } from "@/src/components/ui/card";
import type { Position } from "@/utils/types";

const emptyPosition = (electionId: string): Position => ({
  name_of_position: "",
  show_pictures: true,
  allow_abstain: true,
  candidates: [],
  election_id: electionId,
});

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy text:", error);
    toast.error("Copy operation failed. Please try again.");
  }
};

const Ballot = ({ positions, setPositions, onEditableChange }: any) => {
  const users = useCurrentUser();
  const [election, setElection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [targetDateTime, setTargetDateTime] = useState<Date | null>(null);
  const [isEditable, setIsEditable] = useState(true);

  // Lets the create page skip ballot validation once the election has started
  // and the ballot can no longer be edited.
  useEffect(() => {
    onEditableChange?.(isEditable);
  }, [isEditable]);

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      // Email sign-in keeps the token on the user; everyone else (e.g. Google
      // sign-in) has it in the cookie. Never clear the shared header here.
      const token =
        users?.data?.data?.cookie || new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const electionId = localStorage.getItem("ElectionId");
        const { data } = await getElectionById({ election_id: electionId });
        if (data) {
          setElection(data.data);

          const start = parseElectionDate(data.data.start_date);
          if (start) {
            setTargetDateTime(start);
          } else {
            console.error("Invalid start_date format:", data.data.start_date);
          }

          // Keep a ballot the user is still filling in (e.g. after visiting
          // Details); otherwise start with one empty position.
          const hasDraftForElection =
            positions.length > 0 &&
            positions[0]?.election_id === data.data.election_id;
          if (!hasDraftForElection) {
            setPositions([emptyPosition(data.data.election_id)]);
          }
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.message ||
            "We couldn't load this election. Please try again.",
        );
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, []);

  useEffect(() => {
    if (targetDateTime) {
      const updateEditableState = () => {
        const now = new Date();
        setIsEditable(now < targetDateTime);
      };

      updateEditableState();
      const interval = setInterval(updateEditableState, 1000);
      return () => clearInterval(interval);
    }
  }, [targetDateTime]);

  if (isLoading) {
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
                  ? `${window.location.origin}/freevotar/ballot?candidate=${election?.election_id}`
                  : `${window.location.origin}/vote`
              )
            }
          >
            <Link2 /> Copy election link
          </Button>
          <Button asChild>
            <Link
              href={`/cast-votes/${election?.election_id}`}
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
        setPositions={setPositions}
        positions={positions}
        electionId={election?.election_id}
        isEditable={isEditable}
      />
    </div>
  );
};

export default Ballot;
