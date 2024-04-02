import React from "react";
import { activitiesContent } from "@/utils/util";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const FreeVotar = () => {
  const freeVotar = activitiesContent.filter(
    (items) => items.type === "Free Votar"
  );
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
      <TableContainer sx={{ maxHeight: 440 }} className="table-scroll">
        <Table
          sx={{
            minWidth: 650,

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
            {freeVotar.map((row, index) => (
              <TableRow key={row.id}>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell>{row.type}</StyledTableCell>
                <StyledTableCell>
                  {row.date}
                  <br />
                  {row.time}
                </StyledTableCell>
                <StyledTableCell>
                  {row.quantity.toLocaleString()}
                </StyledTableCell>
                <StyledTableCell>
                  NGN {row.amount.toLocaleString()}
                </StyledTableCell>
                <StyledTableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FreeVotar;
