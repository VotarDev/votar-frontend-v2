import React, { useState } from "react";
import ByNumbers from "../ByNumbers";
import ByLineChart from "../ByLineChart";
import ByBarChart from "../ByBarChart";
import BySubGroup from "../BySubGroup";

const ElectionTabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };
  return (
    <div>
      <div className="text-center text-blue-700 text-4xl font-semibold pt-[62px]">
        ELECTION RESULTS
      </div>
      <div className="flex justify-center items-center pt-[78px] gap-16">
        <div>
          <button
            className={`${
              activeTab == 1
                ? "bg-blue-700 border border-zinc-100 text-zinc-100"
                : "bg-white border border-slate-900 text-slate-900"
            } h-12 outline-none p-4  rounded-full  flex items-center justify-center text-xl`}
            onClick={() => handleTabClick(1)}
          >
            By Numbers
          </button>
        </div>
        <div>
          <button
            className={`${
              activeTab == 2
                ? "bg-blue-700 border border-zinc-100 text-zinc-100"
                : "bg-white border border-slate-900 text-slate-900"
            } h-12 outline-none p-4  rounded-full  flex items-center justify-center text-xl`}
            onClick={() => handleTabClick(2)}
          >
            By Line Chart
          </button>
        </div>
        <div>
          <button
            className={`${
              activeTab == 3
                ? "bg-blue-700 border border-zinc-100 text-zinc-100"
                : "bg-white border border-slate-900 text-slate-900"
            } h-12 outline-none p-4  rounded-full  flex items-center justify-center text-xl`}
            onClick={() => handleTabClick(3)}
          >
            By Bar Chart
          </button>
        </div>
        <div>
          <button
            className={`${
              activeTab == 4
                ? "bg-blue-700 border border-zinc-100 text-zinc-100"
                : "bg-white border border-slate-900 text-slate-900"
            } h-12 outline-none p-4  rounded-full  flex items-center justify-center text-xl`}
            onClick={() => handleTabClick(4)}
          >
            By Sub Group
          </button>
        </div>
      </div>
      <div className="pt-[78px]">
        <div className="w-full h-full flex flex-col items-center">
          {activeTab === 1 && <ByNumbers />}
          {activeTab === 2 && <ByLineChart />}
          {activeTab === 3 && <ByBarChart />}
          {activeTab === 4 && <BySubGroup />}
        </div>
      </div>
    </div>
  );
};

export default ElectionTabs;
