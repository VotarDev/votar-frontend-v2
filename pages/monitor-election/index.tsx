import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import MonitorAnElection from "@/src/components/MonitorAnElection";

const MonitorElection = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl">Monitor an election</h1>
      <MonitorAnElection />
    </DashboardLayout>
  );
};

export default withAuth(MonitorElection);
