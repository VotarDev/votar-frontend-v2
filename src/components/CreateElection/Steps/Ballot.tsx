import React, { useState, useEffect, useRef } from "react";
import Header from "../../BallotPage/Header";
import Body from "../../BallotPage/Body";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import { AiOutlineLink, AiOutlineEye } from "react-icons/ai";
import Link from "next/link";
import toast from "react-hot-toast";
import { IoCopy } from "react-icons/io5";

const Ballot = ({ positions, setPositions }: any) => {
  const users = useCurrentUser();
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [electionId, setElectionId] = useState<string | null>("");
  const [error, setError] = useState("");
  const textRef = useRef<HTMLElement | null>(null);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    const getElection = async () => {
      setIsLoading(true);
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      try {
        if (typeof window !== "undefined") {
          const electionId = localStorage.getItem("ElectionId");
          setElectionId(electionId);
          const electionData = { election_id: electionId };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            setPositions([
              {
                name_of_position: "",
                show_pictures: true,
                allow_abstain: true,
                candidates: [],
                election_id: data.data.election_id,
              },
            ]);
            setIsLoading(false);
          }
        }
      } catch (e: any) {
        setError(e?.response?.data?.message);
        console.log(e?.response?.data?.message);
      }
    };
    getElection();
  }, []);

  if (isLoading) {
    return (
      <div className="my-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }
  if (error) {
    return <div className="my-10">{error}</div>;
  }

  const handleCopyClick = async () => {
    if (textRef.current) {
      const selectedText = textRef.current.innerText;
      try {
        await navigator.clipboard.writeText(selectedText);

        toast.success("Copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text:", error);
        toast.error("Copy operation failed. Please try again.");
      }
    }
  };

  const handleCopy = async () => {
    const url =
      window.location.origin + "/ballot?candidate=" + election?.election_id;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Copy operation failed. Please try again.");
    }
  };

  console.log(electionId, "election");
  return (
    <div className="my-[60px]">
      <Header electionDetails={election} />
      <div className="lg:mt-10 mt-5 flex lg:justify-end items-center lg:gap-10 gap-2 flex-wrap justify-center">
        <div className="flex items-center gap-4 lg:text-xl text-base text-blue-700 font-semibold">
          <div>
            Election ID: <span ref={textRef}>{election?.election_id}</span>
          </div>
          <div onClick={handleCopyClick} className="cursor-pointer">
            <IoCopy />
          </div>
        </div>
        <div className="flex lg:gap-7 gap-2 flex-wrap justify-center">
          <div>
            <button
              onClick={handleCopy}
              className="lg:w-56 w-full lg:h-14 h-10 bg-zinc-100 rounded-lg flex justify-center items-center gap-2.5 lg:text-xl text-xs text-blue-700 font-semibold p-4 lg:p-0"
            >
              <span>
                <AiOutlineLink />
              </span>
              Copy Election Link
            </button>
          </div>
          <div>
            <Link
              href={`/cast-votes/${election?.election_id}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <button className="lg:w-48 lg:h-14 h-10 w-full bg-blue-700 rounded-lg border border-zinc-100 justify-center items-center gap-4 flex lg:text-xl text-xs p-4 font-semibold text-zinc-100 lg:p-0">
                <span>
                  <AiOutlineEye />
                </span>
                Preview Ballot
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Body
        setPositions={setPositions}
        positions={positions}
        electionDetails={election}
        electionId={election?.election_id}
      />
    </div>
  );
};

export default Ballot;
