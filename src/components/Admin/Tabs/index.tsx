import React, { useState, useEffect } from "react";
import Activities from "../Activities";
import VotarCredits from "../VotarCredits";
import FreeVotar from "../FreeVotar";
import VotarPro from "../VotarPro";
import VotarMeeting from "../VotarMeeting";
import setAuthToken from "@/utils/setAuthToken";
import { getAdminVotarPage, getAllElectionsAdmin } from "@/utils/api";
import Cookies from "universal-cookie";
import { CircularProgress, Pagination } from "@mui/material";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [elections, setElections] = useState([]);
  const [isLoadingElections, setIsLoadingElections] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElections, setTotalElections] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const totalPages = Math.max(1, Math.ceil(totalElections / rowsPerPage));

  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
    setCurrentPage(1);
  };

  const fetchElections = async (page: number, limit: number) => {
    setIsLoadingElections(true);
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) setAuthToken(token);

    try {
      const { data } = await getAllElectionsAdmin(
        page.toString(),
        limit.toString()
      );
      if (data) {
        const electionsArray = Array.isArray(data.data?.elections)
          ? data.data.elections
          : Array.isArray(data.data)
          ? data.data
          : [];

        const sortedElections = electionsArray.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setElections(sortedElections);

        if (page === 1) {
          setTotalElections(
            data.data?.total || data.total || electionsArray.length
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingElections(false);
    }
  };

  useEffect(() => {
    fetchElections(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const freeVotarElections = elections.filter(
    (election: any) => election.type === "Free Votar"
  );

  const votarProElections = elections.filter(
    (election: any) => election.type === "Votar Pro"
  );

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
              {activeTab === 3 && <FreeVotar elections={freeVotarElections} />}
              {activeTab === 4 && <VotarPro elections={votarProElections} />}
              {activeTab === 5 && <VotarMeeting />}
            </>
          )}
        </div>
      </div>

      {elections && elections.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={50}>50</option>
            </select>
          </div>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#015CE9",
                },
                "& .Mui-selected": {
                  backgroundColor: "#015CE9 !important",
                  color: "white",
                },
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tabs;
