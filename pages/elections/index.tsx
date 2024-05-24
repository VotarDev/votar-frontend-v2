import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import ElectionsComponent from "@/src/components/ElectionsComponent";

const Elections = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <ElectionsComponent />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Elections;
