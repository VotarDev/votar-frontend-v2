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
import { adminGetAllUsers, adminTopUp } from "@/utils/api";
import { toast } from "react-hot-toast";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import UserRow from "./UserRow";

const VotarCreditTable = () => {
  const headers = ["S/N", "Emails", "Total Votar Credits", "Add Votar Credits"];
  const [usersData, setUsersData] = useState<any[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [topUpAmounts, setTopUpAmounts] = useState<Record<string, string>>({});
  const [isTopUpInProgress, setIsTopUpInProgress] = useState(false);
  const [loadingUserEmail, setLoadingUserEmail] = useState<string | null>(null);

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

  const adminTopUpVotarCredit = async (email: string, amount: number) => {
    setLoadingUserEmail(email);
    try {
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);

      const bodyData = { email, amount };
      const { data } = await adminTopUp(bodyData);

      if (data) {
        toast.success(
          `Successfully topped up ${amount} votar credits to ${email}`
        );
        setTopUpAmounts((prev) => ({ ...prev, [email]: "" }));
        await getAllUsers();
      }
    } catch (error) {
      console.error("Error topping up votar credits:", error);
      toast.error("Failed to top up votar credits. Please try again.");
    } finally {
      setLoadingUserEmail(null);
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
                <UserRow
                  key={row.email}
                  row={row}
                  index={index}
                  topUpAmounts={topUpAmounts}
                  setTopUpAmounts={setTopUpAmounts}
                  adminTopUpVotarCredit={adminTopUpVotarCredit}
                  loadingUserEmail={loadingUserEmail}
                  StyledTableCell={StyledTableCell}
                />
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
