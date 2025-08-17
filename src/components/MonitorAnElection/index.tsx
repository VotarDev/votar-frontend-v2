import React, { useState } from "react";
import { useRouter } from "next/router";
import { ElectionDetails } from "@/utils/types";
import { CircularProgress } from "@mui/material";
import {
  MdCalendarToday,
  MdDescription,
  MdVisibility,
  MdAnalytics,
  MdBarChart,
  MdShowChart,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const MonitorAnElection = ({
  elections,
  isFetchElections,
}: {
  elections: ElectionDetails[];
  isFetchElections: boolean;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleElectionDetails = (election: string, id: string) => {
    router.push(`/monitor-election/${election}/${id}`);
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
                Monitor Elections
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl">
                You can monitor an election by Total numbers or Individual
                number via our analytics tools, By Numbers, By Line Charts, By
                Bar Charts, and By Sub Group.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Features Section */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex lg:items-center gap-3 flex-col md:flex-row">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MdAnalytics className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Total Numbers
                  </div>
                  <div className="text-xs text-gray-500">
                    View aggregated data
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex lg:items-center gap-3 flex-col md:flex-row">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MdShowChart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Line Charts
                  </div>
                  <div className="text-xs text-gray-500">Trend analysis</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex lg:items-center gap-3 flex-col md:flex-row">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MdBarChart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Bar Charts
                  </div>
                  <div className="text-xs text-gray-500">Comparative view</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex lg:items-center gap-3 flex-col md:flex-row">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MdAnalytics className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Sub Groups
                  </div>
                  <div className="text-xs text-gray-500">
                    Detailed breakdown
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Stats Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search elections to monitor..."
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
                <div className="text-sm text-gray-600">Available Elections</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 min-w-[120px]">
                <div className="text-2xl font-bold text-green-600">
                  {elections.filter((e) => e.status === "active").length}
                </div>
                <div className="text-sm text-gray-600">Active Elections</div>
              </div>
            </div>
          </div>
        </div>

        {/* Elections Content */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Select an Election to Monitor
          </h2>
          <p className="text-gray-600">
            Choose from the available elections below to access detailed
            monitoring and analytics.
          </p>
        </div>

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
                    <MdAnalytics className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {searchTerm
                      ? "No elections found"
                      : "No elections available"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "There are no elections available to monitor at the moment"}
                  </p>
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
                        <div
                          className="bg-white shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 relative h-full flex flex-col cursor-pointer"
                          onClick={() =>
                            handleElectionDetails(
                              election.name_of_election,
                              election.election_id
                            )
                          }
                        >
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
                          <div className="p-6 flex-1">
                            {/* Description */}
                            {election.description && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 text-white mb-2 max-w-[120px] p-2 rounded bg-[#015ce9]">
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

                            {/* Analytics Features */}
                            <div className="mb-4">
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                Available Analytics:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  <MdAnalytics className="w-3 h-3 mr-1" />
                                  Numbers
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                  <MdShowChart className="w-3 h-3 mr-1" />
                                  Charts
                                </span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                  <MdBarChart className="w-3 h-3 mr-1" />
                                  Reports
                                </span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-4">
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
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleElectionDetails(
                                    election.name_of_election,
                                    election.election_id
                                  );
                                }}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                              >
                                <MdVisibility className="w-4 h-4" />
                                Monitor Election
                              </button>
                              <div className="text-xs text-gray-500">
                                Click to view analytics
                              </div>
                            </div>
                          </div>
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

export default MonitorAnElection;
