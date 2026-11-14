import React, { useEffect, useState } from "react";
import Header from "@/src/components/BallotPage/Header";
import PageLoader from "@/src/components/shared/PageLoader";
import { getElectionById } from "@/utils/api";
import { useRouter } from "next/router";
import { ElectionDetails } from "@/utils/types";
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

  if (!isClient) return null;
  if (isFecthElection) return <PageLoader message="Loading the election" />;

  // `isolate` keeps the header's branding layer (-z-10) above the background.
  return (
    <div className="isolate min-h-screen bg-slate-50">
      <Header electionDetails={elections} />
      <ElectionId
        electionId={electionId}
        electionName={elections?.name_of_election}
      />
    </div>
  );
};

export default AccessPage;
