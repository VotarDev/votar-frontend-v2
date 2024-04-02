import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";

const Elections = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl">Elections</h1>
    </DashboardLayout>
  );
};

export default withAuth(Elections);
