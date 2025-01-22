import React, { useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/router";
import mastercard from "../../../../../public/assets/icons/mastercard.png";
import visacard from "../../../../../public/assets/icons/visa.jpeg";
import { TrackeChanges } from "@/utils/types";
import { CardRowTypess } from "@/utils/types";
import { CiSearch } from "react-icons/ci";

const CardTable = ({ cards, debitCards }: any) => {
  const headers = [
    "Card Name",
    "Status",
    "Card Holder",
    "Number",
    "Expires on",
    "",
  ];
  const router = useRouter();
  console.log(debitCards.card_stored);
  const [selectedRows, setSelectedRows] = useState<CardRowTypess[]>([]);

  const [trackChanges, setTrackChanges] = useState<TrackeChanges[]>([]);

  const handleCheckboxChange = (row: CardRowTypess) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row]
    );
  };

  const editCardHandler = (id: string | number) => {
    router.push(`/profile/billing/edit/${id}`);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "transparent",
      color: theme.palette.common.black,
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
    <div className="pt-4">
      <div className="relative items-center">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          className="lg:w-[429px] h-[44px] w-full py-3 pl-12 pr-5 outline-none bg-[#FDFDFD] rounded-lg border"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">
          <CiSearch />
        </span>
      </div>

      <div>
        <TableContainer
          sx={{ maxHeight: 700 }}
          className="table-scroll pb-8 pt-4"
        >
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
                      className=" border-y border-y-blue-700"
                      align="center"
                    >
                      {header}
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            {debitCards?.card_stored?.length === 0 ? (
              <div className="text-center mt-5">No card found</div>
            ) : (
              <TableBody>
                {debitCards?.card_stored &&
                  debitCards?.card_stored.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <StyledTableCell align="center" className="capitalize">
                        {row.bank_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {/* <span
                        className={`p-2 rounded-lg ${
                          row.status === "Active"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      >
                        {row.status}
                      </span> */}
                      </StyledTableCell>
                      <StyledTableCell align="center" className="capitalize">
                        {row.billing_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex items-center gap-2 justify-center">
                          {row.pseudo_card_number?.startsWith("4") ? (
                            <img
                              src={visacard.src}
                              alt="Visa Card"
                              className="w-10 h-10 object-contain"
                            />
                          ) : (
                            <img
                              src={mastercard.src}
                              alt="Master Card"
                              className="w-10 h-10 object-contain"
                            />
                          )}
                          <span>****</span>
                          {row.pseudo_card_number?.slice(-4)}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {" "}
                        {row.expire_date}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className="cursor-pointer"
                      >
                        <button
                          onClick={() => editCardHandler(index + 1)}
                          className="border-none outline-none w-40 h-12 flex items-center justify-center bg-blue-700 rounded-lg text-white"
                        >
                          Edit
                        </button>
                      </StyledTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default CardTable;
