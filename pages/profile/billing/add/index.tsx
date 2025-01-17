import AddCardDetails from "@/src/components/CardDetailComponent/AddCardComponent/AddCardDetails";
import BillingAddress from "@/src/components/CardDetailComponent/AddCardComponent/BillingAddress";
import BillingAddressDetails from "@/src/components/CardDetailComponent/BillingAddressDetails";
import DashboardLayout from "@/src/components/DashboardLayout";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

const AddCard = () => {
  const { cardDetails, addressDetails } = useSelector(
    (state: any) => state.cardForm
  );
  console.log("Card Details:", cardDetails);
  console.log("Address Details:", addressDetails);
  return (
    <div>
      <DashboardLayout>
        <AddCardDetails />
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

export default AddCard;
