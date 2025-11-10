import React, { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { BsCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";

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
import { users } from "@/utils/util";
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#015ce9",
      color: theme.palette.common.white,
      fontSize: 18,
      fontWeight: "bold",
      padding: "12px 8px",
      whiteSpace: "nowrap",
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      fontWeight: 600,
      border: "none",
      padding: "16px",
      verticalAlign: "middle",
    },
  }));

  const filteredOptionHandler = (opt: string) => {
    setFilteredOption(opt);
    setIsDropdown(false);
    setCurrentPage(1);
    getAllAdminUsers(1, opt);
  };

  // Calculate total based on filter
  const getDisplayTotal = () => {
    if (filteredOption === "All") {
      return totalCreators + totalVoters;
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
        const creatorsTotal = data.data.electionCreators.total || 0;
        const votersTotal = data.data.voters.total || 0;

        setTotalCreators(creatorsTotal);
        setTotalVoters(votersTotal);
        setTotalUsers(creatorsTotal + votersTotal);

        const mergedDataArray: MergedData[] = [];

        // Add creators based on filter
        if (filter === "All" || filter === "Election Creator") {
          data.data.electionCreators.electionCreators.forEach(
            (creator: any) => {
              mergedDataArray.push({
                name: creator.userName,
                email: creator.email,
                category: "Election Creator",
              });
            }
          );
        }

        // Add voters based on filter
        if (filter === "All" || filter === "Voter") {
          data.data.voters.voters.forEach((voter: any) => {
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

  console.log("usersData", usersData);

  if (isFetchUsers)
    return (
      <div className="text-center ">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <AdminLayout>
      <div className="p-10">
        <div className="flex justify-end items-center gap-5 ">
          <div className="relative max-w-[260px] ">
            <div
              className="flex items-center cursor-pointer text-xl font-semibold"
              onClick={() => setIsDropdown((dropdown) => !dropdown)}
            >
              Sort By
              <span className="pl-1">
                {isDropDown ? <BsFillCaretUpFill /> : <BsCaretDownFill />}
              </span>
              <span className="px-1">:</span>
              {filteredOption}
            </div>
            <AnimatePresence mode="wait">
              {isDropDown && (
                <motion.div
                  className="absolute top-full right-14 w-40 py-2 text-lg mt-2 bg-white shadow-[0px_4px_16px_0px_rgba(0_,0_,0_,0.08)] z-20"
                  variants={drop}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex flex-col gap-2 [&>*]:cursor-pointer">
                    {options.map((opt, index) => (
                      <div
                        key={index}
                        onClick={() => filteredOptionHandler(opt)}
                        className={`hover:bg-[#dadada] px-4 py-2 ${
                          filteredOption == opt ? " bg-[#dadada]" : ""
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="text-xl font-semibold">
            Number of users : {displayTotal}
          </div>
        </div>
        <div className="w-full mt-5">
          <TableContainer sx={{ maxHeight: "80%" }} className="table-scroll">
            <Table
              sx={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow className="text-white font-bold">
                  {headers.map((header, key) => {
                    return (
                      <StyledTableCell
                        key={key}
                        className=" border border-[#F5F5F5]"
                        align="center"
                      >
                        {header}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {usersData.map((row, index) => (
                  <TableRow key={uuidv4()}>
                    <StyledTableCell align="center">
                      {getSerialNumber(index)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center" className="capitalize">
                      {row.category}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
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
                }}
              />
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, displayTotal)} of {displayTotal}{" "}
                users
              </div>
            </Stack>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserSection;
