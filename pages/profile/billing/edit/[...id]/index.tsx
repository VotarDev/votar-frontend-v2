import React from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import EditCardDetails from "@/src/components/CardDetailComponent/EditCardDetails";

import BillingAddress from "@/src/components/CardDetailComponent/AddCardComponent/BillingAddress";

const EditCard = () => {
  return (
    <div>
      <DashboardLayout>
        <EditCardDetails />
        <BillingAddress />
      </DashboardLayout>
    </div>
  );
};

export default EditCard;
