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
import { CircularProgress, IconButton, TablePagination } from "@mui/material";
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
    "Select",
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
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [openRangeModal, setOpenRangeModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

      fontSize: 14,
      fontWeight: "bold",
      padding: "12px 8px",
      whiteSpace: "nowrap",
      textAlign: "center",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 13,
      fontWeight: 500,
      border: "none",
      padding: "8px",
      textAlign: "center",
      verticalAlign: "middle",
      maxWidth: "150px",
      wordWrap: "break-word",
      lineHeight: "1.4",
    },
  }));

  const handleRangeSelect = () => {
    if (
      rangeStart < 1 ||
      rangeEnd > responses.length ||
      rangeStart > rangeEnd
    ) {
      setOpenRangeModal(true);
      return;
    }

    const selectedInRange = responses.slice(rangeStart - 1, rangeEnd);
    setSelectedRows(selectedInRange);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedResponses = responses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleClose = () => {
    setOpenStatusModal(false);
  };

  const handleStatusClick = (
    event: React.MouseEvent<HTMLElement>,
    status: string
  ) => {
    setSelectedStatus(status);
    setOpenStatusModal(true);
  };

  const getStatusDisplay = (row: VoterResponse) => {
    if (row.email_status === "pending") {
      return (
        <span
          className="text-orange-300 capitalize cursor-pointer px-2 py-1 rounded-full bg-orange-100 text-sm"
          onClick={(e) => handleStatusClick(e, row.email_reason || "No reason")}
        >
          {row.email_status}
        </span>
      );
    } else if (row.email_status === "sent") {
      return (
        <span
          className="text-green-600 capitalize cursor-pointer px-2 py-1 rounded-full bg-green-100 text-sm"
          onClick={(e) => handleStatusClick(e, row.email_reason || "No reason")}
        >
          Email Sent
        </span>
      );
    } else {
      return (
        <span
          className="text-red-600 capitalize cursor-pointer px-2 py-1 rounded-full bg-red-100 text-sm"
          onClick={(e) => handleStatusClick(e, row.email_reason || "No reason")}
        >
          {row.email_status}
        </span>
      );
    }
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
    <div className="lg:pt-24 pt-10">
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

      <div className="flex items-center gap-4 pb-4 flex-wrap">
        <label className="flex items-center gap-1">
          From:{" "}
          <input
            type="number"
            min={1}
            max={responses.length}
            value={rangeStart}
            onChange={(e) => setRangeStart(Number(e.target.value))}
            className="border px-2 py-1 w-20 rounded"
          />
        </label>
        <label className="flex items-center gap-1">
          To:{" "}
          <input
            type="number"
            min={1}
            max={responses.length}
            value={rangeEnd}
            onChange={(e) => setRangeEnd(Number(e.target.value))}
            className="border px-2 py-1 w-20 rounded"
          />
        </label>
        <button
          onClick={handleRangeSelect}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Select Range
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden mt-5">
        <div className="space-y-4">
          {paginatedResponses.map((row, index) => {
            const actualIndex = page * rowsPerPage + index;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedRows.some(
                        (selectedRow) => selectedRow.id === row.id
                      )}
                      onChange={() => handleCheckboxChange(row)}
                    />
                    <span className="text-sm font-semibold text-gray-600">
                      #
                      {actualIndex < 9
                        ? `0${actualIndex + 1}`
                        : actualIndex + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EditVotersInfo
                      users={responses}
                      selectedRow={row}
                      index={index}
                      setUsers={setResponses}
                      handleResponseExported={handleResponseExported}
                    />
                    <ChangeLogModal
                      changeLogs={row.change_logs || []}
                      voterId={row.id}
                      currentVoter={row}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        ID
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {row.id}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {row.name}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Sub-Group
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {row.subgroup}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </span>
                      <p className="text-sm font-medium text-gray-900">
                        {row.phoneNumber}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </span>
                      <p className="text-sm font-medium text-gray-900 break-all">
                        {row.email}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status
                      </span>
                      <div className="mt-1">{getStatusDisplay(row)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <TablePagination
            component="div"
            count={responses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Items per page:"
            sx={{
              "& .MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                gap: 1,
              },
              "& .MuiTablePagination-selectLabel": {
                fontSize: "14px",
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "14px",
              },
            }}
          />
        </div>
      </div>

      <div className="hidden sm:block mt-10">
        <TableContainer
          sx={{
            maxHeight: 700,
            overflow: "auto",
          }}
          className="table-scroll pb-8"
        >
          <Table
            sx={{
              minWidth: 1020,
              borderCollapse: "separate",
              borderSpacing: "0",
            }}
          >
            <TableHead sx={{ position: "sticky", top: 0, zIndex: 10 }}>
              <TableRow>
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
                  <StyledTableCell>
                    <div className="truncate">{row.id}</div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div
                      className="truncate font-medium text-gray-900"
                      title={row.name}
                    >
                      {row.name}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="truncate" title={row.subgroup}>
                      {row.subgroup}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="truncate" title={row.phoneNumber}>
                      {row.phoneNumber}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div
                      title={row.email}
                      className="truncate break-all text-gray-900"
                    >
                      {row.email}
                    </div>
                  </StyledTableCell>
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
                    {getStatusDisplay(row)}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={responses.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Items per page:"
          sx={{
            borderTop: "1px solid #e5e7eb",
            "& .MuiTablePagination-toolbar": {
              minHeight: "52px",
            },
          }}
        />
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
