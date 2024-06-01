import React, { useState, useEffect, use } from "react";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import Header from "../BallotPage/Header";
import { useRouter } from "next/router";
import { getCandidates } from "@/utils/api";

const BallotsPage = () => {
  const users = useCurrentUser();
  const router = useRouter();
  const user = useUser();
  const [election, setElection] = useState<any>([]);
  const [electionID, setElectionID] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState<any>([]);

  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[1]);
    }
  }, [id, electionID]);
  console.log(electionID);

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
    try {
      const fetchData = async () => {
        const { data } = await getCandidates(USER_ID, electionID);
        if (data) {
          console.log(data);
        }
      };
      fetchData();
    } catch (e) {
      console.log(e);
    }
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
    </div>
  );
};

export default BallotsPage;
