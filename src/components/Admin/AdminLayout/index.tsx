import React from "react";
import AdminHeader from "../AdminHeader";

const AdminLayout = ({ children }: any) => {
  return (
    <div>
      <div>
        <AdminHeader />
      </div>
      <div className="ml-14 px-4 lg:ml-0 lg:px-0">{children}</div>
    </div>
  );
};

export default AdminLayout;
