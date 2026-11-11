import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { getAdminVotarPage } from "@/utils/api";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

const LIMIT = 50;

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

const StyledTableRow = styled(TableRow)({
  "&:hover": {
    backgroundColor: "#F8FAFC",
  },
});

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

const FreeVotarTable = () => {
  const headers = ["S/N", "Email", "No. of Elections"];
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isFetchUsers, setIsFetchUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const pathname = usePathname();

  const handleEmailClick = (email: string) => {
    router.push(`/admin/free-pro-meeting/details/free-votar/${email}`);
  };

  useEffect(() => {
    const getVotarProPower = async () => {
      setIsFetchUsers(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      const types = pathname.toLowerCase().endsWith("/pro")
        ? "Votar Pro"
        : "free-votar";

      if (token) setAuthToken(token);
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
      <div className="py-10 text-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );

  if (pagedUsers.length === 0)
    return <div className="py-10 text-center text-gray-400">No records found</div>;

  return (
    <div>
      {/* Mobile card list */}
      <div className="flex flex-col gap-3 sm:hidden">
        {pagedUsers.map((row: any, index: number) => (
          <div
            key={row.election_id ?? index}
            className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
          >
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-400">
                #{getSerialNumber(index)}
              </div>
              <button
                type="button"
                onClick={() => handleEmailClick(row.author_email)}
                className="block truncate text-left text-sm font-semibold text-[#015CE9]"
              >
                {row.author_email}
              </button>
            </div>
            <span className="shrink-0 rounded-full bg-[#015CE9]/10 px-3 py-1 text-xs font-bold text-[#015CE9]">
              {row.number_of_election}{" "}
              {row.number_of_election === 1 ? "election" : "elections"}
            </span>
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
          aria-label="free votar table"
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
            {pagedUsers.map((row: any, index: number) => (
              <StyledTableRow key={row.election_id ?? index}>
                <StyledTableCell align="center">
                  {getSerialNumber(index)}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  className="cursor-pointer"
                  onClick={() => handleEmailClick(row.author_email)}
                >
                  <span className="text-[#015CE9] hover:underline">
                    {row.author_email}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.number_of_election}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {allUsers.length > 0 && (
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
            Showing {(currentPage - 1) * LIMIT + 1} to{" "}
            {Math.min(currentPage * LIMIT, allUsers.length)} of{" "}
            {allUsers.length} entries
          </div>
        </Stack>
      )}
    </div>
  );
};

export default FreeVotarTable;
