import React, { use, useEffect } from "react";
import AdminHeader from "../AdminHeader";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Login from "../AdminLogin";
import { useRouter } from "next/router";
import { ro } from "date-fns/locale";

const AdminLayout = ({ children }: any) => {
  const { available, loading, tested } = useSelector(
    (state: RootState) => state.admin
  );
  const router = useRouter();

  useEffect(() => {
    if (!available && !tested) router.push("/admin/login");
  }, [available, loading, tested]);

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
