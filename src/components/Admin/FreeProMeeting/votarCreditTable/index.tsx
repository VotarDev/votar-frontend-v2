import React, { ChangeEvent, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import setAuthToken from "@/utils/setAuthToken";
import Cookies from "universal-cookie";
import { adminGetAllUsers, adminTopUp } from "@/utils/api";
import { toast } from "react-hot-toast";
import {
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import UserRow from "./UserRow";
import UserCard from "./UserCard";
import { BiSearch } from "react-icons/bi";

const VotarCreditTable = () => {
  const headers = ["S/N", "Emails", "Total Votar Credits", "Add Votar Credits"];
  const [usersData, setUsersData] = useState<any[]>([]);
  const [filteredUsersData, setFilteredUsersData] = useState<any[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [topUpAmounts, setTopUpAmounts] = useState<Record<string, string>>({});
  const [isTopUpInProgress, setIsTopUpInProgress] = useState(false);
  const [loadingUserEmail, setLoadingUserEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(30);
  const cookies = new Cookies();
  const router = useRouter();

  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getAllUsers = async (
    page: number = currentPage,
    search: string = debouncedSearchQuery
  ) => {
    setIsFetchUsers(true);
    try {
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);

      const { data } = await adminGetAllUsers(
        "creators",
        page.toString(),
        limit.toString(),
        search.trim() || undefined
      );

      if (data) {
        const users = data.data.electionCreators;
        setUsersData(users);
        setFilteredUsersData(users);
        setTotalUsers(data.data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
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
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  useEffect(() => {
    getAllUsers(currentPage, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = usersData.filter((user) => {
        const email = user.email?.toLowerCase() || "";
        const votarCredits = user.votarCredits?.toString() || "";

        return (
          email.includes(searchQuery.toLowerCase()) ||
          votarCredits.includes(searchQuery.toLowerCase())
        );
      });
      setFilteredUsersData(filtered);
    } else {
      setFilteredUsersData(usersData);
    }
  }, [usersData]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#015ce9",
      color: theme.palette.common.white,
      fontSize: 15,
      fontWeight: "bold",
      whiteSpace: "nowrap",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
      fontWeight: 500,
      borderBottom: "1px solid #F1F5F9",
    },
  }));

  const paginationSx = {
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
  };

  if (isFetchUsers)
    return (
      <div className="text-center mt-10">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by email or votar credits..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BiSearch size={20} color="#015CE9" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#015CE9",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#015CE9",
              },
            },
          }}
        />
        {searchQuery && (
          <div className="text-sm text-gray-600 mt-2">
            Found {filteredUsersData.length} user(s)
          </div>
        )}
      </div>

      {filteredUsersData.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          {searchQuery
            ? "No users found matching your search"
            : "No users available"}
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filteredUsersData.map((row, index) => (
              <UserCard
                key={row.email}
                row={row}
                serialNumber={(currentPage - 1) * limit + index + 1}
                adminTopUpVotarCredit={adminTopUpVotarCredit}
                loadingUserEmail={loadingUserEmail}
              />
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
              aria-label="votar credit table"
            >
              <TableHead>
                <TableRow>
                  {headers.map((header, key) => (
                    <StyledTableCell
                      key={key}
                      align={key === 1 ? "left" : "center"}
                    >
                      {header}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsersData.map((row, index) => (
                  <UserRow
                    key={row.email}
                    row={row}
                    index={index}
                    serialNumber={(currentPage - 1) * limit + index + 1}
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
        </>
      )}

      <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
        {/* Compact pagination for mobile */}
        <Pagination
          className="sm:hidden"
          count={Math.max(totalPages, 1)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="small"
          siblingCount={0}
          boundaryCount={1}
          sx={paginationSx}
        />
        {/* Full pagination for larger screens */}
        <Pagination
          className="hidden sm:flex"
          count={Math.max(totalPages, 1)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
          sx={paginationSx}
        />
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </Stack>
    </div>
  );
};

export default VotarCreditTable;
