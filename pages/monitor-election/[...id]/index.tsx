import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/src/components/DashboardLayout";
import PageHeader from "@/src/components/shared/PageHeader";
import MonitorElection from "@/src/components/CreateElection/Steps/MonitorElection";

/** Live monitoring links for one election: /monitor-election/{name}/{id}. */
const MonitorAnElectionDetails = () => {
  const router = useRouter();
  const [electionId, setElectionId] = useState("");

  const { id } = router.query;
  useEffect(() => {
    if (Array.isArray(id)) setElectionId(id[id.length - 1]);
  }, [id]);

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-6 pt-2">
        <Link
          href="/monitor-election"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Monitor an election
        </Link>
        <PageHeader
          title="Monitoring links"
          description="Share these links with observers to follow the results live."
        />
        {/* Same links card as the Monitor step in the election flows. */}
        {electionId && <MonitorElection electionId={electionId} />}
      </div>
    </DashboardLayout>
  );
};

export default MonitorAnElectionDetails;
