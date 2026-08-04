import CardsSection from "@/src/components/Admin/CardsSection";
import Tabs from "@/src/components/Admin/Tabs";
import React from "react";
import AdminLayout from "@/src/components/Admin/AdminLayout";

const Admin = () => {
  return (
    <AdminLayout>
      <main className="max-w-[1300px] mx-auto py-8 lg:py-[60px]">
        <CardsSection />
        <Tabs />
      </main>
    </AdminLayout>
  );
};

export default Admin;
