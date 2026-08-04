import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { votarProPower } from "@/utils/util";
import { useRouter } from "next/router";
import { getAdminVotarPage } from "@/utils/api";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

const LIMIT = 50;

const VotarProTable = () => {
  const headers = ["S/N", "Emails", "No. of Elections"];
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [types, setTypes] = useState("");

  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
  const pathname = usePathname();
  const handleEmailClick = (email: string) => {
    router.push(`/admin/free-pro-meeting/pro/details/votar-pro/${email}`);
  };

  useEffect(() => {
    const getVotarProPower = async () => {
      setIsFetchUsers(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);

      const types = pathname.toLowerCase().endsWith("/pro")
        ? "votar-pro"
        : "free-voter";

      try {
        const { data } = await getAdminVotarPage(types);
        if (data) {
          const electionsArray = Array.isArray(data.data?.elections)
            ? data.data.elections
            : Array.isArray(data.data)
            ? data.data
            : [];
          setAllUsers(electionsArray);

          setIsFetchUsers(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchUsers(false);
      }
    };
    getVotarProPower();
  }, []);

  const totalPages = Math.ceil(allUsers.length / LIMIT);
  const pagedUsers = allUsers.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const getSerialNumber = (index: number) => {
    const serialNumber = (currentPage - 1) * LIMIT + index + 1;
    return serialNumber <= 9 ? `0${serialNumber}` : serialNumber.toString();
  };

  if (isFetchUsers)
    return (
      <div className="text-center">
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
            {pagedUsers &&
              pagedUsers.length > 0 &&
              pagedUsers.map((row: any, index: number) => (
                <TableRow key={row.election_id ?? index}>
                  <StyledTableCell align="center">
                    {getSerialNumber(index)}
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    className="cursor-pointer hover:shadow-md duration-150"
                    onClick={() => handleEmailClick(row.author_email)}
                  >
                    {row.author_email}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.number_of_election}
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {allUsers.length > 0 && (
        <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Pagination
            count={Math.max(totalPages, 1)}
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
            Showing {(currentPage - 1) * LIMIT + 1} to{" "}
            {Math.min(currentPage * LIMIT, allUsers.length)} of{" "}
            {allUsers.length} entries
          </div>
        </Stack>
      )}
    </div>
  );
};

export default VotarProTable;
