import React, { useState, useEffect, use } from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProfileHeader from "@/src/components/Profile/Header";
import ProfileBody from "@/src/components/Profile/Body";
import CardHeader from "@/src/components/CardDetailComponent/CardHeader";
import CardsList from "@/src/components/CardDetailComponent/CardsList";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";
import { getCards } from "@/utils/api";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { useCurrentUser, useUser } from "@/utils/hooks";

const Profile = () => {
  const [debitCards, setDebitCards] = useState([]);
  const [error, setError] = useState(null);
  const users = useCurrentUser();
  const user = useUser();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const [cards, setCards] = useState([
    {
      id: 1,
      name: "Zenith bank",
      status: "Active",
      cardHolder: "Anthony Okon",
      cardNumber: "5-800-627-8372",
      expires: "12/2023",
    },
  ]);

  useEffect(() => {
    const fetchCards = async () => {
      const cookies = new Cookies();
      const token = cookies.get("user-token");
      if (token) {
        setAuthToken(token);
      }
      try {
        const response = await getCards(USER_ID);
        console.log(response.data);
        setDebitCards(response.data);
      } catch (error: any) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setError(message);

        console.log(message);
      }
    };

    fetchCards();
  }, []);
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <ProfileHeader />
        <ProfileBody />
        <div>
          <CardHeader />
          {/* <h1 className="text-xl">Coming Soon...</h1> */}
          <CardsList
            cards={cards}
            setNewCard={setCards}
            error={error}
            userId={USER_ID}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Profile;
