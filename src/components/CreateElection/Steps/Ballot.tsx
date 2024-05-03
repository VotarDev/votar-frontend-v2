import React, { useState, useEffect } from "react";
import Header from "../../BallotPage/Header";
import Body from "../../BallotPage/Body";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { CircularProgress } from "@mui/material";

const Ballot = ({ positions, setPositions }: any) => {
  const users = useCurrentUser();
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

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
          const electionData = { election_id: electionId };
          const { data } = await getElectionById(electionData, USER_ID);
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

  return (
    <div className="my-[60px]">
      <Header electionDetails={election} />
      <Body
        setPositions={setPositions}
        positions={positions}
        electionDetails={election}
      />
    </div>
  );
};

export default Ballot;
