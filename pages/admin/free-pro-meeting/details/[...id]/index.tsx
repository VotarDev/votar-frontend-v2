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
import { votarProAcessRequest } from "@/utils/util";
import SwitchButton from "@/src/components/Admin/AdminProfile/SwitchButton";
import setAuthToken from "@/utils/setAuthToken";
import { getVotarPageByElection } from "@/utils/api";
import Cookies from "universal-cookie";
import { CircularProgress } from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";
import { v4 } from "uuid";

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

const UserElections = () => {
  const router = useRouter();
  const [userMail, setUserMail] = useState("");
  const [plans, setPlans] = useState("");
  const { id } = router.query;

  const [electionDetails, setElectionDetails] = useState<any>([]);
  const [isFetchElectionDetails, setIsFetchElectionDetails] = useState(false);
  const handleEmailClick = (id: string | number, name: string) => {
    router.push(`/admin/free-pro-meeting/election-details/${id}/${name}`);
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
        if (userMail && plans === "free-votar") {
          const { data } = await getVotarPageByElection(userMail, "Free Votar");
          if (data) {
            setElectionDetails(data.data);

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
          onClick={() => router.push("/admin/free-pro-meeting")}
          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#015CE9]"
        >
          <BsArrowLeft /> Back to Free Votar
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl lg:text-2xl font-bold">
            Free Votar Access Request & Management Panel
          </div>
          <div className="w-fit rounded-lg bg-[#015CE9]/10 px-4 py-2.5 text-sm font-semibold text-[#015CE9]">
            {userMail}
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] rounded py-5 px-4 lg:py-8 lg:px-9 relative w-full">
            {plans === "free-votar" &&
              (electionDetails.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  No election found
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
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-400">
                            #{index < 9 ? `0${index + 1}` : index + 1}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleEmailClick(row.election_id, row.nameOfElection)
                            }
                            className="block truncate text-left text-sm font-semibold text-[#015CE9]"
                          >
                            {row.nameOfElection}
                          </button>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          {row.date} · {row.start_time} - {row.close_time}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {row.numberOfVoters.toLocaleString()} voters
                        </div>

                        <div className="mt-3 flex items-center justify-end rounded-lg bg-gray-50 px-3 py-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            Publish
                            <SwitchButton id={index} row={row} userMail={userMail} />
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
                      aria-label="free votar election details table"
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
                        {electionDetails.map((row: any, index: number) => (
                          <StyledTableRow key={v4()}>
                            <StyledTableCell align="center">
                              {index < 9 ? `0${index + 1}` : index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                              <span
                                className="cursor-pointer text-[#015CE9] hover:underline font-semibold"
                                onClick={() =>
                                  handleEmailClick(row.election_id, row.nameOfElection)
                                }
                              >
                                {row.nameOfElection}
                              </span>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.date}
                              <br />
                              {row.start_time} - {row.close_time}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row.numberOfVoters.toLocaleString()}
                            </StyledTableCell>
                            <StyledTableCell align="center">—</StyledTableCell>
                            <StyledTableCell align="center">—</StyledTableCell>
                            <StyledTableCell align="center">
                              <SwitchButton id={index} row={row} userMail={userMail} />
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ))}

            {plans === "votar-credits" &&
              (votarProAcessRequest.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  No records found
                </div>
              ) : (
                <>
                  {/* Mobile card list */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {votarProAcessRequest.map((row, index) => (
                      <div
                        key={row.id}
                        className="rounded-xl border border-gray-100 px-4 py-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-gray-400">
                              #{index <= 9 ? `0${index + 1}` : index + 1}
                            </div>
                            <div className="truncate text-sm font-semibold text-gray-800">
                              {row.name}
                            </div>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              row.status === "pending"
                                ? "bg-orange-50 text-[#E88749]"
                                : "bg-green-50 text-green-500"
                            }`}
                          >
                            {row.status}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          {row.date} · {row.time}
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            {row.votarNumber.toLocaleString()} votes
                          </span>
                          <span className="rounded-full bg-[#015CE9]/10 px-2.5 py-1 text-xs font-semibold text-[#015CE9]">
                            NGN {row.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-end rounded-lg bg-gray-50 px-3 py-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                            Publish
                            <SwitchButton />
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
                      aria-label="votar credits table"
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
                        {votarProAcessRequest.map((row, index) => (
                          <StyledTableRow key={row.id}>
                            <StyledTableCell align="center">
                              {index <= 9 ? `0${index + 1}` : index + 1}
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.name}</StyledTableCell>
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
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserElections;
