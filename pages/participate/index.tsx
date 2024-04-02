import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";

const Participate = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl">Paricipate in an Election</h1>
    </DashboardLayout>
  );
};

export default withAuth(Participate);
