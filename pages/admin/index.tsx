import AdminHeader from "@/src/components/Admin/AdminHeader";
import CardsSection from "@/src/components/Admin/CardsSection";
import Tabs from "@/src/components/Admin/Tabs";
import React from "react";
import AdminLayout from "@/src/components/Admin/AdminLayout";

const Admin = () => {
  return (
    <AdminLayout>
      <main className="lg:block flex">
        <div className="lg:max-w-[1316px] lg:mx-auto max-w-full w-full flex-1">
          <CardsSection />
          <Tabs />
        </div>
      </main>
    </AdminLayout>
  );
};

export default Admin;
