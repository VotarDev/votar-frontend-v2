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
import { electionsAdmin } from "@/utils/util";
import SwitchButton from "../../AdminProfile/SwitchButton";
import { drop } from "@/utils/util";
import { getAdminVotarPage } from "@/utils/api";
import setAuthToken from "@/utils/setAuthToken";
import Cookies from "universal-cookie";
import { usePathname } from "next/navigation";
import { CircularProgress } from "@mui/material";

const ElectionTables = () => {
  const [isDropDown, setIsDropdown] = useState(false);
  const [filteredOption, setFilteredOption] = useState("Date");
  const [users, setUsers] = useState<any[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(false);
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#015ce9",
      color: theme.palette.common.white,
      fontSize: 14,
      fontWeight: "bold",
      padding: "12px 8px",
      whiteSpace: "nowrap",
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
      fontWeight: 500,
      border: "none",
      padding: "16px",
      verticalAlign: "middle",
      maxWidth: "150px",
      wordWrap: "break-word",
      lineHeight: "1.4",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&.highlighted": {
      backgroundColor: "#fef9c3",
      transition: "background-color 0.3s ease",
    },
  }));

  useEffect(() => {
    const getVotarProPower = async () => {
      setIsFetchUsers(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      const types = pathname.toLowerCase().endsWith("/pro")
        ? "Votar Pro"
        : "Free Votar";

      if (token) setAuthToken(token);
      try {
        const { data } = await getAdminVotarPage();
        if (data) {
          const electionsArray = Array.isArray(data.data?.elections)
            ? data.data.elections
            : Array.isArray(data.data)
            ? data.data
            : [];

          setUsers(electionsArray);

          setIsFetchUsers(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchUsers(false);
      }
    };
    getVotarProPower();
  }, []);

  const filteredOptionHandler = (opt: string) => {
    setFilteredOption(opt);
    setIsDropdown(false);
  };

  if (isFetchUsers)
    return (
      <div className="text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div>
      <div className="flex justify-end items-center gap-5">
        <div className="relative max-w-[260px] ">
          <div
            className="flex items-center cursor-pointer text-xl font-semibold"
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
          Election Number : {electionsAdmin.length}
        </div>
      </div>
      <div className="w-full mt-5">
        <TableContainer sx={{ maxHeight: 500 }} className="table-scroll">
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
              <StyledTableRow className="text-white font-bold">
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
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.length > 0 &&
                users.map((row, index) => (
                  <TableRow key={row.id}>
                    <StyledTableCell align="center">
                      {index <= 9 ? `0${index + 1}` : index + 1}
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
                      {/* {row.voterNo.toLocaleString()} */}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {/* {" "}
                      <span
                        className={`${
                          row.status === "pending"
                            ? "text-[#E88749]"
                            : "text-green-400"
                        } capitalize`}
                      >
                        {row.status}
                      </span> */}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {/* {row.amount.toLocaleString()} */}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <SwitchButton
                        id={index}
                        row={row}
                        userMail={row.author_email}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.author_email}
                    </StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ElectionTables;
