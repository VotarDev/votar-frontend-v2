import React, { useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import EditVotersInfo from "./EditVotersInfo";
import DropdownComponent from "./DropdownComponent";
import { TrackeChanges } from "@/utils/types";
import { TableRowTypes } from "@/utils/types";

const VotersPageTable = () => {
  const headers = [
    "",
    "S/N",
    "ID",
    "Name",
    "Sub-Group",
    "Phone Number",
    "Email",
  ];
  const [users, setUsers] = useState([
    {
      id: 1,
      user_id: "ASS/2018/034",
      name: "Amana Ona",
      subGroup: "Media",
      phone: "08021331121",
      email: "Amana@gmail.com",
    },
    {
      id: 2,
      user_id: "BSS/2019/045",
      name: "Amana Onana",
      subGroup: "Media",
      phone: "08021331121",
      email: "Amana@gmail.com",
    },
  ]);

  const [selectedRows, setSelectedRows] = useState<TableRowTypes[]>([]);
  const [trackChanges, setTrackChanges] = useState<TrackeChanges[]>([]);

  const handleCheckboxChange = (row: TableRowTypes) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row]
    );
  };

  // console.log(trackChanges);

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

  return (
    <div className="pt-24">
      <div className="pb-3">
        Number of Voters Selected: <strong>{selectedRows.length}</strong> of{" "}
        <strong>{users.length}</strong>
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
              {users.map((row, index) => (
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
                  <StyledTableCell align="center">
                    {row.user_id}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.subGroup}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.phone}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    {trackChanges.length > 0 && (
                      <DropdownComponent tracked={trackChanges} index={index} />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center" className="cursor-pointer">
                    <EditVotersInfo
                      users={users}
                      selectedRow={row}
                      index={index}
                      setTrackChanges={setTrackChanges}
                      trackChanges={trackChanges}
                      setUsers={setUsers}
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
