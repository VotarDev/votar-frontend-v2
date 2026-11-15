import React from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import MonitorAnElection from "@/src/components/MonitorAnElection";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const MonitorElection = () => (
  <ProtectedRoutes>
    <DashboardLayout>
      <MonitorAnElection />
    </DashboardLayout>
  </ProtectedRoutes>
);

export default MonitorElection;
