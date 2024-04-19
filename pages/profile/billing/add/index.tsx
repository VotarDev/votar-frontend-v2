import AddCardDetails from "@/src/components/CardDetailComponent/AddCardComponent/AddCardDetails";
import BillingAddressDetails from "@/src/components/CardDetailComponent/BillingAddressDetails";
import DashboardLayout from "@/src/components/DashboardLayout";
import React from "react";

const AddCard = () => {
  return (
    <div>
      <DashboardLayout>
        <AddCardDetails />
        <BillingAddressDetails />
      </DashboardLayout>
    </div>
  );
};

export default AddCard;
