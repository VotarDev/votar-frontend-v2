import React from "react";
import withAuth from "@/hoc/withAuth";
import DashboardLayout from "@/src/components/DashboardLayout";
import ProtectedRoutes from "@/src/components/ProtectedRoutes";

const Participate = () => {
  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <div className="w-full h-[70vh] flex items-center justify-center">
          <p className="mt-4 text-gray-600 max-w-xl text-center">
            Coming soon! We are working hard to bring you the best experience
            for participating in elections. Stay tuned for updates!
          </p>
        </div>
      </DashboardLayout>
    </ProtectedRoutes>
  );
};

export default Participate;
