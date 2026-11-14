import React, { useState, useEffect } from "react";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProfileBody from "@/src/components/Profile/Body";
import PaymentCards from "@/src/components/Profile/PaymentCards";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import PageHeader from "@/src/components/shared/PageHeader";
import { getCards } from "@/utils/api";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { useCurrentUserId } from "@/utils/hooks";
import eventEmitter from "@/utils/eventsEmitter";

const Profile = () => {
  const [debitCards, setDebitCards] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadCard, setLoadCard] = useState(false);
  const USER_ID = useCurrentUserId();

  useEffect(() => {
    if (!USER_ID) return;

    const fetchCards = async () => {
      const token = new Cookies().get("user-token");
      if (token) setAuthToken(token);
      setLoadCard(true);
      try {
        const response = await getCards(USER_ID);
        setDebitCards(response.data.data);
        setError(null);
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error?.message || error?.toString();
        // A failed request means there's no wallet yet (see PaymentCards).
        setError(message);
        console.log(message);
      } finally {
        setLoadCard(false);
      }
    };

    fetchCards();

    const handleCardAdded = () => {
      fetchCards();
    };

    eventEmitter.on("cardAdded", handleCardAdded);

    return () => {
      eventEmitter.off("cardAdded", handleCardAdded);
    };
  }, [USER_ID]);

  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <div className="mx-auto w-full max-w-6xl space-y-6 pb-24 pt-2">
          <PageHeader
            title="Profile"
            description="Manage your personal details and payment cards."
          />
          <ProfileBody />
          <PaymentCards
            debitCards={debitCards}
            error={error}
            userId={USER_ID}
            loadCard={loadCard}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Profile;
