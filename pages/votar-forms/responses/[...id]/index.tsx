import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/src/components/DashboardLayout";
import withAuth from "@/hoc/withAuth";
import ElectionHeader from "@/src/components/VotarFormsComponent/ElectionHeader";
import ResponseTable from "@/src/components/VotarFormsComponent/Response";
import { ElectionDetails } from "@/utils/types";
import { getElectionById } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import Header from "@/src/components/BallotPage/Header";

const Responses = () => {
  const router = useRouter();
  const [electionID, setElectionID] = useState("");
  const [elections, setElections] = useState<ElectionDetails | null>(null);
  const [isFecthElection, setIsFetchElection] = useState(false);
  const users = useCurrentUser();
  const user = useUser();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const { id } = router.query;
  useEffect(() => {
    if (id) {
      setElectionID(id[0]);
    }
  }, [id]);

  useEffect(() => {
    const getElection = async () => {
      if (users?.data) {
        setAuthToken(users.data.data.cookie);
      } else {
        if (typeof window !== "undefined") {
          const tokenLocal = localStorage.getItem("token");
          setAuthToken(tokenLocal);
        }
      }
      setIsFetchElection(true);
      try {
        if (typeof window !== "undefined") {
          const electionId = localStorage.getItem("ElectionId");
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData, USER_ID);
          if (data) {
            setElections(data.data);
            setIsFetchElection(false);
          }
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getElection();
  }, [electionID]);

  return (
    <DashboardLayout>
      {isFecthElection ? (
        <div className="mt-10">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      ) : (
        <div>
          <div>
            <Header electionDetails={elections} />
          </div>
          <ResponseTable />
        </div>
      )}
    </DashboardLayout>
  );
};

export default Responses;
