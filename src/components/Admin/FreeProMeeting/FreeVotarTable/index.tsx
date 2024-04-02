import React from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { freeVotarPower } from "@/utils/util";
import { useRouter } from "next/router";

const FreeVotarTable = () => {
  const headers = ["S/N", "Emails", "No. of Elections"];
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
  const router = useRouter();
  const handleEmailClick = (id: string | number, email: string) => {
    router.push(`/admin/free-pro-meeting/details/free-votar/${id}/${email}`);
  };
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
            {freeVotarPower.map((row, index) => (
              <TableRow key={row.id}>
                <StyledTableCell align="center">
                  {index <= 9 ? `0${index + 1}` : index + 1}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  className="cursor-pointer hover:shadow-md duration-150"
                  onClick={() => handleEmailClick(row.id, row.email)}
                >
                  {row.email}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.electionNo}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FreeVotarTable;
