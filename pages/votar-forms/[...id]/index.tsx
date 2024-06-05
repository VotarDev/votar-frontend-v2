import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/src/components/DashboardLayout";
import withAuth from "@/hoc/withAuth";
import ElectionHeader from "@/src/components/VotarFormsComponent/ElectionHeader";
import CreatorForm from "@/src/components/VotarFormsComponent/CreatorForm";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { getElectionById } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { ElectionDetails } from "@/utils/types";
import Header from "@/src/components/BallotPage/Header";
import { CircularProgress } from "@mui/material";

const CreateForm = () => {
  const router = useRouter();
  const users = useCurrentUser();
  const user = useUser();
  const [electionName, setElectionName] = useState("");
  const [electionID, setElectionID] = useState("");
  const [isFecthElection, setIsFetchElection] = useState(false);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  useEffect(() => {
    if (typeof idType === "string") {
      setElectionName(idType);
    } else if (Array.isArray(idType)) {
      setElectionName(idType[0]);
      setElectionID(idType[1]);
    } else {
      console.log("ID is undefined");
    }
  }, [id, electionID]);

  console.log(electionID);

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
        if (electionID) {
          // const electionId = localStorage.getItem("ElectionId");
          const electionData = { election_id: electionID };
          const { data } = await getElectionById(electionData);
          if (data) {
            setElection(data.data);
            setIsFetchElection(false);
          }
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getElection();
  }, [electionID]);

  console.log(electionID);
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        {isFecthElection ? (
          <div className="mt-10">
            <CircularProgress size={30} style={{ color: "#015CE9" }} />
          </div>
        ) : (
          <div>
            <div>
              <Header electionDetails={election} />
            </div>
            <CreatorForm electionId={electionID} />
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default CreateForm;
