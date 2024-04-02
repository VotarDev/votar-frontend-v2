import React, { useEffect, useState } from "react";
import AdminLayout from "@/src/components/Admin/AdminLayout";
import { useRouter } from "next/router";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { freeVotarAccessRequest, votarProAcessRequest } from "@/utils/util";
import SwitchButton from "@/src/components/Admin/AdminProfile/SwitchButton";

const UserElections = () => {
  const router = useRouter();
  const [userMail, setUserMail] = useState("");
  const [plans, setPlans] = useState("");
  const { id } = router.query;
  const handleEmailClick = (id: string | number, name: string) => {
    router.push(`/admin/free-pro-meeting/election-details/${id}/${name}`);
  };
  useEffect(() => {
    if (id) {
      setUserMail(id[2]);
      setPlans(id[0]);
    }
  }, [id]);

  const headers = [
    "S/N",
    "Election",
    "Time and Date",
    "Number of Voters",
    "Status",
    "Amount",
    "Publish",
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
  console.log(plans);
  return (
    <div>
      <AdminLayout>
        <div className="py-[60px] max-w-[1300px] mx-auto ">
          <div className="text-2xl font-bold">
            Free Votar Access Request & Management Panel
          </div>
          <div className="text-slate-900 text-xl font-semibold pt-8 underline">
            Email: {userMail}
          </div>

          <div className="pt-8">
            <div className="mt-8 bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-8 px-9 relative w-full">
              {plans === "free-votar" && (
                <TableContainer
                  sx={{ maxHeight: 500 }}
                  className="table-scroll"
                >
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
                      {freeVotarAccessRequest.map((row, index) => (
                        <TableRow key={row.id}>
                          <StyledTableCell align="center">
                            {index <= 9 ? `0${index + 1}` : index + 1}
                          </StyledTableCell>
                          <StyledTableCell
                            align="center"
                            className="cursor-pointer hover:shadow-md duration-150"
                            onClick={() => handleEmailClick(row.id, row.name)}
                          >
                            {row.name}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {row.date}
                            <br />
                            {row.time}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.votarNumber.toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell align="center">
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
                          <StyledTableCell align="center">
                            NGN {row.amount.toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <SwitchButton />
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {plans === "votar-credits" && (
                <TableContainer
                  sx={{ maxHeight: 500 }}
                  className="table-scroll"
                >
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
                      {votarProAcessRequest.map((row, index) => (
                        <TableRow key={row.id}>
                          <StyledTableCell align="center">
                            {index <= 9 ? `0${index + 1}` : index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.name}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            {row.date}
                            <br />
                            {row.time}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.votarNumber.toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell align="center">
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
                          <StyledTableCell align="center">
                            NGN {row.amount.toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <SwitchButton />
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default UserElections;
