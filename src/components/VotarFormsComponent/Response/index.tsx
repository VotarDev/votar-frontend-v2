import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ElectionDetails, TableRowTypes, VoterResponse } from "@/utils/types";
import ExportToExcel from "../../ExportToExcel";
import { AnimatePresence } from "framer-motion";
import Modal from "@/src/components/Modal";
import ExportModal from "./ExportModal";
import ImportModal from "./ImportModal";
import XSLX from "sheetjs-style";
import { getElections } from "@/utils/api";
import { useCurrentUser, useUser } from "@/utils/hooks";
import { getVoterResponse } from "@/utils/api";
import { useRouter } from "next/router";

import { CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";

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
  const [selectedRows, setSelectedRows] = useState<VoterResponse[]>([]);
  const [toggleExportToElection, setToggleExportToElection] = useState(false);
  const [toggleImportElection, setToggleImportElection] =
    useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [elections, setElections] = useState<ElectionDetails[]>([]);
  const [electionID, setElectionID] = useState("");
  const [votarResponses, setVotarResponses] = useState<VoterResponse[]>([]);
  const [isFetchResponse, setIsFetchResponse] = useState(false);
  const users = useCurrentUser();
  const user = useUser();
  const router = useRouter();
  const { id } = router.query;
  let idType: string | string[] | undefined = id;

  let USER_ID = users?.data?.data
    ? users?.data?.data?._id
    : users?.id
    ? users?.id
    : user?.user?.id;

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

  const handleCheckboxChange = (row: VoterResponse) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.some((selectedRow) => selectedRow.id === row.id)
        ? prevSelectedRows.filter((selectedRow) => selectedRow.id !== row.id)
        : [...prevSelectedRows, row]
    );
  };

  const flagDuplicate = () => {
    const seen: Record<string, boolean> = {};
    const updatedData = votarResponses.map((item) => {
      const key = `${item.name}_${item.phoneNumber}_${item.email}`;

      if (seen[key]) {
        // This is a duplicate
        return { ...item, isDuplicate: true } as VoterResponse;
      } else {
        seen[key] = true;
        return { ...item, isDuplicate: false } as VoterResponse;
      }
    });
    setVotarResponses(updatedData);
  };

  useEffect(() => {
    if (Array.isArray(idType)) {
      setElectionID(idType[0]);
    } else {
      console.log("ID is undefined");
    }
  }, []);

  console.log(electionID);

  useEffect(() => {
    const getElectionsData = async () => {
      try {
        const { data } = await getElections(USER_ID);
        if (data) {
          setElections(data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getElectionsData();
  }, []);

  useEffect(() => {
    const getVoterResponses = async () => {
      setIsFetchResponse(true);
      try {
        if (electionID) {
          const bodyData = { election_id: electionID };
          const { data } = await getVoterResponse(USER_ID, bodyData);
          if (data) {
            console.log(data.data.voter_response);
            setVotarResponses(data.data.voter_response);
            setIsFetchResponse(false);
            const seen: Record<string, boolean> = {};
            const updatedData = data.data.voter_response.map(
              (item: VoterResponse) => {
                const key = `${item.name}_${item.phoneNumber}_${item.email}`;

                if (seen[key]) {
                  // This is a duplicate
                  return { ...item, isDuplicate: true } as VoterResponse;
                } else {
                  seen[key] = true;
                  return { ...item, isDuplicate: false } as VoterResponse;
                }
              }
            );
            setVotarResponses(updatedData);
          }
        }
      } catch (error) {
        console.log(error);
        setIsFetchResponse(false);
      }
    };

    getVoterResponses();
  }, [electionID]);

  const excelData = votarResponses
    .filter((item) => !item.isDuplicate)
    .map((obj) => {
      const { isDuplicate, ...newObj } = obj;
      return newObj;
    });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          const binaryStr = e.target?.result;
          const workBook = XSLX.read(binaryStr, { type: "binary" });
          const workSheetName = workBook.SheetNames[0];
          const workSheet = workBook.Sheets[workSheetName];
          const csvData: any = XSLX.utils.sheet_to_json(workSheet, {
            header: 1,
          });

          const newUserData = csvData
            .map(
              ([id, name, subGroup, phone, email]: [
                number | string,
                string,
                string,
                string,
                string
              ]) => ({
                id,
                name,
                subGroup,
                phone,
                email,
              })
            )
            .filter(
              (newUser: any) =>
                !votarResponses.some(
                  (existingUser) => existingUser.id === newUser.id
                )
            );
          const combinedData = [...votarResponses, ...newUserData];
          setVotarResponses(combinedData);
          const seen: Record<string, boolean> = {};
          const updatedData = combinedData.map((item) => {
            const key = `${item.name}_${item.phoneNumber}_${item.email}`;

            if (seen[key]) {
              // This is a duplicate
              return { ...item, isDuplicate: true } as VoterResponse;
            } else {
              seen[key] = true;
              return { ...item, isDuplicate: false } as VoterResponse;
            }
          });
          setVotarResponses(updatedData);
        }
        handleCloseImportElection();
      };

      reader.readAsBinaryString(selectedFile);
    }
  };

  const importFromExcel = () => {
    const worksheet = XSLX.utils.json_to_sheet(votarResponses);
    const newWorkbook = XSLX.utils.book_new();
    XSLX.utils.book_append_sheet(newWorkbook, worksheet, "Sheet1");
    XSLX.writeFile(newWorkbook, "users.xlsx");
  };

  const filterDuplicates = (array: any, keys: any) => {
    const seen = new Set();
    return array.filter((item: any) => {
      const compositeKey = keys.map((key: any) => item[key]).join("|");
      const isDuplicate = seen.has(compositeKey);
      seen.add(compositeKey);
      return !isDuplicate;
    });
  };

  const exportResponseToElection = () => {
    const uniqueItems = filterDuplicates(votarResponses, [
      "id",
      "name",
      "subGroup",
      "phone",
      "email",
    ]);

    localStorage.setItem("voter_response", JSON.stringify(uniqueItems));
    toast.success("Responses exported successfully");
    window.dispatchEvent(new Event("responsesExported"));
  };

  const handleOpen = () => setToggleExportToElection(true);
  const handleClose = () => setToggleExportToElection(false);
  const handleOpenImportElection = () => setToggleImportElection(true);
  const handleCloseImportElection = () => setToggleImportElection(false);

  return (
    <div className="mt-[80px] max-w-[1500px] mx-auto">
      <h1 className="underline text-blue-700 text-2xl text-center pb-10">
        Responses
      </h1>
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={handleOpenImportElection}
            className="w-72 h-16 flex justify-center items-center p-4 bg-blue-700 rounded-lg text-center text-zinc-100 text-lg"
          >
            Import From Excel Sheet
          </button>
        </div>
        <div className="flex items-center gap-5">
          <div>
            <button
              onClick={exportResponseToElection}
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
      {isFetchResponse ? (
        <div className="mt-10">
          <CircularProgress size={30} style={{ color: "#015CE9" }} />
        </div>
      ) : (
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
                {votarResponses.map((row, index) => (
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
                      {index < 9 ? `0${index + 1}` : index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.id}</StyledTableCell>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.subGroup}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.phoneNumber}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <AnimatePresence mode="wait">
        {toggleExportToElection && (
          <Modal key="modal" handleClose={handleClose}>
            <ExportModal handleClose={handleClose} election={elections} />
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {toggleImportElection && (
          <Modal key="modal" handleClose={handleCloseImportElection}>
            <ImportModal
              handleClose={handleCloseImportElection}
              handleFileUpload={handleFileUpload}
              handleFileChange={handleFileChange}
              selectedFile={selectedFile}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponseTable;
