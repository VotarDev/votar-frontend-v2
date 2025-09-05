import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { activitiesContent } from "@/utils/util";
import { getAdminVotarPage, getAllElectionsAdmin } from "@/utils/api";
import Cookies from "universal-cookie";
import { set } from "lodash";
import { Box, IconButton, TableFooter } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { v4 as uuidv4 } from "uuid";

const Activities = ({ elections }: any) => {
  const headers = [
    "Name",
    "Type",
    "Date and Time",
    "Quantity",
    "Amount",
    "Status",
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

  console.log(elections);

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
                  >
                    {header}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {elections.map((row: any) => (
              <StyledTableRow key={uuidv4()}>
                <StyledTableCell>{row.name_of_election}</StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  {row.type}
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  {row.start_date} - {row.end_date}
                  <br />
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  {row.quantity}
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  #
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Activities;
