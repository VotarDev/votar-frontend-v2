import React from "react";
import CouponSection from "@/src/components/Admin/CouponSection";
import AdminLayout from "@/src/components/Admin/AdminLayout";
import PageHeader from "@/src/components/shared/PageHeader";

const Coupon = () => (
  <AdminLayout>
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PageHeader title="Coupons" description="Discounts organisers can apply to their elections." />
      <CouponSection />
    </div>
  </AdminLayout>
);

export default Coupon;
