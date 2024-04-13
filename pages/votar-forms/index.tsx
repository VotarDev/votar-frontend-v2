import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import VotarFormsComponent from "@/src/components/VotarFormsComponent";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const VotarForms = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <h1 className="text-4xl">Votar Forms</h1>
        <VotarFormsComponent />
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default VotarForms;
