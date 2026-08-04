import React, { useState, useEffect } from "react";
import Activities from "../Activities";
import VotarCredits from "../VotarCredits";
import FreeVotar from "../FreeVotar";
import VotarPro from "../VotarPro";
import VotarMeeting from "../VotarMeeting";
import setAuthToken from "@/utils/setAuthToken";
import { getAdminVotarPage, getAllElectionsAdmin } from "@/utils/api";
import Cookies from "universal-cookie";
import { CircularProgress, Pagination, Stack } from "@mui/material";

const tabs = [
  { id: 1, label: "Activities" },
  { id: 2, label: "Votar Credits" },
  { id: 3, label: "Free Votar" },
  { id: 4, label: "Votar Pro" },
  { id: 5, label: "Votar Meetings" },
];

const paginationSx = {
  "& .MuiPaginationItem-root": {
    color: "#015CE9",
  },
  "& .Mui-selected": {
    backgroundColor: "#015CE9 !important",
    color: "white",
  },
};

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
      <div className="flex w-full gap-1.5 overflow-x-auto rounded-lg bg-zinc-100 p-1.5 sm:w-fit sm:flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`shrink-0 whitespace-nowrap rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-[#015CE9] text-white shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
        <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <div className="text-sm text-gray-600">{rowsPerPage} rows per page</div>

          {totalPages > 1 && (
            <>
              {/* Compact pagination for mobile */}
              <Pagination
                className="sm:hidden"
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="small"
                siblingCount={0}
                boundaryCount={1}
                sx={paginationSx}
              />
              {/* Full pagination for larger screens */}
              <Pagination
                className="hidden sm:flex"
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
                sx={paginationSx}
              />
            </>
          )}
        </Stack>
      )}
    </div>
  );
};

export default Tabs;
