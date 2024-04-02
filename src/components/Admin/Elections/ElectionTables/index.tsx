import React, { useState } from "react";
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

const ElectionTables = () => {
  const [isDropDown, setIsDropdown] = useState(false);
  const [filteredOption, setFilteredOption] = useState("Date");

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
      fontSize: 18,
      fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      fontWeight: 600,
      border: "none",
    },
  }));
  const filteredOptionHandler = (opt: string) => {
    setFilteredOption(opt);
    setIsDropdown(false);
  };

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
              {electionsAdmin.map((row, index) => (
                <TableRow key={row.id}>
                  <StyledTableCell align="center">
                    {index <= 9 ? `0${index + 1}` : index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.election}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <span>{row.time}</span>
                    <br />
                    <span>{row.date}</span>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.voterNo.toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {" "}
                    <span
                      className={`${
                        row.status === "pending"
                          ? "text-[#E88749]"
                          : "text-green-400"
                      } capitalize`}
                    >
                      {row.status}
                    </span>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.amount.toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <SwitchButton />
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
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
