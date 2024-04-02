import React, { useState } from "react";
import AdminLayout from "../AdminLayout";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Modal from "../../Modal";
import { AnimatePresence } from "framer-motion";
import AddAdmin from "./AddAdmin";
import SwitchButton from "./SwitchButton";
import EditAdminForm from "./EditAdminForm";
import DeleteDialog from "./DeleteDialog";

const AdminProfile = () => {
  const headers = [
    "S/N",
    "Name",
    "Username",
    "Password",
    "Access",
    "Edit",
    "Delete",
  ];

  const [admins, setAdmins] = useState([
    {
      name: "",
      username: "",
      password: "",
      access: false,
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => setShowModal(false);

  const handleAddAdmin = () => {
    setAdmins([
      ...admins,
      {
        name: "",
        username: "",
        password: "",
        access: false,
      },
    ]);
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

  return (
    <AdminLayout>
      <div className="my-[60px] max-w-[1300px] mx-auto">
        <div className="pb-9 font-bold text-2xl">Admin Profile</div>
        <div className="shadow-[0px_4px_39px_0px_rgba(0_,0_,0_,0.08)] p-8">
          <TableContainer sx={{ maxHeight: 500 }} className="table-scroll">
            <Table
              sx={{
                minWidth: 700,
                borderCollapse: "separate",
                borderSpacing: "0",
              }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow className="text-white font-bold">
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
                {admins
                  .filter((item) => item.name || item.username || item.password)
                  .map((row, index) => (
                    <TableRow key={index}>
                      <StyledTableCell align="center">
                        {index < 9 ? `0${index + 1}` : index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.username}
                      </StyledTableCell>
                      <StyledTableCell align="center">********</StyledTableCell>
                      <StyledTableCell align="center">
                        <SwitchButton />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <EditAdminForm
                          selectedAdmin={row}
                          num={index}
                          admins={admins}
                          setAdmins={setAdmins}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <DeleteDialog
                          selectedAdmin={row.name}
                          id={index}
                          admins={admins}
                          setAdmins={setAdmins}
                        />
                      </StyledTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-44 h-12 mt-10 flex justify-center items-center bg-blue-700 gap-2.5 text-zinc-100 lg:text-xl text-base font-semibold outline-none rounded-lg"
            >
              <span>+</span>
              <span>Add Admin</span>
            </button>
          </div>
          <AnimatePresence mode="wait">
            {showModal && (
              <Modal key="modal" handleClose={closeModal}>
                <AddAdmin
                  handleClose={closeModal}
                  admins={admins}
                  setAdmins={setAdmins}
                />
              </Modal>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
