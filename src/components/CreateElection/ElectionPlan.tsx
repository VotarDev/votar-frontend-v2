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
      <div className="sm:text-xl font-bold text-base">
        Choose an Election type to Create an Election
      </div>
      <div className="flex justify-center items-stretch gap-8 mt-9 text-center lg:flex-row flex-col flex-wrap lg:flex-nowrap">
        {electionPlans.map((plans) => (
          <div
            key={plans.id}
            className="rounded-md border border-[#696969] lg:px-5 px-3 lg:w-[300px] mx-auto relative w-full"
          >
            <div className="lg:mt-11 mt-6 mb-9 max-w-[150px] mx-auto">
              <div className="bg-[#00122F] h-full relative before:content-[''] before:absolute before:w-full before:bg-[#5692F0] before:h-full before:top-2 before:left-2 before:-z-10 text-[#f3f3f3] px-3 py-2 text-sm font-semibold">
                {plans.plan}
              </div>
            </div>
            <div className="text-sm leading-[20px] mb-[80px]">{plans.desc}</div>
            <div className="absolute bottom-0 mb-4 left-1/2 -translate-x-1/2">
              <button
                className="w-[140px] h-[38px] bg-[#015CE9] text-white rounded outline-none"
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
