import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const Participate = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <h1 className="text-4xl">Paricipate in an Election</h1>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Participate;
