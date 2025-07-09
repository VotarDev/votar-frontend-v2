import AdminLayout from "@/src/components/Admin/AdminLayout";
import Navigations from "@/src/components/Admin/FreeProMeeting/Navigations";
import VotarProTable from "@/src/components/Admin/FreeProMeeting/VotarProTable";
import React, { useState } from "react";

const Pro = () => {
  return (
    <AdminLayout>
      <div className="bg-white">
        <div className="py-[60px] max-w-[1300px] mx-auto ">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              Votar Pro Access Request & Management Panel
            </div>
            <Navigations />
          </div>
          <div className="mt-14 bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-8 px-9 relative">
            <VotarProTable />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Pro;
