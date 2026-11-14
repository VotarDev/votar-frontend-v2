import React from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import VotarFormsComponent from "@/src/components/VotarFormsComponent";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const VotarForms = () => (
  <ProtectedRoutes>
    <DashboardLayout>
      <VotarFormsComponent />
    </DashboardLayout>
  </ProtectedRoutes>
);

export default VotarForms;
