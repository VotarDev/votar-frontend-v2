import React from "react";
import AdminLayout from "../AdminLayout";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SwitchButton from "../AdminProfile/SwitchButton";
import { drop } from "@/utils/util";
import ViewElections from "./ViewElections";

const CouponSection = () => {
  const headers = [
    "S/N",
    "Coupon Name",
    "Coupon Code Criteria",
    "Elections",
    "Coupon Access",
  ];
  const couponData = [
    {
      id: 1,
      couponName: "Votar 50",
      couponCodeCriteria: "50% off",
      elections: "View elections",
      couponAccess: "All Elections",
    },
    {
      id: 2,
      couponName: "Votar 1k",
      couponCodeCriteria: "1000",
      elections: "View elections",
      couponAccess: "All Elections",
    },
    {
      id: 3,
      couponName: "Free",
      couponCodeCriteria: "0",
      elections: "View elections",
      couponAccess: "All Elections",
    },
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

  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-center gap-2 text-2xl font-medium"></div>
      <div className="flex flex-col gap-5 mt-10">
        <div>
          <input
            type="text"
            placeholder="Enter Coupon Name"
            className="border w-72 h-12 p-4 outline-none"
          />
        </div>
        <div>
          <div className="border p-4 w-72 h-12 flex items-center">
            Coupon Code Criteria
          </div>
        </div>
        <div>
          <button className="bg-blue-700 w-72 h-12 flex items-center justify-center rounded-3xl text-lg text-white font-medium">
            Implement Coupon
          </button>
        </div>
      </div>
      <div className="mt-20">
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
              {couponData.map((row, index) => (
                <TableRow key={row.id}>
                  <StyledTableCell align="center">
                    {index <= 9 ? `0${index + 1}` : index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.couponName}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.couponCodeCriteria}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <ViewElections selectedElection={row} num={index} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <SwitchButton />
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

export default CouponSection;
