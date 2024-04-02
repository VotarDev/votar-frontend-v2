import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import VotarFormsComponent from "@/src/components/VotarFormsComponent";

const VotarForms = () => {
  return (
    <DashboardLayout>
      <h1 className="text-4xl">Votar Forms</h1>
      <VotarFormsComponent />
    </DashboardLayout>
  );
};

export default withAuth(VotarForms);
