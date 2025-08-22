import React, { useEffect, useState } from "react";
import { getElections } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { ElectionDetails } from "@/utils/types";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

import {
  MdDelete,
  MdCalendarToday,
  MdPeople,
  MdDescription,
  MdVisibility,
} from "react-icons/md";
import { FiPlus, FiSearch } from "react-icons/fi";
import Modal from "@/src/components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import DeleteDialog from "./DeleteDialog";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";

const ElectionsComponent = () => {
  const users = useCurrentUser();
  const user = useUser();
  const [elections, setElections] = useState<ElectionDetails[]>([]);
  const [isFetchElections, setIsFetchElections] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);
  const cookies = new Cookies();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const getElectionsData = async () => {
    setIsFetchElections(true);
    const token = cookies.get("user-token");
    if (token) {
      setAuthToken(token);
    }
    try {
      const { data } = await getElections(USER_ID);
      if (data) {
        const electionsArray = Array.isArray(data.data?.elections)
          ? data.data.elections
          : Array.isArray(data.data)
          ? data.data
          : [];
        setElections(electionsArray);
        console.log(electionsArray);
        setIsFetchElections(false);
      }
    } catch (error) {
      console.log(error);
      setIsFetchElections(false);
    }
  };

  useEffect(() => {
    getElectionsData();
  }, []);

  const handleElectionDetails = (election: string, id: string) => {
    router.push(`/elections/${election}/${id}`);
  };

  const filteredElections = elections.filter((election) =>
    election.name_of_election.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-0 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Elections Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage and monitor your electoral processes
              </p>
            </div>
            <div className="flex items-center gap-3 ">
              <button
                onClick={() => router.push("/create-election")}
                className="flex items-center gap-2 bg-[#015ce9] hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <FiPlus className="w-5 h-5" />
                Create Election
              </button>
            </div>
          </div>
        </div>

        {/* Search and Stats Section */}
        <div className="mb-8">
          <div className="flex flex-col  gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search elections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="lg:w-[400px] w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-w-[120px]">
                <div className="text-2xl font-bold text-blue-600">
                  {elections.length}
                </div>
                <div className="text-sm text-gray-600">Total Elections</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-w-[120px]">
                <div className="text-2xl font-bold text-green-600">
                  {elections.filter((e) => e.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Elections Content */}
        {isFetchElections ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <CircularProgress size={40} style={{ color: "#2563eb" }} />
              <p className="mt-4 text-gray-600">Loading elections...</p>
            </div>
          </div>
        ) : (
          <div>
            {filteredElections.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MdCalendarToday className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm ? "No elections found" : "No elections yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Get started by creating your first election"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => router.push("/create-election")}
                      className="bg-[#015ce9] hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors duration-300"
                    >
                      Create First Election
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                <AnimatePresence>
                  {filteredElections
                    .slice()
                    .reverse()
                    .map((election, index) => (
                      <motion.div
                        key={election.election_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group relative h-full flex flex-col"
                      >
                        <div className="bg-white  shadow-sm hover:shadow-xl border border-gray-100  transition-all duration-300 transform hover:-translate-y-1 relative h-full flex flex-col">
                          {/* Card Header */}
                          <div className="bg-[#015ce9] p-6 text-white">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 line-clamp-2">
                                  {election.name_of_election}
                                </h3>
                                <div className="flex items-center gap-2 text-blue-100">
                                  <MdCalendarToday className="w-4 h-4" />
                                  <span className="text-sm">
                                    {formatDate(election.start_date)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    election.status === "active"
                                      ? "bg-green-400"
                                      : election.status === "completed"
                                      ? "bg-gray-400"
                                      : "bg-yellow-400"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 overflow-hidden">
                            {/* Description */}
                            {election.description && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2  mb-2 max-w-[120px] p-2  rounded bg-[#015ce9] text-white">
                                  <MdDescription className="w-4 h-4" />
                                  <span className="text-sm font-medium">
                                    Description
                                  </span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                  {election.description}
                                </p>
                              </div>
                            )}

                            {/* Status Badge */}
                            <div className="mb-[70px]">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  election.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : election.status === "completed"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {election.status?.charAt(0).toUpperCase() +
                                  election.status?.slice(1) || "Pending"}
                              </span>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 absolute bottom-0 left-0 right-0 ">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() =>
                                  handleElectionDetails(
                                    election.name_of_election,
                                    election.election_id
                                  )
                                }
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                              >
                                <MdVisibility className="w-4 h-4" />
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 absolute bottom-4 right-6 ">
                          <DeleteDialog
                            selectedAdmin={election.name_of_election}
                            id={election.election_id}
                            admins={elections}
                            setAdmins={setElections}
                            getUpdatedList={() => getElectionsData()}
                            userId={USER_ID}
                          />
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionsComponent;
