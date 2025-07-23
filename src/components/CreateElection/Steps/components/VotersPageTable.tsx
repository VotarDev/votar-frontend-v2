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
import { CircularProgress, IconButton } from "@mui/material";
import ChangeLogModal from "./DropdownComponent";
import EditVotersInfo from "./EditVotersInfo";
import Cookies from "universal-cookie";
import { AnimatePresence } from "framer-motion";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Modal from "@/src/components/Modal";

interface VotersPageTableProps {
  electionId?: string | null;
  selectedRows: VoterResponse[];
  setSelectedRows: React.Dispatch<React.SetStateAction<VoterResponse[]>>;

  handleResponseExported: () => Promise<void>;
  responses: VoterResponse[];
  isFetchVoters: boolean;
  setResponses: React.Dispatch<React.SetStateAction<VoterResponse[]>>;
}

const VoterTable: React.FC<VotersPageTableProps> = ({
  electionId,
  selectedRows,
  setSelectedRows,

  handleResponseExported,
  responses,
  isFetchVoters,
  setResponses,
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
    "Status",
  ];

  const users = useCurrentUser();
  const user = useUser();
  const cookies = new Cookies();
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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

  const handleClose = () => {
    setOpenStatusModal(false);
  };

  const handleStatusClick = (status: string) => {
    setSelectedStatus(status);
    setOpenStatusModal(true);
  };

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
      <div className="pb-3 flex items-center gap-2">
        <label>Select All:</label>
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={
            selectedRows.length === responses.length && responses.length > 0
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(responses);
            } else {
              setSelectedRows([]);
            }
          }}
        />
      </div>
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
                ></StyledTableCell>
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
                  <StyledTableCell align="center">
                    {row.email_status === "pending" ? (
                      <span className="text-orange-300 capitalize">
                        {row.email_status}
                      </span>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span
                          className="text-green-600 cursor-pointer"
                          onClick={() => handleStatusClick(row.email_reason)}
                        >
                          Email Sent
                        </span>
                        <IconButton>
                          <ArrowDropDownIcon style={{ color: "#015CE9" }} />
                        </IconButton>
                      </div>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <AnimatePresence mode="wait">
        {openStatusModal && (
          <Modal key="status-modal" handleClose={handleClose}>
            <div className="p-8 bg-white rounded-lg max-w-[300px] w-full">
              <h2 className="text-2xl font-bold mb-4">Email Status</h2>
              <p className="mb-4">{selectedStatus}</p>
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoterTable;
