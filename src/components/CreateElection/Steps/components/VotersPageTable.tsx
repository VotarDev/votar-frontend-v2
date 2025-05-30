import React, { useState, useEffect, useCallback } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { TrackeChanges, VoterResponse } from "@/utils/types";
import { getVoters } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import ChangeLogModal from "./DropdownComponent";
import EditVotersInfo from "./EditVotersInfo";
import Cookies from "universal-cookie";

interface VotersPageTableProps {
  electionId?: string | null;
  selectedRows: VoterResponse[];
  setSelectedRows: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
}

const VoterTable: React.FC<VotersPageTableProps> = ({
  electionId,
  selectedRows,
  setSelectedRows,
}) => {
  const headers = [
    "S/N",
    "ID",
    "Name",
    "Sub-Group",
    "Phone Number",
    "Email",
    "Changes",
    "Edit",
  ];

  const [responses, setResponses] = useState<VoterResponse[]>([]);
  const [isFetchVoters, setIsFetchVoters] = useState(false);
  const users = useCurrentUser();
  const user = useUser();
  const cookies = new Cookies();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const handleCheckboxChange = (row: VoterResponse) => {
    setSelectedRows((prevSelectedRows) => {
      const isSelected = prevSelectedRows.some(
        (selectedRow) => selectedRow.id === row.id
      );

      if (isSelected) {
        return prevSelectedRows.filter(
          (selectedRow) => selectedRow.id !== row.id
        );
      } else {
        return [...prevSelectedRows, row];
      }
    });
  };

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

  const handleResponseExported = useCallback(async () => {
    setResponses([]);
    setIsFetchVoters(true);
    const token = cookies.get("user-token");
    if (token) {
      setAuthToken(token);
    }
    // if (users?.data) {
    //   setAuthToken(users.data.data.cookie);
    // } else {
    //   if (typeof window !== "undefined") {
    //     const tokenLocal = localStorage.getItem("token");
    //     setAuthToken(tokenLocal);
    //   }
    // }

    try {
      if (electionId) {
        const { data } = await getVoters(USER_ID, {
          election_id: electionId,
        });
        if (data) {
          setIsFetchVoters(false);
          setResponses(data.data);
        }
      }
    } catch (e) {
      console.log(e);
      setIsFetchVoters(false);
    }
  }, [users, electionId]);

  useEffect(() => {
    handleResponseExported();
  }, [handleResponseExported]);

  if (isFetchVoters) {
    return (
      <div className="my-10 flex justify-center">
        <CircularProgress size={30} style={{ color: "#015CE9" }} />
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="pb-3">
        Number of Voters Selected: <strong>{selectedRows.length}</strong> of{" "}
        <strong>{responses.length}</strong>
      </div>

      <div>
        <TableContainer sx={{ maxHeight: 700 }} className="table-scroll pb-8">
          <Table
            sx={{
              minWidth: 700,
              borderCollapse: "separate",
              borderSpacing: "0",
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell
                  align="center"
                  className="border border-[#F5F5F5]"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={
                      selectedRows.length === responses.length &&
                      responses.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(responses);
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                  />
                </StyledTableCell>
                {headers.map((header, key) => (
                  <StyledTableCell
                    key={key}
                    className="border border-[#F5F5F5]"
                    align="center"
                  >
                    {header}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {responses.map((row, index) => (
                <TableRow key={index}>
                  <StyledTableCell align="center">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        checked={selectedRows.some(
                          (selectedRow) => selectedRow.id === row.id
                        )}
                        onChange={() => handleCheckboxChange(row)}
                      />
                    </div>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {index < 9 ? `0${index + 1}` : index + 1}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.id}</StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.subgroup}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.phoneNumber}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    <ChangeLogModal
                      changeLogs={row.change_logs || []}
                      voterId={row.id}
                      currentVoter={row}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center" className="cursor-pointer">
                    <EditVotersInfo
                      users={responses}
                      selectedRow={row}
                      index={index}
                      setUsers={setResponses}
                      handleResponseExported={handleResponseExported}
                    />
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default VoterTable;
