import React, { useState } from "react";
import { electionPlans } from "@/utils/util";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selected_plan } from "@/redux/features/votarPlan/votarPlanSlice";

const ElectionPlan = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handlePlan = (plans: string) => {
    router.push("/create-election/create");
    localStorage.setItem("votar plan", JSON.stringify(plans));
    dispatch(selected_plan(plans));
  };
  return (
    <div className="mt-5 lg:px-3 px-0">
      <div className="md:text-4xl font-bold text-2xl text-gray-900 leading-tight">
        Choose an Election type to Create an Election
      </div>
      <div className="mt-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {electionPlans.map((plans) => (
          <div
            key={plans.id}
            className="group rounded-md border border-[#696969] hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg relative min-h-[320px] flex flex-col"
          >
            <div className="lg:mt-11 mt-6 mb-9 max-w-[160px] mx-auto">
              <div className="bg-[#00122F] h-full relative before:content-[''] before:absolute before:w-full before:bg-[#5692F0] before:h-full before:top-2 before:left-2 before:-z-10 text-[#f3f3f3] px-3 py-2 text-sm font-semibold">
                {plans.plan}
              </div>
            </div>
            <div className="px-6 flex-1">
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {plans.desc}
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                className="w-full h-10 bg-[#015CE9] hover:bg-[#0146c7] text-white rounded-md outline-none transition-colors duration-200 font-medium text-sm"
                onClick={() => handlePlan(plans.plan)}
              >
                {plans.btnText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectionPlan;
