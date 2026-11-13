import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { skipToken } from "@reduxjs/toolkit/dist/query/react/index.js";
import { Button } from "@/src/components/ui/button";
import PageHeader from "@/src/components/shared/PageHeader";
import { useGetElectionsQuery } from "@/redux/api/electionsApi";
import DashboardStats from "./DashboardStats";
import RecentElections from "./RecentElections";

interface DashboardOverviewProps {
  userId?: string;
}

const DashboardOverview = ({ userId }: DashboardOverviewProps) => {
  const {
    data: elections = [],
    isLoading,
    isError,
    refetch,
  } = useGetElectionsQuery(userId ?? skipToken, {
    // Elections are still created through the old axios calls, which don't
    // update this cache, so refetch on every visit (cached data shows meanwhile).
    refetchOnMountOrArgChange: true,
  });

  // Until the user id is known (e.g. right after a Google sign-in), show the
  // loading state rather than an empty dashboard.
  const isPending = !userId || isLoading;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-24 pt-2 lg:space-y-8">
      <PageHeader
        title="Dashboard"
        description="An overview of the elections you've created."
        actions={
          <Button asChild>
            <Link href="/create-election">
              <Plus /> Create election
            </Link>
          </Button>
        }
      />
      {!isError && <DashboardStats elections={elections} isLoading={isPending} />}
      <RecentElections
        elections={elections}
        isLoading={isPending}
        isError={isError}
        onRetry={refetch}
      />
    </div>
  );
};

export default DashboardOverview;
