import { useState } from "react";
import AddCardDetails from "@/src/components/CardDetailComponent/AddCardComponent/AddCardDetails";
import BillingAddress from "@/src/components/CardDetailComponent/AddCardComponent/BillingAddress";
import BillingAddressDetails from "@/src/components/CardDetailComponent/BillingAddressDetails";
import DashboardLayout from "@/src/components/DashboardLayout";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCard } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { toast } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import eventEmitter from "@/utils/eventsEmitter";

const AddCard = () => {
  const { cardDetails, addressDetails } = useSelector(
    (state: any) => state.cardForm
  );
  const router = useRouter();
  const users = useCurrentUser();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const addCardDetailsHandler = async () => {
    try {
      setIsLoading(true);
      const cardDetail = {
        name: "",
        name_on_card: cardDetails.nameOnCard,
        default: cardDetails.defaultForApps,
        bank_name: cardDetails.cardName,
        card_Number: cardDetails.cardNumber,
        cvv: cardDetails.cvv,
        expire_date: cardDetails.expireDate,
        pseudo_card_number: "",
        billing_name: addressDetails.firstName,
        billing_address: addressDetails.addressLine1,
        billing_city: addressDetails.city,
        billing_state: addressDetails.state,
        billing_postal_code: addressDetails.zip,
        type: cardDetails.cardType,
      };
      console.log(cardDetail);
      const { data } = await addCard(cardDetail, USER_ID);
      if (data) {
        toast.success("Card Added Successfully");
        setIsLoading(false);
        console.log(data);
        eventEmitter.emit("cardAdded");
      }
    } catch (error: any) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setIsLoading(false);
      console.log(message);
    }
  };

  return (
    <div>
      <DashboardLayout>
        <AddCardDetails />
        <BillingAddress />
        <div className="pt-10 flex items-center gap-5">
          <div>
            <button
              onClick={addCardDetailsHandler}
              disabled={isLoading}
              className="w-40 h-12 flex items-center gap-2 justify-center rounded outline-none border-none bg-blue-700 text-slate-200 font-semibold"
            >
              {isLoading && (
                <CircularProgress size={20} style={{ color: "#ffffff" }} />
              )}
              Save Changes
            </button>
          </div>
          <button
            className="text-blue-700 text-lg font-semibold"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </button>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default AddCard;
