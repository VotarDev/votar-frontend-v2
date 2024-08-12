import React, { useState, useEffect } from "react";
import Activities from "../Activities";
import VotarCredits from "../VotarCredits";
import FreeVotar from "../FreeVotar";
import VotarPro from "../VotarPro";
import VotarMeeting from "../VotarMeeting";
import setAuthToken from "@/utils/setAuthToken";
import { getAdminVotarPage, getAllElectionsAdmin } from "@/utils/api";
import Cookies from "universal-cookie";
import { set } from "lodash";
import { CircularProgress } from "@mui/material";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [elections, setElections] = useState([]);
  const [isLoadingElections, setIsLoadingElections] = useState(false);
  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };

  useEffect(() => {
    const getActivities = async () => {
      setIsLoadingElections(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);
      try {
        const { data } = await getAllElectionsAdmin();
        if (data) {
          setElections(data.data);
          setIsLoadingElections(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoadingElections(false);
      }
    };

    getActivities();
  }, []);

  if (isLoadingElections)
    return (
      <div className="text-center mt-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div className="bg-white my-8 shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] lg:p-10 p-4">
      <div className=" bg-neutral-100 rounded-lg px-4 py-2 max-w-[709px] ">
        <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 relative z-10 justify-center items-center py-2.5 text-center font-semibold overflow-x-auto">
          <div
            className="absolute bg-blue-700 w-[calc(100%/5)] h-[70%] left-0 duration-150 -z-10 rounded hidden lg:block"
            style={{
              left: `calc((100%/5) * ${activeTab - 1})`,
            }}
          ></div>
          <div
            className="absolute bg-blue-700 w-full h-[calc(100%/5)] left-0 duration-150 -z-10 rounded lg:hidden block top-0"
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
            Activities
          </div>
          <div
            className={`cursor-pointer p-2  w-full ${
              activeTab === 2 ? "text-neutral-100 " : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(2)}
          >
            Votar Credits
          </div>
          <div
            className={`cursor-pointer p-2  w-full ${
              activeTab === 3 ? "text-neutral-100 " : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(3)}
          >
            Free Votar
          </div>
          <div
            className={`cursor-pointer p-2  w-full ${
              activeTab === 4 ? "text-neutral-100 " : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(4)}
          >
            Votar Pro
          </div>
          <div
            className={`cursor-pointer p-2  w-full ${
              activeTab === 5 ? "text-neutral-100 " : "text-neutral-400"
            }`}
            onClick={() => handleTabClick(5)}
          >
            Votar Meetings
          </div>
        </div>
      </div>
      <div className="mt-4 lg:p-4 p-0 relative">
        <div className="w-full h-full">
          {elections && elections.length > 0 && (
            <>
              {activeTab === 1 && <Activities elections={elections} />}
              {activeTab === 2 && <VotarCredits />}
              {activeTab === 3 && <FreeVotar />}
              {activeTab === 4 && <VotarPro />}
              {activeTab === 5 && <VotarMeeting />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
