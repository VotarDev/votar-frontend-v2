import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { tabelContents } from "@/utils/util";
import { useCurrentUser, useUser } from "@/utils/hooks";

import { formatTimeToHHMM } from "@/utils/util";
import { v4 } from "uuid";

const Tables = ({ election }: any) => {
  const headers = [
    "S/N",
    "Election Name",
    "Election Start",
    "Election Ends",
    "Created By",
  ];

  const user = useUser();
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

      padding: "16px",
      textAlign: "center",
      verticalAlign: "middle",
      maxWidth: "150px",
      wordWrap: "break-word",
      lineHeight: "1.4",
      border: "1px solid #b9b9b9",
    },
  }));

  return (
    <div>
      <TableContainer sx={{ maxHeight: 400 }} className="table-scroll">
        <Table
          sx={{
            minWidth: 900,
            borderCollapse: "separate",
            borderSpacing: "0 1em",
          }}
          aria-label="sticky table"
        >
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 1 }}>
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
            {election.map((row: any, index: number) => (
              <TableRow key={v4()}>
                <StyledTableCell align="center">{index + 1}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.name_of_election}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.start_date} {formatTimeToHHMM(row.start_time)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.end_date} {formatTimeToHHMM(row.end_time)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {user?.user?.data?.userName}
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
