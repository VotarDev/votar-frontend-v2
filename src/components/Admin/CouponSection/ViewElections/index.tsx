import React, { useState } from "react";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface ViewElectionsProps {
  selectedElection: ElectionData;
  num: number;
}
interface ElectionData {
  id: number;
  couponName: string;
  couponCodeCriteria: string;
  elections: string;
  couponAccess: string;
}

const tableData = [
  {
    id: 1,
    elections: "National economics election",
    actualAmount: "20000",
    discountedAmount: "10000",
  },
  {
    id: 2,
    elections: "Biology election",
    actualAmount: "15000",
    discountedAmount: "7500",
  },
  {
    id: 3,
    elections: "Mechanical election",
    actualAmount: "12000",
    discountedAmount: "6000",
  },
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
const ViewElections = ({ selectedElection, num }: ViewElectionsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);
  const headers = ["S/N", "Elections", "Actual Amount", "Discounted Amount"];
  return (
    <div>
      <div onClick={handleClickOpen} className="cursor-pointer">
        {" "}
        View elections
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal
            handleClose={handleClickClose}
            key="modal"
            className="max-w-[60rem]"
          >
            <div className="bg-white w-full p-4 sm:p-10">
              <div className="flex justify-end mb-5">
                <input
                  type="text"
                  placeholder="Search Elections"
                  className="w-full sm:w-72 h-12 p-4 border outline-none font-normal rounded-3xl"
                />
              </div>
              <h1 className="text-lg">
                Elections for: {selectedElection.couponName}
              </h1>
              <div className="mt-5">
                {/* Mobile card list */}
                <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto sm:hidden">
                  {tableData.map((row, index) => (
                    <div
                      key={row.id}
                      className="rounded-xl border border-gray-100 px-4 py-3 text-left shadow-sm"
                    >
                      <div className="text-xs font-medium text-gray-400">
                        #{index <= 9 ? `0${index + 1}` : index + 1}
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {row.elections}
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-gray-500">
                        <span>Actual: {row.actualAmount}</span>
                        <span>Discounted: {row.discountedAmount}</span>
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
                      minWidth: 500,
                      borderCollapse: "separate",
                      borderSpacing: "0",
                      fontSize: 14,
                    }}
                    stickyHeader
                    aria-label="sticky table"
                  >
                    <TableHead>
                      <TableRow className="text-white font-bold text-sm">
                        {headers.map((header, key) => {
                          return (
                            <StyledTableCell
                              key={key}
                              className=" border border-[#F5F5F5]"
                              align="center"
                              style={{ fontSize: 14 }}
                            >
                              {header}
                            </StyledTableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((row, index) => (
                        <TableRow key={row.id}>
                          <StyledTableCell align="center">
                            {index <= 9 ? `0${index + 1}` : index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.elections}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.actualAmount}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.discountedAmount}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewElections;
