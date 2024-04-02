import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ElectionPlan from "@/src/components/CreateElection/ElectionPlan";

const CreateElection = () => {
  return (
    <DashboardLayout>
      <ElectionPlan />
    </DashboardLayout>
  );
};

export default withAuth(CreateElection);
