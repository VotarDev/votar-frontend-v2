import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@/src/components/Modal";
import { AnimatePresence } from "framer-motion";
import EditForm from "../EditForm";

const EditAdminForm = ({ selectedAdmin, setAdmins, admins, num }: any) => {
  const [open, setOpen] = useState(false);
  const [inputData, setInputData] = useState({
    name: selectedAdmin.name,
    username: selectedAdmin.username,
    password: selectedAdmin.password,
  });
  const { name, username, password } = inputData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const adminData = { ...inputData, access: false };
    const updatedUsers = admins
      .filter((item: any) => item.name || item.username || item.password)
      .map((item: any, key: number) => {
        if (key === num) {
          return adminData;
        } else {
          return item;
        }
      });
    // console.log(adminData);
    setAdmins(updatedUsers);
    handleClickClose();
    // console.log(adminData);
  };
  console.log(admins);
  const handleClickOpen = () => setOpen(true);
  const handleClickClose = () => setOpen(false);
  const formDetails = [
    {
      name: "name",
      id: "name",
      label: "Name",
      defaultValue: name,
    },
    {
      name: "username",
      id: "username",
      label: "Username",
      defaultValue: username,
    },
    {
      name: "password",
      id: "password",
      label: "Password",
      defaultValue: password,
    },
  ];
  return (
    <div>
      <div onClick={handleClickOpen} className="cursor-pointer">
        <EditIcon />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <Modal key="modal" handleClose={handleClickClose}>
            <EditForm
              handleClose={handleClickClose}
              formDetails={formDetails}
              handleChange={handleChange}
              onSubmit={handleEditAdmin}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditAdminForm;
