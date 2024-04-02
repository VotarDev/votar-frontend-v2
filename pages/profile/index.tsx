import React, { useState } from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProfileHeader from "@/src/components/Profile/Header";
import ProfileBody from "@/src/components/Profile/Body";
import CardHeader from "@/src/components/CardDetailComponent/CardHeader";
import CardsList from "@/src/components/CardDetailComponent/CardsList";

const Profile = () => {
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
  return (
    <DashboardLayout>
      <ProfileHeader />
      <ProfileBody />
      <div>
        <CardHeader />
        <CardsList cards={cards} setNewCard={setCards} />
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Profile);
