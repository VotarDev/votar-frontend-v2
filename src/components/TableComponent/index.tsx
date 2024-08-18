import React from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { tabelContents } from "@/utils/util";

const Tables = () => {
  const headers = [
    "S/N",
    "Election Name",
    "Election Start",
    "Election Ends",
    "Created By",
  ];

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#015ce9",
      color: theme.palette.common.white,
      fontSize: 16,
      fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: "bold",
      border: "1px solid #B9B9B9",
    },
  }));

  return (
    <div>
      <TableContainer>
        <Table
          sx={{
            minWidth: 900,
            borderCollapse: "separate",
            borderSpacing: "0 1em",
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow className="text-white font-bold">
              {headers.map((header, key) => {
                return (
                  <StyledTableCell
                    key={key}
                    align="center"
                    className=" border border-[#F5F5F5]"
                  >
                    {header}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tabelContents.map((row, index) => (
              <TableRow key={row.id}>
                <StyledTableCell align="center">{index + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.electionName}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.startDate}
                </StyledTableCell>
                <StyledTableCell align="center">{row.endDate}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.createdBy}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Tables;
