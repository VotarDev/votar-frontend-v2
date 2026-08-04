import React, { useEffect, useState } from "react";
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
import SwitchButton from "../../AdminProfile/SwitchButton";
import { drop } from "@/utils/util";
import { getAdminVotarElection, getAdminVotarPage } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import Cookies from "universal-cookie";
import { usePathname } from "next/navigation";
import { CircularProgress } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#015ce9",
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontWeight: 500,
    borderBottom: "1px solid #F1F5F9",
    verticalAlign: "middle",
    maxWidth: "150px",
    wordWrap: "break-word",
    lineHeight: "1.4",
  },
}));

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#F8FAFC",
  },
  "&.highlighted": {
    backgroundColor: "#fef9c3",
    transition: "background-color 0.3s ease",
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

const ElectionTables = () => {
  const [isDropDown, setIsDropdown] = useState(false);
  const [filteredOption, setFilteredOption] = useState("Date");
  const [users, setUsers] = useState<any[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElections, setTotalElections] = useState(0);
  const [limit] = useState<any>(100);
  const pathname = usePathname();

  const options = ["Date", "Election", "Time", "Status"];

  const headers = [
    "S/N",
    "Election",
    "Time & Date",
    "No of Voters",
    "Status",
    "Amount",
    "Publish",
    "Created by",
  ];

  const getVotarProPower = async (page: any = currentPage) => {
    setIsFetchUsers(true);
    const cookies = new Cookies();
    const token = cookies.get("admin-token");
    const types = pathname.toLowerCase().endsWith("/pro")
      ? "Votar Pro"
      : "Free Votar";

    if (token) setAuthToken(token);
    try {
      let response;
      try {
        response = await getAdminVotarElection("", page, limit);
      } catch (paramError) {
        response = await getAdminVotarPage();
      }

      const { data } = response;
      if (data) {
        const electionsArray = Array.isArray(data.data?.elections)
          ? data.data.elections
          : Array.isArray(data.data)
          ? data.data
          : [];

        const total = data.data?.total || data.total || electionsArray.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedUsers = data.data?.total
          ? electionsArray
          : electionsArray.slice(startIndex, endIndex);

        setUsers(paginatedUsers);
        setTotalElections(total);
        setTotalPages(Math.ceil(total / limit));
        setIsFetchUsers(false);
      }
    } catch (e: any) {
      console.log("Error fetching elections:", e);
      setIsFetchUsers(false);
    }
  };

  useEffect(() => {
    getVotarProPower();
  }, []);

  const filteredOptionHandler = (opt: string) => {
    setFilteredOption(opt);
    setIsDropdown(false);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    getVotarProPower(value);
  };

  const getSerialNumber = (index: number) => {
    const serialNumber = (currentPage - 1) * limit + index + 1;
    return serialNumber <= 9 ? `0${serialNumber}` : serialNumber.toString();
  };

  if (isFetchUsers)
    return (
      <div className="py-10 text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div className="pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-fit">
          <div
            className="flex items-center cursor-pointer text-base sm:text-xl font-semibold"
            onClick={() => setIsDropdown((dropdown) => !dropdown)}
          >
            Sort Elections By
            <span className="pl-1">
              {isDropDown ? <BsFillCaretUpFill /> : <BsCaretDownFill />}
            </span>
            <span className="px-1">:</span>
            {filteredOption}
          </div>
          <AnimatePresence mode="wait">
            {isDropDown && (
              <motion.div
                className="absolute top-full left-0 sm:right-14 sm:left-auto w-40 py-2 text-lg mt-2 bg-white shadow-[0px_4px_16px_0px_rgba(0_,0_,0_,0.08)] z-20"
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
        <div className="text-base sm:text-xl font-semibold">
          Election Number : {totalElections}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="py-10 text-center text-gray-400">No elections found</div>
      ) : (
        <div className="w-full mt-5">
          {/* Mobile card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {users.map((row, index) => (
              <div
                key={row.election_id}
                className="rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-400">
                      #{getSerialNumber(index)}
                    </div>
                    <div className="truncate text-sm font-semibold text-gray-800">
                      {row.name_of_election}
                    </div>
                  </div>
                  {row.hasOwnProperty("published") && (
                    <div className="shrink-0">
                      <SwitchButton
                        id={row.election_id}
                        row={row}
                        userMail={row.author_email}
                        initialStatus={row.published}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  <div>{row.start_date}</div>
                  <div>{row.end_date}</div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2.5 py-1 font-semibold capitalize ${
                      row.payment_status === "Paid"
                        ? "bg-green-50 text-green-600"
                        : "bg-orange-50 text-[#E88749]"
                    }`}
                  >
                    {row.payment_status || "Pending"}
                  </span>
                  <span className="rounded-full bg-[#015CE9]/10 px-2.5 py-1 font-semibold text-[#015CE9]">
                    {row.number_of_election || 0} voters
                  </span>
                </div>

                <div className="mt-3 truncate text-xs text-gray-400">
                  {row.author_email || row.createdBy || "-"}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <TableContainer
            sx={{ maxHeight: "100%", display: { xs: "none", sm: "block" } }}
            className="table-scroll"
          >
            <Table
              sx={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
              stickyHeader
              aria-label="elections table"
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
                {users.map((row, index) => (
                  <StyledTableRow key={row.election_id}>
                    <StyledTableCell align="center">
                      {getSerialNumber(index)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.name_of_election}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <span>{row.start_date}</span>
                      <br />
                      <span>{row.end_date}</span>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.number_of_election || "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <span
                        className={`${
                          row.payment_status === "Paid"
                            ? "text-green-400"
                            : "text-[#E88749]"
                        } capitalize`}
                      >
                        {row.payment_status || "Pending"}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="center">-</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.hasOwnProperty("published") && (
                        <SwitchButton
                          id={row.election_id}
                          row={row}
                          userMail={row.author_email}
                          initialStatus={row.published}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.author_email || row.createdBy || "-"}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

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
            {Math.min(currentPage * limit, totalElections)} of{" "}
            {totalElections} elections
          </div>
        </Stack>
      )}
    </div>
  );
};

export default ElectionTables;
