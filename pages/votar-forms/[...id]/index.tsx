import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/src/components/DashboardLayout";
import CreatorForm from "@/src/components/VotarFormsComponent/CreatorForm";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import Header from "@/src/components/BallotPage/Header";
import PageHeader from "@/src/components/shared/PageHeader";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getElectionById } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { ElectionDetails } from "@/utils/types";

const CreateForm = () => {
  const router = useRouter();
  const [electionID, setElectionID] = useState("");
  const [isFetchElection, setIsFetchElection] = useState(false);
  const [election, setElection] = useState<ElectionDetails | null>(null);
  const { id } = router.query;

  // /votar-forms/{name}/{id}: the election id is the last segment.
  useEffect(() => {
    if (Array.isArray(id)) setElectionID(id[id.length - 1]);
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
    <ProtectedRoutes>
      <DashboardLayout>
        <div className="relative mx-auto w-full max-w-6xl space-y-6 pb-6 pt-2">
          <Link
            href="/votar-forms"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Votar Forms
          </Link>

          {isFetchElection || !election ? (
            <div className="space-y-4">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          ) : (
            <>
              {/* The election's branding, as voters will see it on the form. */}
              <Header electionDetails={election} />
              <PageHeader
                title={`${election.name_of_election} form`}
                description="Set up the voter registration form for this election and share its link."
              />
              <CreatorForm electionId={electionID} />
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default CreateForm;
