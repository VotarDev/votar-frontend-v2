import React from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export interface ActivityRow {
  key: string;
  name: React.ReactNode;
  type: React.ReactNode;
  dateTime: React.ReactNode;
  quantity: React.ReactNode;
  amount: React.ReactNode;
  status?: { label: string; className: string } | null;
}

interface ActivityTableProps {
  rows: ActivityRow[];
  emptyMessage?: string;
}

const headers = ["Name", "Type", "Date and Time", "Quantity", "Amount", "Status"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#015ce9",
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: 500,
    borderBottom: "1px solid #F1F5F9",
  },
}));

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#F8FAFC",
  },
});

const ActivityTable = ({ rows, emptyMessage = "No records found" }: ActivityTableProps) => {
  if (rows.length === 0)
    return <div className="py-10 text-center text-gray-400">{emptyMessage}</div>;

  return (
    <div>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 sm:hidden">
        {rows.map((row) => (
          <div
            key={row.key}
            className="rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-800">
                  {row.name}
                </div>
                <div className="text-xs text-gray-500">{row.type}</div>
              </div>
              {row.status && (
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${row.status.className}`}
                >
                  {row.status.label}
                </span>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">{row.dateTime}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-[#015CE9]/10 px-2.5 py-1 font-semibold text-[#015CE9]">
                Qty: {row.quantity}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600">
                {row.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <TableContainer
        sx={{ maxHeight: 500, display: { xs: "none", sm: "block" } }}
        className="table-scroll"
      >
        <Table
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0",
          }}
          stickyHeader
          aria-label="activity table"
        >
          <TableHead>
            <TableRow>
              {headers.map((header, key) => (
                <StyledTableCell key={key} align={key === 0 ? "left" : "center"}>
                  {header}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.key}>
                <StyledTableCell align="left">{row.name}</StyledTableCell>
                <StyledTableCell align="center">{row.type}</StyledTableCell>
                <StyledTableCell align="center">{row.dateTime}</StyledTableCell>
                <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                <StyledTableCell align="center">{row.amount}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.status && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${row.status.className}`}
                    >
                      {row.status.label}
                    </span>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ActivityTable;
