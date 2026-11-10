import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { BarChart3, Eye, Users } from "lucide-react";
import { useCurrentUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { getElectionById } from "@/utils/api";
import { Card } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import MonitoringCard from "../../ElectionsPage/MonitoringCard";

interface MonitorElectionProps {
  /** The election to monitor; the create flow passes none and uses its saved draft. */
  electionId?: string;
}

/** Shareable live-results links. Used by both the create and the edit election flows. */
const MonitorElection = ({ electionId }: MonitorElectionProps) => {
  const users = useCurrentUser();
  const [election, setElection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getElection = async () => {
      // Email sign-in keeps the token on the user; everyone else (e.g. Google
      // sign-in) has it in the cookie. Never clear the shared header here.
      const token = users?.data?.data?.cookie || new Cookies().get("user-token");
      if (token) setAuthToken(token);
      const id = electionId || localStorage.getItem("ElectionId");
      if (!id) return;
      setIsLoading(true);
      try {
        const { data } = await getElectionById({ election_id: id });
        if (data) setElection(data.data);
      } catch (e: any) {
        console.log(e?.response?.data?.message);
      } finally {
        setIsLoading(false);
      }
    };
    getElection();
  }, [electionId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    );
  }

  const base = `https://www.votar.ng/monitoring-elections/${election?.election_id}`;

  return (
    <div className="space-y-6">
      <Card className="flex items-center gap-3 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
          <Eye className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Monitoring
          </p>
          <h2 className="truncate font-semibold text-foreground">
            {election?.name_of_election || "Election"}
          </h2>
        </div>
      </Card>

      <div>
        <h3 className="text-base font-semibold text-foreground">
          Real-time election monitoring
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Access live election data and analytics through these monitoring
          links. Share them with authorised personnel for transparent election
          oversight.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MonitoringCard
          title="Total numbers"
          description="View aggregated election statistics, total vote counts, and overall participation metrics in real-time."
          url={`${base}/totalNumbers`}
          icon={BarChart3}
        />
        <MonitoringCard
          title="Individual numbers"
          description="Access detailed individual voting data, candidate-specific metrics, and granular election analytics."
          url={`${base}/individualNumbers`}
          icon={Users}
          tone="bg-emerald-50 text-emerald-600"
        />
      </div>
    </div>
  );
};

export default MonitorElection;
