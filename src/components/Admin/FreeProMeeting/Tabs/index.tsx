import React, { useState } from "react";
import FreeVotarTable from "../FreeVotarTable";
import VotarCreditTable from "../votarCreditTable";

const tabs = [
  { id: 1, label: "Free Votar" },
  { id: 2, label: "Votar Credits" },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };
  return (
    <div>
      <div className="inline-flex w-full gap-1.5 rounded-lg bg-zinc-100 p-1.5 sm:w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 min-w-[110px] rounded-md px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
              activeTab === tab.id
                ? "bg-[#015CE9] text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 lg:mt-8 bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-5 px-4 lg:py-8 lg:px-9 relative">
        <div className="w-full h-full">
          {activeTab === 1 && <FreeVotarTable />}
          {activeTab === 2 && <VotarCreditTable />}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
