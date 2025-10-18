import React, { ChangeEvent, useEffect, useState } from "react";
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
import setAuthToken from "@/utils/setAuthToken";
import Cookies from "universal-cookie";
import { adminGetAllUsers } from "@/utils/api";
import { set } from "lodash";
import AdminLayout from "../../AdminLayout";
import { CircularProgress, Pagination, Stack } from "@mui/material";

const VotarCreditTable = () => {
  const headers = ["S/N", "Emails", "Total Votar Credits", "Add Votar Credits"];
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(30);
  const cookies = new Cookies();
  const router = useRouter();

  const totalPages = Math.ceil(totalUsers / limit);

  const getAllUsers = async (page: number = currentPage) => {
    setIsFetchUsers(true);
    try {
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);

      const { data } = await adminGetAllUsers(
        "creators",
        page.toString(),
        limit.toString()
      );

      if (data) {
        setUsersData(data.data.users);
        console.log("users data", data.data);

        setTotalUsers(data.data.pagination.total);
        setIsFetchUsers(false);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsFetchUsers(false);
    }
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    getAllUsers(value);
  };

  useEffect(() => {
    getAllUsers();
  }, []);
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

  if (isFetchUsers)
    return (
      <div className="text-center mt-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

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
            {usersData.length > 0 &&
              usersData.map((row, index) => (
                <TableRow key={row.id}>
                  <StyledTableCell align="center">
                    {index <= 8 ? `0${index + 1}` : index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.votar_credit}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <div className="w-40  h-11 bg-neutral-100 flex items-center justify-center mx-auto gap-3">
                      <div className="text-neutral-400 text-xl font-semibold">
                        <input type="text" />
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

      <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#015CE9",
              "&.Mui-selected": {
                backgroundColor: "#015CE9",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0146c7",
                },
              },
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            },
          }}
        />
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </Stack>
    </div>
  );
};

export default VotarCreditTable;
