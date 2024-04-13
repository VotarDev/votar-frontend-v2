import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ElectionPlan from "@/src/components/CreateElection/ElectionPlan";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const CreateElection = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <ElectionPlan />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default CreateElection;
