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
import { getVotarPageByElection } from "@/utils/api";
import Cookies from "universal-cookie";
import SwitchButton from "@/src/components/Admin/AdminProfile/SwitchButton";
import SmsSwitchButton from "@/src/components/Admin/AdminProfile/SmsSwitchButton";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import { v4 } from "uuid";

const UserElections = () => {
  const router = useRouter();
  const [userMail, setUserMail] = useState("");
  const [electionDetails, setElectionDetails] = useState<any>([]);
  const [isFetchElectionDetails, setIsFetchElectionDetails] = useState(false);
  const [plans, setPlans] = useState("");
  const { id } = router.query;
  const handleEmailClick = (id: string | number, name: string) => {
    router.push(
      `/admin/free-pro-meeting/votarpro-election-details/${id}/${name}`
    );
  };
  useEffect(() => {
    if (id) {
      setUserMail(id[1]);
      setPlans(id[0]);
    }
  }, [id]);

  useEffect(() => {
    const getVotarProPower = async () => {
      setIsFetchElectionDetails(true);
      const cookies = new Cookies();
      const token = cookies.get("admin-token");
      if (token) setAuthToken(token);
      try {
        if (userMail && plans === "votar-pro") {
          const { data } = await getVotarPageByElection(userMail, "");
          if (data) {
            setElectionDetails(data.data);
            console.log(data.data);
            setIsFetchElectionDetails(false);
          }
        }
      } catch (e: any) {
        console.log(e);
        setIsFetchElectionDetails(false);
      }
    };
    getVotarProPower();
  }, [userMail, plans]);

  const headers = [
    "S/N",
    "Election",
    "Time and Date",
    "Number of Voters",
    "Status",
    "Amount",
    "Send SMS",
    "Publish",
  ];
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#015ce9",
      color: theme.palette.common.white,
      fontSize: 15,
      fontWeight: "bold",
      padding: "14px 16px",
      whiteSpace: "nowrap",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      fontWeight: 500,
      border: "none",
      padding: "12px 16px",
      color: "#1e293b",
    },
  }));

  const StyledTableRow = styled(TableRow)(() => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#f8faff",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#ffffff",
    },
    "&:hover": {
      backgroundColor: "#eef4ff",
      transition: "background-color 0.15s ease",
    },
  }));

  if (isFetchElectionDetails)
    return (
      <AdminLayout>
        <div className="text-center mt-10">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      </AdminLayout>
    );
  return (
    <div>
      <AdminLayout>
        <div className="py-[60px] max-w-[1300px] mx-auto ">
          <div className="text-2xl font-bold">
            Votar Pro Access Request & Management Panel
          </div>
          <div className="text-slate-900 text-xl font-semibold pt-8 underline">
            Email: {userMail}
          </div>

          <div className="pt-8">
            <div className="mt-8 bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-8 px-9 relative w-full">
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
                    {electionDetails.length === 0 && (
                      <StyledTableRow>
                        <StyledTableCell colSpan={8} align="center">
                          <span className="text-slate-400 text-sm">No elections found</span>
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                    {electionDetails &&
                      electionDetails.length > 0 &&
                      electionDetails.map((row: any, index: number) => (
                        <StyledTableRow key={v4()}>
                          <StyledTableCell align="center">
                            <span className="text-slate-500 text-xs font-semibold">
                              {index < 9 ? `0${index + 1}` : index + 1}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <span
                              className="cursor-pointer text-[#015ce9] hover:underline font-semibold"
                              onClick={() =>
                                handleEmailClick(row.id, row.nameOfElection)
                              }
                            >
                              {row.nameOfElection}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="font-medium">{row.date}</span>
                              <span className="text-xs text-slate-400">
                                {row.start_time} – {row.close_time}
                              </span>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.numberOfVoters.toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${
                                row.status === "Pending"
                                  ? "bg-orange-50 text-orange-500 border border-orange-200"
                                  : "bg-green-50 text-green-600 border border-green-200"
                              }`}
                            >
                              {row.status}
                            </span>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <span className="text-slate-400">—</span>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <SmsSwitchButton row={row} />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <SwitchButton
                              id={index}
                              row={row}
                              userMail={userMail}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default UserElections;
