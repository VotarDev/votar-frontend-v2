import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableRowTypes } from "@/utils/types";
import ExportToExcel from "../../ExportToExcel";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";

interface UsersDets {
  id: number;
  name: string;
  subGroup: string;
  phone: string;
  email: string;
  isDuplicate?: boolean;
}

const ResponseTable = () => {
  const headers = [
    "",
    "S/N",
    "ID",
    "Name",
    "Sub-Group",
    "Phone Number",
    "Email",
  ];
  const [selectedRows, setSelectedRows] = useState<TableRowTypes[]>([]);
  const [toggleExportToElection, setToggleExportToElection] = useState(false);
  const [users, setUsers] = useState<UsersDets[]>([
    {
      id: 1,
      name: "Amana Ona",
      subGroup: "Media",
      phone: "08021331121",
      email: "Amana@gmail.com",
    },
    {
      id: 2,
      name: "Amana Ona",
      subGroup: "Media",
      phone: "08021331121",
      email: "Amana@gmail.com",
    },
    {
      id: 3,
      name: "Amana Onana",
      subGroup: "Media",
      phone: "08021331121",
      email: "Amana@gmail.com",
    },
    {
      id: 4,
      name: "Amana Ona",
      subGroup: "Media",
      phone: "08021331121",
      email: "Amana@gmail.com",
    },
    {
      id: 5,
      name: "king ona",
      subGroup: "Acting",
      phone: "232321",
      email: "king@gmail.com",
    },
    {
      id: 5,
      name: "king ona",
      subGroup: "Acting",
      phone: "232321",
      email: "king@gmail.com",
    },
  ]);

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

  const handleCheckboxChange = (row: TableRowTypes) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row]
    );
  };
  useEffect(() => {
    const flagDuplicate = () => {
      const seen: Record<string, boolean> = {};
      const updatedData = users.map((item) => {
        const key = `${item.name}_${item.phone}_${item.email}`;

        if (seen[key]) {
          // This is a duplicate
          return { ...item, isDuplicate: true } as UsersDets;
        } else {
          seen[key] = true;
          return { ...item, isDuplicate: false } as UsersDets;
        }
      });
      setUsers(updatedData);
    };
    flagDuplicate();
  }, []);

  const excelData = users
    .filter((item) => !item.isDuplicate)
    .map((obj) => {
      const { isDuplicate, ...newObj } = obj;
      return newObj;
    });

  const handleOpen = () => setToggleExportToElection(true);
  const handleClose = () => setToggleExportToElection(false);

  return (
    <div className="mt-[80px]">
      <h1 className="underline text-blue-700 text-2xl text-center pb-10">
        Responses
      </h1>
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-5">
          <div>
            <button
              onClick={handleOpen}
              className="w-56 h-16 flex justify-center items-center p-4 text-blue-700 rounded-lg text-center bg-white text-lg border border-blue-700"
            >
              {" "}
              Export To Election
            </button>
          </div>
          <div>
            <ExportToExcel
              excelData={excelData}
              fileName={"Excel Export"}
              className="w-56 h-16 flex justify-center items-center p-4 bg-blue-700 rounded-lg text-center text-zinc-100 text-lg"
            >
              Export To Excel Sheet
            </ExportToExcel>
          </div>
        </div>
      </div>
      <div className="mt-10">
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
                <TableRow
                  key={index}
                  className={`${
                    row.isDuplicate
                      ? "opacity-30 bg-red-600 pointer-events-none"
                      : ""
                  }`}
                >
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
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.subGroup}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.phone}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <AnimatePresence mode="wait">
        {toggleExportToElection && (
          <Modal key="modal" handleClose={handleClose}>
            <div className="bg-white rounded-lg py-[24px] px-10 text-left">
              <div className="text-xl font-semibold pb-5">
                Export To Election
              </div>
              <form>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="election">Select Election</label>
                    <select
                      name="election"
                      id="election"
                      className="border border-zinc-600 w-full rounded h-12 outline-none px-4 cursor-pointer"
                    >
                      <option value="">Select Election</option>
                      <option value="1">Election 1</option>
                      <option value="2">Election 2</option>
                      <option value="3">Election 3</option>
                    </select>
                  </div>
                </div>
                <div className="mt-5">
                  <button className="w-full h-12 outline-none flex items-center justify-center bg-blue-700 text-white rounded">
                    Export To Election
                  </button>
                </div>
              </form>
              <div className="flex justify-end mt-10">
                <button
                  onClick={handleClose}
                  className="bg-red-500 text-white w-40 h-12 rounded flex items-center justify-center outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponseTable;
