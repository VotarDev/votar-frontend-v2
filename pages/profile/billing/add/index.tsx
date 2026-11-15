import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardLayout from "@/src/components/DashboardLayout";
import PageHeader from "@/src/components/shared/PageHeader";
import ActionBar from "@/src/components/shared/ActionBar";
import CardForm, {
  CardFormErrors,
  validateCardForm,
} from "@/src/components/CardDetailComponent/CardForm";
import { Button } from "@/src/components/ui/button";
import { resetForm } from "@/redux/features/cardDetailsForm/cardDetailsSlice";
import { addCard } from "@/utils/api";
import { useCurrentUserId } from "@/utils/hooks";
import eventEmitter from "@/utils/eventsEmitter";
import { scrollToTop } from "@/utils/scrollToTop";

const AddCard = () => {
  const { cardDetails, addressDetails } = useSelector(
    (state: any) => state.cardForm,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const USER_ID = useCurrentUserId();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CardFormErrors>({});

  // Start with an empty form (the edit page shares the same slice).
  useEffect(() => {
    dispatch(resetForm());
  }, [dispatch]);

  const addCardDetailsHandler = async () => {
    const found = validateCardForm(cardDetails, addressDetails);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Fill in the required fields");
      scrollToTop();
      return;
    }
    try {
      setIsLoading(true);
      // Same payload as before.
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
      const { data } = await addCard(cardDetail, USER_ID as string);
      if (data) {
        toast.success("Card Added Successfully");
        eventEmitter.emit("cardAdded");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || String(error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6 pt-2">
        <div className="space-y-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to profile
          </Link>
          <PageHeader
            title="Add new card"
            description="Save a card for checkout, auto-renewals and top-ups."
          />
        </div>
        <CardForm mode="add" errors={errors} />
      </div>
      <ActionBar>
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          <Button
            variant="outline"
            className="h-11"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
          <Button
            className="h-11"
            onClick={addCardDetailsHandler}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            Save card
          </Button>
        </div>
      </ActionBar>
    </DashboardLayout>
  );
};

export default AddCard;
