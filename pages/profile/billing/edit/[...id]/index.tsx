import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/src/components/DashboardLayout";
import PageHeader from "@/src/components/shared/PageHeader";
import ActionBar from "@/src/components/shared/ActionBar";
import CardForm from "@/src/components/CardDetailComponent/CardForm";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  resetForm,
  updateAddressDetails,
  updateCardDetails,
} from "@/redux/features/cardDetailsForm/cardDetailsSlice";
import { getCards } from "@/utils/api";
import { useCurrentUserId } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";

const EditCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const USER_ID = useCurrentUserId();
  const [isLoading, setIsLoading] = useState(true);
  const [last4, setLast4] = useState("");
  // The route is /profile/billing/edit/{position in the list, from 1}.
  const position = Number((router.query.id as string[] | undefined)?.[0]);

  // Pre-fill the form with the stored card.
  useEffect(() => {
    if (!USER_ID || !router.isReady) return;
    dispatch(resetForm());
    const load = async () => {
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await getCards(USER_ID);
        const card = data?.data?.card_stored?.[position - 1];
        if (card) {
          setLast4(card.pseudo_card_number?.slice(-4) || "");
          dispatch(
            updateCardDetails({
              nameOnCard: card.name_on_card || "",
              cardName: card.bank_name || "",
              cardType: card.type || "",
              defaultForApps: !!card.default,
            }),
          );
          dispatch(
            updateAddressDetails({
              firstName: card.billing_name || "",
              addressLine1: card.billing_address || "",
              city: card.billing_city || "",
              state: card.billing_state || "",
              zip: card.billing_postal_code || "",
            }),
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [USER_ID, router.isReady, position, dispatch]);

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
            title="Edit card"
            description={
              last4
                ? `Update the details for the card ending in ${last4}.`
                : "Update your card and billing address."
            }
          />
        </div>
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : (
          <CardForm mode="edit" />
        )}
      </div>
      <ActionBar>
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-end gap-3">
          {/* There's no endpoint for updating a card yet, so Save stays off. */}
          <span className="mr-auto text-xs text-muted-foreground">
            Saving card changes isn&apos;t available yet.
          </span>
          <Button
            variant="outline"
            className="h-11"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
          <Button className="h-11" disabled>
            Save changes
          </Button>
        </div>
      </ActionBar>
    </DashboardLayout>
  );
};

export default EditCard;
