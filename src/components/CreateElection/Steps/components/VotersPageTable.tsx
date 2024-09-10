import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditVotersInfo from "./EditVotersInfo";
import DropdownComponent from "./DropdownComponent";
import { TrackeChanges, VoterResponse } from "@/utils/types";
import { TableRowTypes } from "@/utils/types";
import { getVoters } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import setAuthToken from "@/utils/setAuthToken";
import { CircularProgress } from "@mui/material";
import DeleteDialog from "./DeleteDialog";
import { el } from "date-fns/locale";

interface VotersPageTableProps {
  electionId?: string;
  selectedRows: VoterResponse[];
  setSelectedRows: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
}

const VotersPageTable: React.FC<VotersPageTableProps> = ({
  electionId,
  selectedRows,
  setSelectedRows,
}) => {
  const headers = [
    "",
    "S/N",
    "ID",
    "Name",
    "Sub-Group",
    "Phone Number",
    "Email",
  ];

  const [trackChanges, setTrackChanges] = useState<TrackeChanges[]>([]);
  const [responses, setResponses] = useState<VoterResponse[]>([]);
  const [isFetchVoters, setIsFetchVoters] = useState(false);
  const users = useCurrentUser();
  const user = useUser();

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

  const handleCheckboxChange = (row: VoterResponse) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row]
    );
  };

  const filterDuplicates = (array: any, keys: any) => {
    const seen = new Set();
    return array
      .filter((item: any) => {
        const compositeKey = keys.map((key: any) => item[key]).join("|");
        const isDuplicate = seen.has(compositeKey);
        seen.add(compositeKey);
        return !isDuplicate;
      })
      .map(
        ({
          email,
          name,
          phoneNumber,
          id,
          subgroup,
        }: {
          email: string;
          name: string;
          phoneNumber: string;
          id: string;
          subgroup: string;
        }) => ({
          email,
          name,
          phoneNumber,
          id,
          subgroup,
        })
      );
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

  const handleResponseExported = async () => {
    // if (typeof window !== "undefined") {
    //   const exportedResponses = localStorage.getItem("voter_response");
    //   if (exportedResponses) {
    //     setResponses(JSON.parse(exportedResponses));
    //   }
    // }
    setIsFetchVoters(true);
    if (users?.data) {
      setAuthToken(users.data.data.cookie);
    } else {
      if (typeof window !== "undefined") {
        const tokenLocal = localStorage.getItem("token");
        setAuthToken(tokenLocal);
      }
    }

    try {
      if (typeof window !== "undefined" || electionId) {
        const electionID = localStorage.getItem("ElectionId");
        const { data } = await getVoters(USER_ID, {
          election_id: electionId || electionID,
        });
        if (data) {
          console.log(data.data);
          setIsFetchVoters(false);
          const uniqueItems = filterDuplicates(data.data, [
            "id",
            "name",
            "subgroup",
            "phone",
            "email",
          ]);
          setResponses(uniqueItems);
        }
      }
    } catch (e) {
      console.log(e);
      setIsFetchVoters(false);
    }
  };

  useEffect(() => {
    handleResponseExported();
  }, [electionId]);

  console.log(responses);

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
                    {index < 10 ? `0${index + 1}` : index + 1}
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
                    {trackChanges.length > 0 && (
                      <DropdownComponent tracked={trackChanges} index={index} />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center" className="cursor-pointer">
                    <EditVotersInfo
                      users={responses}
                      selectedRow={row}
                      index={index}
                      setTrackChanges={setTrackChanges}
                      trackChanges={trackChanges}
                      setUsers={setResponses}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center" className="cursor-pointer">
                    <DeleteDialog
                      selectedVoter={row.name}
                      row={row}
                      id={index}
                      getUpdatedList={() => handleResponseExported()}
                      voters={responses}
                      setVoters={setResponses}
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

export default VotersPageTable;
