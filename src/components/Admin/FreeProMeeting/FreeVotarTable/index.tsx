import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { freeVotarPower } from "@/utils/util";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import setAuthToken from "@/utils/setAuthToken";
import { getAdminVotarPage } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import { usePathname } from "next/navigation";

const FreeVotarTable = () => {
  const headers = ["S/N", "Emails", "No. of Elections"];
  const [isFetchUsers, setIsFetchUsers] = useState(false);
  const [users, setUsers] = useState<any>([]);
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
    router.push(`/admin/free-pro-meeting/details/free-votar/${email}`);
  };

  useEffect(() => {
    const getVotarProPower = async () => {
      setIsFetchUsers(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      const types = pathname.toLowerCase().endsWith("/pro")
        ? "Votar Pro"
        : "Free Votar";

      if (token) setAuthToken(token);
      try {
        const { data } = await getAdminVotarPage(types);
        if (data) {
          setUsers(data.data);
          console.log(data.data);
          setIsFetchUsers(false);
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchUsers(false);
      }
    };
    getVotarProPower();
  }, []);

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
            {users &&
              users.length > 0 &&
              users.map((row: any, index: number) => (
                <TableRow key={row.id}>
                  <StyledTableCell align="center">
                    {index <= 9 ? `0${index + 1}` : index + 1}
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    className="cursor-pointer hover:shadow-md duration-150"
                    onClick={() => handleEmailClick(row.email)}
                  >
                    {row.email}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.numberOfElection}
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
