import React from "react";
import AdminLayout from "@/src/components/Admin/AdminLayout";
import PlanSwitcher from "@/src/components/Admin/FreeProMeeting/PlanSwitcher";
import OrganisersTable from "@/src/components/Admin/FreeProMeeting/OrganisersTable";
import PageHeader from "@/src/components/shared/PageHeader";
import { Card } from "@/src/components/ui/card";

/** Organisers running Votar Pro elections. */
const Pro = () => (
  <AdminLayout>
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader
        title="Votar Pro"
        description="Organisers with Votar Pro elections. Open one to publish their elections or turn on SMS."
      />
      <PlanSwitcher />
      <Card className="overflow-hidden">
        <OrganisersTable plan="votar-pro" />
      </Card>
    </div>
  </AdminLayout>
);

export default Pro;
