import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const Elections = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <h1 className="text-4xl">Elections</h1>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Elections;
