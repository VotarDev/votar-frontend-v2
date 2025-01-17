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
        <div className="pt-10 flex items-center gap-5">
          <div>
            <button className="w-40 h-12 flex items-center justify-center rounded outline-none border-none bg-blue-700 text-slate-200 font-semibold">
              Save Changes
            </button>
          </div>
          <div className="text-blue-700 text-lg font-semibold">Cancel</div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default EditCard;
