import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/src/components/DashboardLayout";
import ResponseTable from "@/src/components/VotarFormsComponent/Response";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import Header from "@/src/components/BallotPage/Header";
import PageHeader from "@/src/components/shared/PageHeader";
import { Skeleton } from "@/src/components/ui/skeleton";
import { ElectionDetails } from "@/utils/types";
import { getElectionById } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";

const Responses = () => {
  const router = useRouter();
  const [electionID, setElectionID] = useState("");
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const [isFetchElection, setIsFetchElection] = useState(false);

  // /votar-forms/responses/{id}
  const { id } = router.query;
  useEffect(() => {
    if (Array.isArray(id)) setElectionID(id[0]);
  }, [id]);

  useEffect(() => {
    const getElection = async () => {
      if (!electionID) return;
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      setIsFetchElection(true);
      try {
        const { data } = await getElectionById({ election_id: electionID });
        if (data) setElection(data.data);
      } catch (e: any) {
        console.log(e);
      } finally {
        setIsFetchElection(false);
      }
    };
    getElection();
  }, [electionID]);

  return (
    <DashboardLayout>
      <ProtectedRoutes>
        <div className="relative mx-auto w-full max-w-6xl space-y-6 pb-6 pt-2">
          {election ? (
            <Link
              href={`/votar-forms/${election.name_of_election}/${electionID}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to form
            </Link>
          ) : (
            <Link
              href="/votar-forms"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Votar Forms
            </Link>
          )}

          {isFetchElection && !election ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            election && <Header electionDetails={election} />
          )}

          <PageHeader
            title="Responses"
            description="Review who has filled in the form, then send them to your election or export them."
          />
          <ResponseTable />
        </div>
      </ProtectedRoutes>
    </DashboardLayout>
  );
};

export default Responses;
