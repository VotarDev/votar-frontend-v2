import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { BsCaretDownFill, BsFillCaretUpFill, BsCheck2 } from "react-icons/bs";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Pagination, Stack } from "@mui/material";
import { drop } from "@/utils/util";
import Cookies from "universal-cookie";
import { adminGetAllUsers } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import { v4 as uuidv4 } from "uuid";

import { CircularProgress } from "@mui/material";

interface MergedData {
  name: string;
  email: string;
  category: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#015ce9",
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontWeight: 500,
    borderBottom: "1px solid #F1F5F9",
  },
}));

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#F8FAFC",
  },
});

const paginationSx = {
  "& .MuiPaginationItem-root": {
    color: "#015CE9",
    "&.Mui-selected": {
      backgroundColor: "#015CE9",
      color: "white",
      "&:hover": {
        backgroundColor: "#0146c7",
      },
    },
    "&:hover": {
      backgroundColor: "#e3f2fd",
    },
  },
};

const UserSection = () => {
  const [isDropDown, setIsDropdown] = useState(false);
  const [filteredOption, setFilteredOption] = useState("All");
  const [usersData, setUsersData] = useState<MergedData[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(30);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCreators, setTotalCreators] = useState(0);
  const [totalVoters, setTotalVoters] = useState(0);

  const options = ["All", "Election Creator", "Voter"];

  const headers = ["S/N", "Name", "Email", "Category"];

  const filteredOptionHandler = (opt: string) => {
    setFilteredOption(opt);
    setIsDropdown(false);
    setCurrentPage(1);
    getAllAdminUsers(1, opt);
  };

  // Calculate total based on filter
  const getDisplayTotal = () => {
    if (filteredOption === "All") {
      return totalUsers;
    } else if (filteredOption === "Election Creator") {
      return totalCreators;
    } else if (filteredOption === "Voter") {
      return totalVoters;
    }
    return 0;
  };

  const displayTotal = getDisplayTotal();
  const totalPages = Math.ceil(displayTotal / limit);

  const getAllAdminUsers = async (
    page: number = currentPage,
    filter: string = filteredOption
  ) => {
    setIsFetchUsers(true);
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    if (token) setAuthToken(token);

    try {
      const { data } = await adminGetAllUsers(
        "",
        page.toString(),
        limit.toString()
      );

      if (data) {
        const creatorsTotal = data.data.electionCreators.length || 0;
        const votersTotal = data.data.voters.length || 0;
        const totalUsers = data.data.pagination.total || 0;

        setTotalCreators(creatorsTotal);
        setTotalVoters(votersTotal);
        setTotalUsers(totalUsers);

        const mergedDataArray: MergedData[] = [];

        // Add creators based on filter
        if (filter === "All" || filter === "Election Creator") {
          data.data.electionCreators.forEach((creator: any) => {
            mergedDataArray.push({
              name: creator.userName,
              email: creator.email,
              category: "Election Creator",
            });
          });
        }

        // Add voters based on filter
        if (filter === "All" || filter === "Voter") {
          data.data.voters.forEach((voter: any) => {
            const existingCreatorIndex = mergedDataArray.findIndex(
              (user) => user.email === voter.email
            );
            if (existingCreatorIndex > -1) {
              // User exists as creator, add Voter to category
              if (
                !mergedDataArray[existingCreatorIndex].category.includes(
                  "Voter"
                )
              ) {
                mergedDataArray[existingCreatorIndex].category += ", Voter";
              }
            } else {
              mergedDataArray.push({
                name: voter.name,
                email: voter.email,
                category: "Voter",
              });
            }
          });
        }

        setUsersData(mergedDataArray);
        setIsFetchUsers(false);
      }
    } catch (e: any) {
      setIsFetchUsers(false);
      console.log(e);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    getAllAdminUsers(value);
  };

  const getSerialNumber = (index: number) => {
    const serialNumber = (currentPage - 1) * limit + index + 1;
    return serialNumber <= 9 ? `0${serialNumber}` : serialNumber.toString();
  };

  useEffect(() => {
    getAllAdminUsers();
  }, []);

  if (isFetchUsers)
    return (
      <AdminLayout>
        <div className="py-10 text-center">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-[1300px] mx-auto py-8 lg:py-[60px]">
        <div className="text-xl lg:text-2xl font-bold">Users</div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-fit">
            <button
              type="button"
              onClick={() => setIsDropdown((dropdown) => !dropdown)}
              className={`flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
                isDropDown
                  ? "border-[#015CE9] text-[#015CE9]"
                  : "border-gray-200 text-gray-700 hover:border-[#015CE9] hover:text-[#015CE9]"
              }`}
            >
              <span>
                Sort By: <span className="text-[#015CE9]">{filteredOption}</span>
              </span>
              <span className="text-xs">
                {isDropDown ? <BsFillCaretUpFill /> : <BsCaretDownFill />}
              </span>
            </button>

            <AnimatePresence>
              {isDropDown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdown(false)}
                  />
                  <motion.div
                    className="absolute top-full left-0 mt-2 w-52 rounded-lg border border-gray-100 bg-white py-2 shadow-lg z-20"
                    variants={drop}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {options.map((opt, index) => (
                      <div
                        key={index}
                        onClick={() => filteredOptionHandler(opt)}
                        className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                          filteredOption === opt
                            ? "bg-[#015CE9]/10 font-semibold text-[#015CE9]"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {opt}
                        {filteredOption === opt && <BsCheck2 className="text-base" />}
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div className="w-fit rounded-lg bg-[#015CE9]/10 px-4 py-2.5 text-sm font-semibold text-[#015CE9]">
            {displayTotal} {displayTotal === 1 ? "user" : "users"}
          </div>
        </div>

        {usersData.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No users found</div>
        ) : (
          <div className="w-full mt-5">
            {/* Mobile card list */}
            <div className="flex flex-col gap-3 sm:hidden">
              {usersData.map((row) => (
                <div
                  key={uuidv4()}
                  className="rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-800">
                        {row.name}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {row.email}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#015CE9]/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#015CE9]">
                      {row.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <TableContainer
              sx={{ maxHeight: "80%", display: { xs: "none", sm: "block" } }}
              className="table-scroll"
            >
              <Table
                sx={{
                  minWidth: 700,
                  borderCollapse: "separate",
                  borderSpacing: "0",
                }}
                stickyHeader
                aria-label="users table"
              >
                <TableHead>
                  <TableRow>
                    {headers.map((header, key) => (
                      <StyledTableCell key={key} align="center">
                        {header}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersData.map((row, index) => (
                    <StyledTableRow key={uuidv4()}>
                      <StyledTableCell align="center">
                        {getSerialNumber(index)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.email}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="capitalize">
                        {row.category}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
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
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={paginationSx}
                />
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, displayTotal)} of{" "}
                  {displayTotal} users
                </div>
              </Stack>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserSection;
