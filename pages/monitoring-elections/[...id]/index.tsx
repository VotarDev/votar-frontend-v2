import React, { useState, useEffect } from "react";
import PageMeta from "@/src/components/shared/PageMeta";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import ElectionTabs from "@/src/components/MonitoringElection/ElectionTabs";
import Header from "@/src/components/BallotPage/Header";
import { getElectionById } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { Skeleton } from "@/src/components/ui/skeleton";

/** Public live results for an election: /monitoring-elections/{id}/{totalNumbers|individualNumbers}. */
const MonitoringElections = () => {
  const router = useRouter();
  const [electionID, setElectionID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [election, setElection] = useState<any>(null);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [activeTabs, setActiveTabs] = useState<string>("");

  const { id } = router.query;

  useEffect(() => {
    if (Array.isArray(id)) setElectionID(id[0]);
  }, [id]);

  // Which link was shared decides total vs individual results.
  useEffect(() => {
    setActiveTabs(
      Array.isArray(id) && id.includes("individualNumbers")
        ? "individualNumbers"
        : "totalNumbers",
    );
  }, [id]);

  useEffect(() => {
    const getElection = async () => {
      if (!electionID) return;
      setIsLoading(true);
      // Use the signed-in token when there is one; never clear the header.
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await getElectionById({ election_id: electionID });
        if (data) setElection(data.data);
      } catch (e: any) {
        setError(e?.response?.data?.message || "");
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionID]);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    // `isolate` keeps the header's branding (drawn behind its parent) above
    // this page's background.
    <div className="isolate min-h-screen bg-slate-50 pb-16">
      {election?.name_of_election && (
        <PageMeta
          title={`${election.name_of_election}: live results`}
          description={`Follow the results of ${election.name_of_election} live on Votar.`}
          noIndex
        />
      )}
      {isLoading ? (
        <Skeleton className="h-56 w-full rounded-none" />
      ) : (
        <Header electionDetails={election} />
      )}

      <div className="mx-auto w-full max-w-6xl px-4 pt-4 lg:pt-10">
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
            {error}
          </p>
        ) : (
          // Some result views fetch once when they mount, so wait for the id.
          electionID && (
            <ElectionTabs
              electionId={electionID}
              activeTabs={activeTabs}
              setActiveTabs={setActiveTabs}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MonitoringElections;
