import React, { useState } from "react";
import FreeVotarTable from "../FreeVotarTable";
import VotarCreditTable from "../votarCreditTable";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };
  return (
    <div>
      <div className="pt-2 max-w-[238px] ">
        <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 relative z-10 justify-center items-center py-2.5 text-center font-semibold overflow-x-auto">
          <div
            className="absolute bg-blue-700 w-[calc(100%/2)] h-[70%] left-0 duration-150 -z-10 rounded hidden lg:block"
            style={{
              left: `calc((100%/2) * ${activeTab - 1})`,
            }}
          ></div>
          <div
            className="absolute bg-blue-700 w-full h-[calc(100%/2)] left-0 duration-150 -z-10 rounded lg:hidden block top-0"
            style={{
              top: `calc((100%/5) * ${activeTab - 1})`,
            }}
          ></div>
          <div
            className={`cursor-pointer p-2 w-full   ${
              activeTab === 1 ? "text-neutral-100 " : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(1)}
          >
            Free Votar
          </div>
          <div
            className={`cursor-pointer p-2  w-full ${
              activeTab === 2 ? "text-neutral-100 " : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Votar Credits
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-8 px-9 relative">
        <div className="w-full h-full">
          {activeTab === 1 && <FreeVotarTable />}
          {activeTab === 2 && <VotarCreditTable />}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
