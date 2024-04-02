import React from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { adminVotarCreditTable } from "@/utils/util";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import { useRouter } from "next/router";

const VotarCreditTable = () => {
  const headers = ["S/N", "Emails", "Total Votar Credits", "Add Votar Credits"];
  const router = useRouter();
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
    <div>
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
            {adminVotarCreditTable.map((row, index) => (
              <TableRow key={row.id}>
                <StyledTableCell align="center">
                  {index <= 9 ? `0${index + 1}` : index + 1}
                </StyledTableCell>
                <StyledTableCell align="center">{row.email}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.totalCredits}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <div className="w-40 h-11 bg-neutral-100 flex items-center justify-center mx-auto gap-3">
                    <div className="text-neutral-400 text-xl font-semibold">
                      {row.defaultCredit}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        <BiPlusCircle />
                      </span>
                      <span className="text-xl">
                        <BiMinusCircle />
                      </span>
                    </div>
                    <div>
                      <button className="w-10 h-6 flex items-center justify-center bg-blue-700 rounded-lg text-center text-zinc-100 text-sm font-semibold">
                        Add
                      </button>
                    </div>
                  </div>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default VotarCreditTable;
