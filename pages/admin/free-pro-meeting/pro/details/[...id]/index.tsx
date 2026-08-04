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
import { BsArrowLeft } from "react-icons/bs";
import { v4 } from "uuid";

const statusBadgeClass = (status: string) =>
  status === "Pending"
    ? "bg-orange-50 text-orange-500 border border-orange-200"
    : "bg-green-50 text-green-600 border border-green-200";

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
        <div className="py-10 text-center">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      </AdminLayout>
    );
  return (
    <AdminLayout>
      <div className="max-w-[1300px] mx-auto py-8 lg:py-[60px]">
        <button
          type="button"
          onClick={() => router.push("/admin/free-pro-meeting/pro")}
          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#015CE9]"
        >
          <BsArrowLeft /> Back to Votar Pro
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl lg:text-2xl font-bold">
            Votar Pro Access Request & Management Panel
          </div>
          <div className="w-fit rounded-lg bg-[#015CE9]/10 px-4 py-2.5 text-sm font-semibold text-[#015CE9]">
            {userMail}
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-5 px-4 lg:py-8 lg:px-9 relative w-full">
            {electionDetails.length === 0 ? (
              <div className="py-10 text-center text-gray-400">
                No elections found
              </div>
            ) : (
              <>
                {/* Mobile card list */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {electionDetails.map((row: any, index: number) => (
                    <div
                      key={v4()}
                      className="rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-400">
                            #{index < 9 ? `0${index + 1}` : index + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleEmailClick(row.id, row.nameOfElection)
                            }
                            className="block truncate text-left text-sm font-semibold text-[#015CE9]"
                          >
                            {row.nameOfElection}
                          </button>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize whitespace-nowrap ${statusBadgeClass(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {row.date}
                        </span>{" "}
                        · {row.start_time} – {row.close_time}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {row.numberOfVoters.toLocaleString()} voters
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          Send SMS
                          <SmsSwitchButton row={row} />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                          Publish
                          <SwitchButton
                            id={index}
                            row={row}
                            userMail={userMail}
                            initialStatus={row.published}
                          />
                        </div>
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
                    aria-label="votar pro user elections table"
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
                      {electionDetails.map((row: any, index: number) => (
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
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${statusBadgeClass(
                                row.status
                              )}`}
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
                              initialStatus={row.published}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserElections;
