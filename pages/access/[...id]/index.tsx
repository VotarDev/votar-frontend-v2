import React, { useEffect, useState } from "react";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";
import { getElectionById } from "@/utils/api";
import { useRouter } from "next/router";
import { ElectionDetails } from "@/utils/types";
import { get } from "lodash";
import ElectionId from "@/src/components/VoteAccess/ElectionId";

const AccessPage = () => {
  const router = useRouter();
  const [electionId, setElectionId] = useState("");
  const [elections, setElections] = useState<ElectionDetails | null>(null);
  const [isFecthElection, setIsFetchElection] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      setElectionId(id[0]);
    }
  }, [id]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const getElection = async () => {
      setIsFetchElection(true);
      try {
        const electionData = { election_id: electionId };
        if (electionId) {
          const { data } = await getElectionById(electionData);
          if (data) {
            setElections(data.data);
            setIsFetchElection(false);
          }
        }
      } catch (error: any) {
        console.log(error);
        setIsFetchElection(false);
      }
    };
    getElection();
  }, [electionId]);

  return (
    <>
      {isClient && (
        <div>
          {isFecthElection ? (
            <div className="mt-10 text-center">
              <CircularProgress size={30} style={{ color: "#015CE9" }} />
            </div>
          ) : (
            <div>
              <div>
                <Header electionDetails={elections} />
              </div>
              <div>
                <ElectionId electionId={electionId} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AccessPage;
