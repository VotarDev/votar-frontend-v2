import React from "react";
import AdminLayout from "../AdminLayout";
import Tabs from "./Tabs";
import FreeVotarTable from "./FreeVotarTable";
import Navigations from "./Navigations";
import { usePathname } from "next/navigation";

const FreeProMeeting = () => {
  return (
    <AdminLayout>
      <div className="bg-white">
        <div className="py-8 lg:py-[60px] max-w-[1300px] mx-auto">
          <div className="flex flex-col gap-5">
            <div className="text-xl lg:text-2xl font-bold">
              Free Votar Voting Power
            </div>
            <Navigations />
          </div>

          <div className="pt-8">
            <Tabs />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FreeProMeeting;
