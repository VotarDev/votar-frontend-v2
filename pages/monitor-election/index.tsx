import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import MonitorAnElection from "@/src/components/MonitorAnElection";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const MonitorElection = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <h1 className="text-4xl">Monitor an election</h1>
        <MonitorAnElection />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default MonitorElection;
