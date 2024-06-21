import React, { useState, useEffect } from "react";

import ElectionTabs from "@/src/components/MonitoringElection/ElectionTabs";
import { useRouter } from "next/router";
import { getElectionById } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";

const MonitoringElections = () => {
  const users = useCurrentUser();
  const user = useUser();
  const router = useRouter();
  const [electionID, setElectionID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [election, setElection] = useState<any>([]);
  const [votingData, setVotingData] = useState<any>(null);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (idType) {
      setElectionID(idType[0]);
    }
  }, [id, electionID]);

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
    setIsClient(true);
  }, []);

  if (isLoading) {
    return (
      <div className="my-10 text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }
  return (
    <div>
      {isClient && (
        <div>
          <Header electionDetails={election} />
          <ElectionTabs electionId={electionID} />
        </div>
      )}
    </div>
  );
};

export default MonitoringElections;
