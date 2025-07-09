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
        <div className="py-[60px] max-w-[1300px] mx-auto ">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">Free Votar Voting Power</div>
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
